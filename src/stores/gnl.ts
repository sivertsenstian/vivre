import { defineStore } from "pinia";
import type { IGNLAccount, IGNLStatistics } from "@/utilities/types";
import moment from "moment";
import type { Moment } from "moment";
import {
  getRaceStatistics,
  getSeasonGamesBetween,
  isRace,
} from "@/utilities/matchcalculator";
import { computed, ref } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
import gnl_team_rageandape from "@assets/gnl/teams/rage_and_ape.jpg";
import gnl_team_apelords from "@assets/gnl/teams/apelords.jpg";
import gnl_team_mannertime from "@assets/gnl/teams/mannertime.png";
import gnl_team_gigglinggoblins from "@assets/gnl/teams/goblins.jpg";
import gnl_team_gnlbears from "@assets/gnl/teams/bears.jpg";
import gnl_team_luckystrike from "@assets/gnl/teams/luckystrike.jpg";
import gnl_team_missing from "@/assets/creeproutes/missing.png";
import _isEmpty from "lodash/isEmpty";
import _first from "lodash/first";
import _merge from "lodash/merge";
import { useStorage } from "@vueuse/core";
import _isNil from "lodash/isNil";

const gnlBanners: { [key: string]: string } = {
  ["luckystrike"]: gnl_team_luckystrike,
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
    const recent: any = _first(account.data?.matches);
    const actualStart = _isNil(recent) ? start : moment(recent.endTime);

    const all = await getSeasonGamesBetween(
      account.battleTag,
      19,
      actualStart,
      end,
    );

    // Filter out free wins/loss and bugs
    seasonActual = all.filter((m) => m.durationInSeconds > 240);

    if (recent === undefined) {
      result = getRaceStatistics(
        account.battleTag,
        seasonActual.filter((m) => isRace(account.battleTag, m, account.race)),
      ) as any;
    } else {
      result = getRaceStatistics(account.battleTag, [
        ...seasonActual.filter((m) =>
          isRace(account.battleTag, m, account.race),
        ),
        ...account.data.matches,
      ]) as any;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const useGNLStore = defineStore("gnl", () => {
  const timer = ref<number>();

  const data = ref<any>({} as any);

  // const data = useStorage("wc3/gnl", {} as any);

  const start = ref<Moment>(moment());
  const end = ref<Moment>(moment());

  const initialized = ref<boolean>(false);
  const current = ref<string>();

  const dates = computed(() => ({
    start: start.value.startOf("day"),
    end: end.value.startOf("day"),
    today: moment().endOf("day"),
    daysSinceStart: moment().startOf("day").diff(start.value, "days") + 1,
    durationInDays: Math.abs(end.value.diff(start.value, "days")),
  }));

  const db = useFirestore();
  const id = "a4522e6f-f9bb-4ef6-9202-b81c7bb708c6";
  const { promise } = useDocument<any>(doc(db, "gnl", id));

  const initialize = async () => {
    const d = await promise.value;
    if (_isEmpty(data.value) || data.value.id !== d.id) {
      start.value = moment(d.start, "DD.MM.YYYY");
      end.value = moment(d.end, "DD.MM.YYYY");
      data.value = d;
    }

    clearTimeout(timer.value);
    void all();
  };

  const refresh = async () => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => all(), 30000);
  };

  const all = async () => {
    const d = data.value;
    start.value = moment(d.start, "DD.MM.YYYY");
    end.value = moment(d.end, "DD.MM.YYYY");

    const teams =
      current.value === undefined
        ? d.teams
        : d.teams.filter(
            (t: any) => t.id.toLowerCase() === current.value?.toLowerCase(),
          );

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      for (let p = 0; p < team.players.length; p++) {
        const player = team.players[p];
        player.data = await getData(player, dates.value.start, dates.value.end);
      }
    }

    await refresh();
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
    data,
    dates,
    save,
    current,

    initialized,
    initialize,
  };
});
