import { defineStore } from "pinia";
import type { IGNLAccount, IGNLStatistics } from "@/utilities/types";
import moment from "moment";
import type { Moment } from "moment";
import {
  getInfo,
  getRaceStatistics,
  getSeasonGamesBetween,
  isRace,
} from "@/utilities/matchcalculator";
import { Race } from "@/stores/races";
import { computed, ref } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
import gnl_team_rageandape from "@assets/gnl/teams/rage_and_ape.jpg";
import gnl_team_apelords from "@assets/gnl/teams/apelords.jpg";
import gnl_team_mannertime from "@assets/gnl/teams/mannertime.png";
import gnl_team_gigglinggoblins from "@assets/gnl/teams/goblins.jpg";
import gnl_team_gnlbears from "@assets/gnl/teams/bears.jpg";
import gnl_team_chinesepaladin from "@assets/gnl/teams/chinesepaladin.jpg";
import gnl_team_missing from "@/assets/creeproutes/missing.png";
import _isEmpty from "lodash/isEmpty";

const gnlBanners = {
  ["chinesepaladin"]: gnl_team_chinesepaladin,
  ["rageandape"]: gnl_team_rageandape,
  ["apelords"]: gnl_team_apelords,
  ["mannertime"]: gnl_team_mannertime,
  ["gigglinggoblins"]: gnl_team_gigglinggoblins,
  ["gnlbears"]: gnl_team_gnlbears,
};
export const teamGnlBanner: any = (id: string) =>
  gnlBanners?.[id] ?? gnl_team_missing;

const getData = async (account: IGNLAccount, start: Moment, end: Moment) => {
  let result: IGNLStatistics = {} as any;
  let seasonActual = [];

  try {
    let all = await getSeasonGamesBetween(account.battleTag, 19, start, end);

    // Filter out free wins/loss and bugs
    seasonActual = all.filter((m) => m.durationInSeconds > 240);

    result = getRaceStatistics(
      account.battleTag,
      seasonActual.filter((m) => isRace(account.battleTag, m, account.race)),
    );
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const useGNLStore = defineStore("gnl", () => {
  const timer = ref<number>();

  const data = ref<any>({} as any);

  const start = ref<Moment>(moment());
  const end = ref<Moment>(moment());

  const initialized = ref<boolean>(false);
  const current = ref<string>();

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

  const db = useFirestore();
  const { promise } = useDocument<any>(
    doc(db, "gnl", "59fbace0-5b6d-4494-ac83-54ddf3664d7a"),
  );

  promise.value.then((d) => {
    start.value = moment(d.start, "DD.MM.YYYY");
    end.value = moment(d.end, "DD.MM.YYYY");
    data.value = d;

    initialized.value = true;

    //TODO: Fix
    void all(d);
  });

  // Do it live!
  const refresh = async () => {
    const result: any = {};
    await Promise.all(
      players.value.map(async (account: IGNLAccount): Promise<void> => {
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

  const initialize = (d: any, t: any) => {
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

    const teams =
      current.value === undefined
        ? d.teams
        : d.teams.filter(
            (t) => t.id.toLowerCase() === current.value.toLowerCase(),
          );

    if (_isEmpty(data.value.teams)) {
      data.value.teams = teams;
    }

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      for (let p = 0; p < team.players.length; p++) {
        const player = team.players[p];
        player.data = await getData(player, dates.value.start, dates.value.end);
      }
    }
  };

  const save = async (item: any) => {
    const db = useFirestore();
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
    data,
    dates,
    save,
    current,

    initialized,
  };
});
