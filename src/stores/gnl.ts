import { defineStore } from "pinia";
import type { IGNLAccount, IStatistics } from "@/utilities/types";
import moment from "moment";
import {
  getInfo,
  getRaceStatistics,
  getSeasonGamesBetween,
  isRace,
} from "@/utilities/matchcalculator";
import { Race } from "@/stores/races";
import { computed, ref } from "vue";
import { doc, setDoc } from "firebase/firestore";

const getData = async (tag: string, start: Moment, end: Moment) => {
  let result: IStatistics = {} as any;
  let seasonActual = [];

  try {
    let all = await getSeasonGamesBetween(tag, 19, start, end);

    // Filter out freewins/loss and bugs
    seasonActual = all.filter((m) => m.durationInSeconds > 240);

    const info = getInfo(tag, seasonActual);
    const season = {
      [Race.Human]: seasonActual.filter((m) => isRace(tag, m, Race.Human)),
      [Race.Orc]: seasonActual.filter((m) => isRace(tag, m, Race.Orc)),
      [Race.Undead]: seasonActual.filter((m) => isRace(tag, m, Race.Undead)),
      [Race.NightElf]: seasonActual.filter((m) =>
        isRace(tag, m, Race.NightElf),
      ),
      [Race.Random]: seasonActual.filter((m) => isRace(tag, m, Race.Random)),
    };

    result = {
      battleTag: info.battleTag,
      race: info.race,
      season: {
        summary: getRaceStatistics(tag, seasonActual),
        [Race.Random]: getRaceStatistics(tag, season[Race.Random]),
        [Race.Human]: getRaceStatistics(tag, season[Race.Human]),
        [Race.Orc]: getRaceStatistics(tag, season[Race.Orc]),
        [Race.Undead]: getRaceStatistics(tag, season[Race.Undead]),
        [Race.NightElf]: getRaceStatistics(tag, season[Race.NightElf]),
      },
    };
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const useGNLStore = defineStore("gnl", () => {
  const coaches = ref<IGNLAccount[]>([]);
  const players = ref<IGNLAccount[]>([]);
  const timer = ref<number>();

  const allData = ref<any>({} as any);
  const data = ref<any>({} as any);

  const start = ref<Moment>(moment());
  const end = ref<Moment>(moment());

  const dates = computed(() => ({
    start: start.value.startOf("day"),
    end: end.value.startOf("day"),
    today: moment().startOf("day"),
    daysSinceStart: moment()
      .startOf("day")
      .diff(start.value.startOf("day"), "days"),
    durationInDays: Math.abs(
      end.value.startOf("day").diff(start.value.startOf("day"), "days"),
    ),
  }));

  // Do it live!
  const refresh = async () => {
    const result = {};
    await Promise.all(
      players.value.map(async (account: IGNLAccount): Promise => {
        result[account.battleTag] = await getData(
          account.battleTag,
          dates.value.start,
          dates.value.end,
        );
      }),
    );

    data.value = result;
    timer.value = setTimeout(refresh, 10000);
  };

  const initialize = (d, t) => {
    start.value = moment(d.start, "DD.MM.YYYY");
    end.value = moment(d.end, "DD.MM.YYYY");

    clearTimeout(timer.value);
    data.value = {};

    coaches.value = t.coaches;
    players.value = t.players;

    void refresh();
  };

  const clear = () => {
    data.value = {};
    coaches.value = [];
    players.value = [];
  };

  const all = async (d: any) => {
    start.value = moment(d.start, "DD.MM.YYYY");
    end.value = moment(d.end, "DD.MM.YYYY");

    let result = [];
    for (let i = 0; i < d.teams.length; i++) {
      const team = d.teams[i];
      const data = await Promise.all(
        team.players.map(async (account: IGNLAccount): Promise => {
          return await getData(
            account.battleTag,
            dates.value.start,
            dates.value.end,
          );
        }),
      );

      result.push({
        ...team,
        data: data,
      });
    }
    allData.value = result;
  };

  const save = async (item: any) => {
    try {
      await setDoc(doc(db, "gnl", item.id), item);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    initialize,
    clear,
    all,
    allData,
    data,
    dates,
    coaches,
    players,
    save,
  };
});
