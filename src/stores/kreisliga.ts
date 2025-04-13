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
import kl_team_vipers from "@assets/kreisliga/teams/vipers.png";
import kl_team_titans from "@assets/kreisliga/teams/titans.png";
import kl_team_pandarens from "@assets/kreisliga/teams/pandarens.png";
import kl_team_kickers from "@assets/kreisliga/teams/kickers.png";
import kl_team_index_vipers from "@assets/kreisliga/teams/vipers_index.png";
import kl_team_index_titans from "@assets/kreisliga/teams/titans_index.png";
import kl_team_index_pandarens from "@assets/kreisliga/teams/pandarens_index.png";
import kl_team_index_kickers from "@assets/kreisliga/teams/kickers_index.png";
import kl_team_missing from "@/assets/creeproutes/missing.png";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _last from "lodash/last";
import _sortBy from "lodash/sortBy";
import axios from "axios";
import { currentUrl } from "@/utilities/api";
import {
  calculateAchievementPoints,
  calculateLadderPoints,
  season_achievements,
} from "@/utilities/achievements.ts";

const klBanners: { [key: string]: string } = {
  ["vashjsvipers"]: kl_team_vipers,
  ["azerothtitans"]: kl_team_titans,
  ["pandarens"]: kl_team_pandarens,
  ["stormwindkickerz"]: kl_team_kickers,
};

const klIndexBanners: { [key: string]: string } = {
  ["vashjsvipers"]: kl_team_index_vipers,
  ["azerothtitans"]: kl_team_index_titans,
  ["pandarens"]: kl_team_index_pandarens,
  ["stormwindkickerz"]: kl_team_index_kickers,
};

export const ladderGoal = 500;

export const teamKLIndexBanner: any = (id: string) =>
  klIndexBanners?.[id] ?? kl_team_missing;

export const teamKLBanner: any = (id: string) =>
  klBanners?.[id] ?? kl_team_missing;

const getData = async (account: IGNLAccount, start: Moment, end: Moment) => {
  let result: IGNLStatistics = {} as any;

  try {
    const recent: any = _last(_sortBy(account.data?.matches, "endTime"));
    const actualStart = _isNil(recent) ? start : moment(recent.endTime);

    const all = await getSeasonGamesBetween(
      account.battleTag,
      [21],
      actualStart,
      end,
    );

    // Filter out free wins/loss and bugs
    const seasonActual = all.filter((m) => m.durationInSeconds > 2 * 60);

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

const getOngoing = async (tag: string) => {
  try {
    const { data: onGoingResponse } = await axios.get(currentUrl(tag));
    if (!_isNil(onGoingResponse?.id) && onGoingResponse?.gameMode === 1) {
      const player = onGoingResponse.teams?.find((t: any) =>
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
        ),
      )?.players?.[0];
      const opponent = onGoingResponse.teams?.find((t: any) =>
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() != tag.toLowerCase(),
        ),
      )?.players?.[0];

      return {
        id: onGoingResponse.id,
        start: moment(onGoingResponse.startTime) as any,
        active: true,
        player,
        opponent,
        map: onGoingResponse.mapName,
        server: onGoingResponse.serverInfo,
      };
    }
  } catch (error) {
    return console.log(error);
  }
  return undefined;
};

export const useKreisLigaStore = defineStore("kreisliga", () => {
  const timer = ref<number>();

  const data = ref<any>({} as any);

  const start = ref<Moment>(moment());
  const end = ref<Moment>(moment());

  const initialized = ref<boolean>(false);
  const current = ref<string>();

  const dates = computed(() => ({
    start: start.value.utc(true).startOf("day"),
    end: end.value.utc(true).endOf("day"),
    today: moment().utc(true).endOf("day"),
    daysSinceStart:
      moment().utc(true).startOf("day").diff(start.value, "days") + 1,
    durationInDays: Math.abs(end.value.diff(start.value, "days")),
    daysRemaining: end.value.diff(moment().utc(true).startOf("day"), "days"),
    timeRemaining: end.value.diff(moment(), "milliseconds"),
  }));

  const db = useFirestore();
  const id = "b751d614-d9f6-4aca-b63d-439973928bfe";
  const { promise } = useDocument<any>(doc(db, "kreis", id));

  const initialize = async () => {
    const d = await promise.value;
    if (_isEmpty(data.value) || data.value.id !== d.id) {
      start.value = moment(d.start, "DD.MM.YYYY").utc(true).startOf("day");
      end.value = moment(d.end, "DD.MM.YYYY").utc(true).endOf("day");
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
    start.value = moment(d.start, "DD.MM.YYYY").utc(true).startOf("day");
    end.value = moment(d.end, "DD.MM.YYYY").utc(true).endOf("day");

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
        if (current.value !== undefined) {
          getOngoing(player.battleTag).then((r: any) => (player.ongoing = r));
        } else {
          player.ongoing = undefined;
        }
        player.team = team.id;
        player.points = calculateLadderPoints(
          player.battleTag,
          player.data.matches,
        );
        player.achievements = season_achievements[
          "kreis_liga_season_5"
        ].calculate(player, ladderGoal, d.teams);
        player.achievementPoints = calculateAchievementPoints(
          player.achievements,
        );
        player.totalPoints = player.points + player.achievementPoints;
      }
    }
  };

  const save = async (item: any) => {
    const db = useFirestore();
    try {
      await setDoc(doc(db, "kreis", item.id), item);
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
