import { defineStore } from "pinia";
import type { IGNLAccount, IGNLStatistics } from "@/utilities/types";
import moment from "moment";
import type { Moment } from "moment";
import {
  getRaceStatistics,
  getSeasonGamesBetween,
  isRace,
  iswin,
} from "@/utilities/matchcalculator";
import { computed, ref } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
import gnl_team_cok from "@assets/gnl/teams/cok-transparent.png";
import gnl_team_index_cok from "@assets/gnl/teams/cok-transparent_index.png";
import gnl_team_apelords from "@assets/gnl/teams/apelords.jpg";
import gnl_team_fiends from "@assets/gnl/teams/fiends_with_benefits.png";
import gnl_team_index_fiends from "@assets/gnl/teams/fiends_with_benefits_index.png";
import gnl_team_gigglinggoblins from "@assets/gnl/teams/goblins.jpg";
import gnl_team_index_gigglinggoblins from "@assets/gnl/teams/goblins_index.png";
import gnl_team_gnlbears from "@assets/gnl/teams/bears.jpg";
import gnl_team_tttg from "@assets/gnl/teams/TTTG_LOGO.jpg";
import gnl_team_index_tttg from "@assets/gnl/teams/TTTG_LOGO_index.jpg";
import gnl_team_panda from "@assets/gnl/teams/chinese_panda.jpg";
import gnl_team_index_panda from "@assets/gnl/teams/chinese_panda_index.jpg";
import gnl_team_pitty from "@assets/gnl/teams/pitty.png";
import gnl_team_pitty_index from "@assets/gnl/teams/pitty_index.png";
import gnl_team_missing from "@/assets/creeproutes/missing.png";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _last from "lodash/last";
import _sortBy from "lodash/sortBy";
import axios from "axios";
import { currentUrl } from "@/utilities/api";
import { Race } from "@/stores/races";
import {
  calculateAchievementPoints,
  calculateLadderPoints,
  countAchievements,
  season_achievements,
} from "@/utilities/achievements.ts";

const gnlBanners: { [key: string]: string } = {
  ["cok"]: gnl_team_cok,
  ["fiends"]: gnl_team_fiends,
  ["apelords"]: gnl_team_apelords,
  ["tttg"]: gnl_team_tttg,
  ["gigglinggoblins"]: gnl_team_gigglinggoblins,
  ["gnlbears"]: gnl_team_gnlbears,
  ["panda"]: gnl_team_panda,
  ["pitty"]: gnl_team_pitty,
};

const gnlIndexBanners: { [key: string]: string } = {
  ["cok"]: gnl_team_index_cok,
  ["fiends"]: gnl_team_index_fiends,
  ["apelords"]: gnl_team_apelords,
  ["tttg"]: gnl_team_index_tttg,
  ["gigglinggoblins"]: gnl_team_index_gigglinggoblins,
  ["gnlbears"]: gnl_team_gnlbears,
  ["panda"]: gnl_team_index_panda,
  ["pitty"]: gnl_team_pitty_index,
};

export const ladderGoal = 500;

export const teamGnlBanner: any = (id: string) =>
  gnlBanners?.[id] ?? gnl_team_missing;

export const teamGnlIndexBanner: any = (id: string) =>
  gnlIndexBanners?.[id] ?? gnl_team_missing;

const calculateStreak = (player: any) => {
  if (player === null) {
    return 0;
  }

  let v1 = 0;
  let v2 = 0;

  for (let i = 0; i < player.data.matches.length; i++) {
    if (iswin(player.data.matches[i], player.battleTag)) {
      v2++;
    } else {
      v1 = v1 > v2 ? v1 : v2;
      v2 = 0;
    }
  }

  player.winStreak = v1;
  return v1;
};

const calculateDailyMMR = (player: any) => {
  if (player === null) {
    return 0;
  }

  let mmr1 = 0;
  let mmr2 = 0;
  let v1 = 0;
  let v2 = 0;

  for (let i = 0; i < player.data.matches.length; i++) {
    if (iswin(player.data.matches[i], player.battleTag)) {
      v2++;
      mmr2 += player.data.matches[i].teams[0].players[0].mmrGain;
    } else {
      v1 = v1 > v2 ? v1 : v2;
      mmr1 = v1 > v2 ? mmr1 : mmr2;
      v2 = 0;
      mmr2 = 0;
    }
  }

  player.mostMMRInADay = mmr1;
  return mmr1;
};

const calculateGamesOnDay = (player: any, date: Moment, key: string) => {
  if (player === null) {
    return 0;
  }

  const count = player.data.matches.filter(
    (m: any) => moment(m.endTime).dayOfYear() === date.dayOfYear(),
  ).length;

  player[key] = count;
  return count;
};

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

export const useGNLStore = defineStore("gnl", () => {
  const timer = ref<number>();

  const data = ref<any>({} as any);

  const start = ref<Moment>(moment());
  const end = ref<Moment>(moment());

  const initialized = ref<boolean>(false);
  const current = ref<string>();

  const achievementStats = ref<{ [key: string]: number }>({});
  const playerStats = ref<{ [key: string]: any }>({});
  const numberOfPlayers = ref<number>(0);
  const orbs = ref<any[]>([]);

  const ladderGodCategory = ref<string>("all");
  const ladderGodCategories = [
    "all",
    "week 1",
    "week 2",
    "week 3",
    "week 4",
    "week 5",
    "week 6",
    "week 7",
    "week 8",
  ];

  const dates = computed(() => ({
    start: start.value,
    end: end.value,
    today: moment().utc(true).endOf("day"),
    daysSinceStart:
      moment().utc(true).startOf("day").diff(start.value, "days") + 1,
    durationInDays: Math.abs(end.value.diff(start.value, "days")),
    daysRemaining: end.value.diff(moment().utc(true).startOf("day"), "days"),
    timeRemaining: end.value.diff(moment(), "milliseconds"),
  }));

  const db = useFirestore();
  const id = "584d910b-5c71-45ee-9813-b8106696470c";
  const { promise } = useDocument<any>(doc(db, "gnl", id));

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

    let achievementCount = {};

    let mostGames: any = null,
      mostMMR: any = null,
      mostMMRInADay: any = null,
      winStreak: any = null,
      mostAchievements: any = null,
      mostGamesFirstDay: any = null,
      mostGamesSingleDay: any = null,
      mostGamesLastDay: any = null,
      bestNightElf: any = null,
      bestHuman: any = null,
      bestOrc: any = null,
      bestUndead: any = null,
      bestRandom: any = null;

    let ladderGoals: any[] = [];

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      team.achievements = {};
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
        player.achievements = season_achievements["gnl_season_16"].calculate(
          player,
          ladderGoal,
          d.teams,
        );
        player.achievementPoints = calculateAchievementPoints(
          player.achievements,
        );
        player.totalPoints = player.points + player.achievementPoints;

        if (current.value === undefined) {
          player.prefix = team.prefix;
          // stats
          countAchievements(team.achievements, player.achievements);
          countAchievements(achievementCount, player.achievements);
          numberOfPlayers.value++;

          if (player.points >= 500) {
            ladderGoals.push(player);
          }

          // Fun
          mostGames =
            player.data.total > (mostGames?.data.total ?? 0)
              ? player
              : mostGames;
          mostMMR =
            player.data.mmr.diff > (mostMMR?.data.mmr.diff ?? 0)
              ? player
              : mostMMR;
          mostAchievements =
            player.achievements.length >
            (mostAchievements?.achievements.length ?? 0)
              ? player
              : mostAchievements;

          winStreak =
            calculateStreak(player) > (winStreak?.winStreak ?? 0)
              ? player
              : winStreak;

          mostMMRInADay =
            calculateDailyMMR(player) > (mostMMRInADay?.mostMMRInADay ?? 0)
              ? player
              : mostMMRInADay;

          mostGamesFirstDay =
            calculateGamesOnDay(player, dates.value.start, "gamesFirstDay") >
            (mostGamesFirstDay?.gamesFirstDay ?? 0)
              ? player
              : mostGamesFirstDay;

          mostGamesLastDay =
            calculateGamesOnDay(player, dates.value.end, "gamesLastDay") >
            (mostGamesLastDay?.gamesLastDay ?? 0)
              ? player
              : mostGamesLastDay;

          if (player.battleTag === "NorthDrakkar#1745") {
            mostGamesSingleDay = player;
          }

          bestNightElf =
            player.race === Race.NightElf &&
            player.totalPoints > (bestNightElf?.totalPoints ?? 0)
              ? player
              : bestNightElf;

          bestHuman =
            player.race === Race.Human &&
            player.totalPoints > (bestHuman?.totalPoints ?? 0)
              ? player
              : bestHuman;

          bestOrc =
            player.race === Race.Orc &&
            player.totalPoints > (bestOrc?.totalPoints ?? 0)
              ? player
              : bestOrc;

          bestUndead =
            player.race === Race.Undead &&
            player.totalPoints > (bestUndead?.totalPoints ?? 0)
              ? player
              : bestUndead;

          bestRandom =
            player.race === Race.Random &&
            player.totalPoints > (bestRandom?.totalPoints ?? 0)
              ? player
              : bestRandom;
        }
      }
    }

    if (current.value === undefined) {
      achievementStats.value = achievementCount;
      initialized.value = true;

      playerStats.value = {
        mostGames,
        mostMMR,
        winStreak,
        mostMMRInADay,
        mostAchievements,
        mostGamesFirstDay,
        mostGamesLastDay,
        mostGamesSingleDay,
        bestNightElf,
        bestHuman,
        bestOrc,
        bestUndead,
        bestRandom,
      };

      orbs.value = ladderGoals;
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
    data,
    dates,
    save,
    current,

    achievementStats,
    playerStats,
    numberOfPlayers,
    orbs,

    ladderGodCategory,
    ladderGodCategories,

    initialized,
    initialize,
  };
});
