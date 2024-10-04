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
import _groupBy from "lodash/groupBy";
import _map from "lodash/map";
import _last from "lodash/last";
import _sortBy from "lodash/sortBy";

const gnlBanners: { [key: string]: string } = {
  ["luckystrike"]: gnl_team_luckystrike,
  ["rageandape"]: gnl_team_rageandape,
  ["apelords"]: gnl_team_apelords,
  ["mannertime"]: gnl_team_mannertime,
  ["gigglinggoblins"]: gnl_team_gigglinggoblins,
  ["gnlbears"]: gnl_team_gnlbears,
};

export const ladderGoal = 500;

const achievements = {
  // 500
  you_have_so_much: {
    points: 500,
    icon: "mdi-cash-100",
    description:
      "Because you have a lot, you should have more! - Reach this seasons ladder goal!",
  },

  // 100
  might_cannot_be_matched: {
    points: 100,
    icon: "mdi-bug",
    description:
      "My Might Cannot Be Matched - Play at least 50 games in a single day",
  },

  // 50
  i_am_a_gamer: {
    points: 50,
    icon: "mdi-nintendo-game-boy",
    description: "I AM A GAMER - Play at least 25 games in a single day",
  },

  // 25
  feels_bad_man: {
    points: 25,
    icon: "mdi-coffin",
    description: "FeelsBadMan - Lose 5 games in a row",
  },
  multi_kill: {
    points: 25,
    icon: "mdi-pac-man",
    description: "Multi Kill - Win 6 games in a row",
  },
  out_rat: {
    points: 25,
    icon: "mdi-rodent",
    description: "OUT RAT - Win a game that lasted over 30 minutes",
  },
  ambulance: {
    points: 25,
    icon: "mdi-ambulance",
    description:
      "Call an ambulance, but not for me! - Increased MMR by at least 50 points in one day",
  },
  life_support: {
    points: 25,
    icon: "mdi-iv-bag",
    description:
      "Life Support - Decreased MMR by at least 50 points in one day",
  },
  speed_demon: {
    points: 25,
    icon: "mdi-clock-fast",
    description: "Speed Demon - Win a game in less than 4 minutes",
  },

  // 10
  double_kill: {
    points: 10,
    icon: "mdi-sword-cross",
    description: "Double Kill - Win 2 games in a row",
  },
  copium: {
    points: 10,
    icon: "mdi-pill-multiple",
    description: "Copium - Lose a game that lasted over 30 minutes",
  },
  lag_king: {
    points: 10,
    icon: "mdi-power-plug-off-outline",
    description: "Lag King - Win a game with an average of at least 150ms",
  },
  king_of_my_castle: {
    points: 10,
    icon: "mdi-castle",
    description:
      "King of My Castle - Win a game with an average of maximum 15ms",
  },

  // 5
  alone: {
    points: 5,
    icon: "mdi-triforce",
    description: "It's Dangerous To Go Alone, Take This! - Play a ladder game",
  },
};

export const teamGnlBanner: any = (id: string) =>
  gnlBanners?.[id] ?? gnl_team_missing;

export const calculateLadderPoints = (data?: { wins: number; loss: number }) =>
  (data?.wins ?? 0) * 3 + (data?.loss ?? 0);

export const calculateAchievementPoints = (achievements: any[]) => {
  if (!_isEmpty(achievements)) {
    return achievements.reduce((s, a) => (s += a.points), 0);
  }
  return 0;
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
    return r > ping ? ping : r;
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

  if (calculateLadderPoints(account.data) >= ladderGoal) {
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
      19,
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
        player.points = calculateLadderPoints(player.data);
        player.achievements = calculatePlayerAchievements(player);
        player.achievementPoints = calculateAchievementPoints(
          player.achievements,
        );
        player.totalPoints = player.points + player.achievementPoints;
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
