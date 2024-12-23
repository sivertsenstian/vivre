import { defineStore } from "pinia";
import type { IGNLAccount, IGNLStatistics } from "@/utilities/types";
import moment from "moment";
import type { Moment } from "moment";
import {
  getloss,
  getplayer,
  getRaceStatistics,
  getSeasonGamesBetween,
  getwins,
  isRace,
  iswin,
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
import _isNil from "lodash/isNil";
import _groupBy from "lodash/groupBy";
import _map from "lodash/map";
import _last from "lodash/last";
import _sortBy from "lodash/sortBy";
import axios from "axios";
import { currentUrl } from "@/utilities/api";
import { Race } from "@/stores/races";
import {
  calculateAchievementPoints,
  calculateLadderPoints,
  countAchievements,
} from "@/utilities/achievements.ts";

const gnlBanners: { [key: string]: string } = {
  ["luckystrike"]: gnl_team_luckystrike,
  ["rageandape"]: gnl_team_rageandape,
  ["apelords"]: gnl_team_apelords,
  ["mannertime"]: gnl_team_mannertime,
  ["gigglinggoblins"]: gnl_team_gigglinggoblins,
  ["gnlbears"]: gnl_team_gnlbears,
};

export const ladderGoal = 500;

export const achievements = {
  // 500
  you_have_so_much: {
    id: "you_have_so_much",
    points: 500,
    icon: "mdi-cash-100",
    description:
      "Because you have a lot, you should have more! - Reach this seasons ladder goal!",
  },

  // 100
  might_cannot_be_matched: {
    id: "might_cannot_be_matched",
    points: 100,
    icon: "mdi-bug",
    description:
      "My Might Cannot Be Matched - Play at least 50 games in a single day",
  },

  // 50
  i_am_a_gamer: {
    id: "i_am_a_gamer",
    points: 50,
    icon: "mdi-nintendo-game-boy",
    description: "I AM A GAMER - Play at least 25 games in a single day",
  },

  // 25
  feels_bad_man: {
    id: "feels_bad_man",
    points: 25,
    icon: "mdi-coffin",
    description: "FeelsBadMan - Lose 5 games in a row",
  },
  multi_kill: {
    id: "multi_kill",
    points: 25,
    icon: "mdi-pac-man",
    description: "Multi Kill - Win 6 games in a row",
  },
  out_rat: {
    id: "out_rat",
    points: 25,
    icon: "mdi-rodent",
    description: "OUT RAT - Win a game that lasted over 30 minutes",
  },
  ambulance: {
    id: "ambulance",
    points: 25,
    icon: "mdi-ambulance",
    description:
      "Call an ambulance, but not for me! - Increased MMR by at least 50 points in one day",
  },
  life_support: {
    id: "life_support",
    points: 25,
    icon: "mdi-iv-bag",
    description:
      "Life Support - Decreased MMR by at least 50 points in one day",
  },
  speed_demon: {
    id: "speed_demon",
    points: 25,
    icon: "mdi-clock-fast",
    description: "Speed Demon - Win a game in less than 4 minutes",
  },

  // 10
  double_kill: {
    id: "double_kill",
    points: 10,
    icon: "mdi-sword-cross",
    description: "Double Kill - Win 2 games in a row",
  },
  copium: {
    id: "copium",
    points: 10,
    icon: "mdi-pill-multiple",
    description: "Copium - Lose a game that lasted over 30 minutes",
  },
  lag_king: {
    id: "lag_king",
    points: 10,
    icon: "mdi-power-plug-off-outline",
    description: "Lag King - Win a game with an average of at least 150ms",
  },
  king_of_my_castle: {
    id: "king_of_my_castle",
    points: 10,
    icon: "mdi-castle",
    description:
      "King of My Castle - Win a game with an average of maximum 15ms",
  },

  // 5
  alone: {
    id: "alone",
    points: 5,
    icon: "mdi-triforce",
    description: "It's Dangerous To Go Alone, Take This! - Play a ladder game",
  },
};

export const teamGnlBanner: any = (id: string) =>
  gnlBanners?.[id] ?? gnl_team_missing;

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

export const calculatePlayerAchievements = (account: IGNLAccount): any[] => {
  const result = [];

  const matches = _sortBy(account.data?.matches ?? [], "endTime");
  const wins = matches.filter((m: any) => getwins(account.battleTag, m));
  const losses = matches.filter((m: any) => getloss(account.battleTag, m));
  const performance = account.data?.performance ?? [];

  // Number of wins/loss
  let consecutiveLoss = 0;
  let consecutiveWins = 0;
  let w = 0;
  let l = 0;
  for (let i = 0; i < performance.length; i++) {
    if (performance[i]) {
      w++;
    } else {
      l++;
    }

    if (i > 0) {
      consecutiveWins = Math.max(consecutiveWins, w);
      consecutiveLoss = Math.max(consecutiveLoss, l);

      if (performance[i] !== performance[i - 1]) {
        w = 0;
        l = 0;
        if (performance[i]) {
          w++;
        } else {
          l++;
        }
      }
    }
  }

  // Time based
  const shortestWin = wins.reduce((r: number, m: any) => {
    return r > m.durationInSeconds ? m.durationInSeconds : r;
  }, 5 * 60);
  const longestWin = wins.reduce((r: number, m: any) => {
    return r < m.durationInSeconds ? m.durationInSeconds : r;
  }, 0);
  const longestLoss = losses.reduce((r: number, m: any) => {
    return r < m.durationInSeconds ? m.durationInSeconds : r;
  }, 0);

  // lag based
  const laggiestWin = wins.reduce((r: number, m: any) => {
    const ping = m.serverInfo.playerServerInfos.find(
      (p: any) => p.battleTag.toLowerCase() === account.battleTag.toLowerCase(),
    ).averagePing;
    return r < ping ? ping : r;
  }, 0);
  const lowLatencyWin = losses.reduce((r: number, m: any) => {
    const ping = m.serverInfo.playerServerInfos.find(
      (p: any) => p.battleTag.toLowerCase() === account.battleTag.toLowerCase(),
    ).averagePing;
    return r > ping || r === 0 ? ping : r;
  }, 0);

  // mmr based
  const gp = getplayer(account.battleTag);
  const matchesPerDay = _groupBy(matches, (m: any) =>
    moment(m.endTime).dayOfYear(),
  );
  const gain = _map(matchesPerDay, (v: any[]) =>
    v.reduce((r: number, s: any) => r + gp(s).players[0].mmrGain, 0),
  );
  const grindCounter = _map(matchesPerDay, (v: any[]) => v.length);

  const mmrGainInADay = Math.max(...gain, 0);
  const mmrLossInADay = Math.min(...gain, 0);

  const maxMatchesPerDay = Math.max(...grindCounter, 0);

  if (matches.length > 0) {
    result.push(achievements["alone"]);
  }

  if (consecutiveWins >= 2) {
    result.push(achievements["double_kill"]);
  }

  if (longestLoss > 60 * 30) {
    result.push(achievements["copium"]);
  }

  if (shortestWin > 0 && shortestWin < 60 * 4) {
    result.push(achievements["speed_demon"]);
  }

  if (laggiestWin > 0 && laggiestWin >= 150) {
    result.push(achievements["lag_king"]);
  }

  if (lowLatencyWin > 0 && lowLatencyWin <= 15) {
    result.push(achievements["king_of_my_castle"]);
  }

  if (consecutiveLoss >= 5) {
    result.push(achievements["feels_bad_man"]);
  }

  if (consecutiveWins >= 6) {
    result.push(achievements["multi_kill"]);
  }

  if (longestWin > 60 * 30) {
    result.push(achievements["out_rat"]);
  }

  if (mmrGainInADay >= 50) {
    result.push(achievements["ambulance"]);
  }

  if (mmrLossInADay <= -50) {
    result.push(achievements["life_support"]);
  }

  if (maxMatchesPerDay >= 25) {
    result.push(achievements["i_am_a_gamer"]);
  }

  if (maxMatchesPerDay >= 50) {
    result.push(achievements["might_cannot_be_matched"]);
  }

  if (
    calculateLadderPoints(account.battleTag, account.data.matches) >= ladderGoal
  ) {
    result.push(achievements["you_have_so_much"]);
  }

  return result.reverse();
};

const getData = async (account: IGNLAccount, start: Moment, end: Moment) => {
  let result: IGNLStatistics = {} as any;

  try {
    const recent: any = _last(_sortBy(account.data?.matches, "endTime"));
    const actualStart = _isNil(recent) ? start : moment(recent.endTime);

    const all = await getSeasonGamesBetween(
      account.battleTag,
      [19, 20],
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
  const id = "a4522e6f-f9bb-4ef6-9202-b81c7bb708c6";
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
        player.achievements = calculatePlayerAchievements(player);
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

    initialized,
    initialize,
  };
});
