import { defineStore } from "pinia";
import type { IGNLAccount, IStatistics } from "@/utilities/types";
import moment from "moment";
import {
  getInfo,
  getRaceStatistics,
  getSeasonGamesBetween,
  getwins,
  isRace,
} from "@/utilities/matchcalculator";
import { Race } from "@/stores/races";
import { ref } from "vue";

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

export const createGNLStore = (
  season: number,
  coaches: IGNLAccount[],
  players: IGNLAccount[],
) => {
  return defineStore(`gnl/${season}`, () => {
    const data = ref<any>({} as any);
    const dates = {
      start: moment("01.08.2024", "DD.MM.YYYY").startOf("day"),
      end: moment("01.10.2024", "DD.MM.YYYY").startOf("day"),
      today: moment().startOf("day"),
      daysSinceStart: moment()
        .startOf("day")
        .diff(moment("01.07.2024", "DD.MM.YYYY").startOf("day"), "days"),
    };

    // Do it live!
    const refresh = async () => {
      const result = {};
      await Promise.all(
        [...coaches, ...players].map(async (account: IGNLAccount): Promise => {
          result[account.battleTag] = await getData(
            account.battleTag,
            dates.start,
            dates.end,
          );
        }),
      );

      data.value = result;
      // setTimeout(refresh, 10000);
    };

    void refresh();
    return { season, data, dates, coaches, players };
  });
};
