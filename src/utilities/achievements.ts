import _isEmpty from "lodash/isEmpty";
import _sortBy from "lodash/sortBy";
import {
  getloss,
  getopponent,
  getwins,
  iswin,
} from "@/utilities/matchcalculator.ts";
import moment from "moment/moment";
import { Race } from "@/stores/races.ts";

export const calculateLadderPoints = (battleTag: string, data?: any[]) => {
  const matches = (data ?? []).filter((m: any) => m.durationInSeconds > 2 * 60);
  const wins = matches.filter((m: any) => getwins(battleTag, m)).length;
  const losses = matches.filter((m: any) => getloss(battleTag, m)).length;

  return (wins ?? 0) * 3 + (losses ?? 0);
};

export const calculateAchievementPoints = (achievements: any[]) => {
  if (!_isEmpty(achievements)) {
    return achievements.reduce((s, a) => (s += a.points), 0);
  }
  return 0;
};

export const countAchievements = (
  total: { [key: string]: number },
  achievements: { id: string }[],
) => {
  if (!_isEmpty(achievements)) {
    achievements.forEach((achievement) => {
      total[achievement.id] = (total?.[achievement.id] ?? 0) + 1;
    });
  }
};

const season_20_definitions = {
  // 100
  big_deal: {
    id: "big_deal",
    points: 100,
    icon: "mdi-smoking-pipe",
    name: "I'm kind of a big deal",
    description: "Earn 1000 ladder points",
  },

  // 50
  sparta: {
    id: "sparta",
    points: 50,
    icon: "mdi-karate",
    name: "This is SPARTA",
    description: "Win 300 games",
  },
  fine: {
    id: "fine",
    points: 50,
    icon: "mdi-dog",
    name: "Everything is fine",
    description: "Lose 300 games",
  },

  bnet: {
    id: "bnet",
    points: 25,
    icon: "mdi-biohazard",
    name: "The BNET experience",
    description: "Lose 5 games that lasted over 30min",
  },
  working: {
    id: "working",
    points: 25,
    icon: "mdi-account-hard-hat",
    name: "Working night and day",
    description: "Spend over 100 hours in-game!",
  },
  danger: {
    id: "danger",
    points: 25,
    icon: "mdi-hat-fedora",
    name: "I am the danger!",
    description: "Win 10 games in a row",
  },
  lamer: {
    id: "lamer",
    points: 25,
    icon: "mdi-run-fast",
    name: "You know, I'm something of a lamer myself",
    description: "Win 5 games that lasted over 30min",
  },
  theres_a_chance: {
    id: "theres_a_chance",
    points: 25,
    icon: "mdi-slot-machine",
    name: "So you're telling me there's a chance..",
    description: "Lose 5 times vs the same opponent",
  },
  dance: {
    id: "dance",
    points: 25,
    icon: "mdi-dance-pole",
    name: "I can dance all day",
    description: "Win vs the same opponent 3 times",
  },

  makrura: {
    id: "makrura",
    points: 10,
    icon: "mdi-spider-thread",
    name: "MAKRURA for YOU",
    description: "Win a game on every Makrura location",
  },
  basement_dweller: {
    id: "basement_dweller",
    points: 10,
    icon: "mdi-stairs",
    name: "Basement dweller",
    description: "Spend over 24 hours in game!",
  },
  two_birds: {
    id: "two_birds",
    points: 10,
    icon: "mdi-bird",
    name: "Get two birds stoned at once",
    description: "Win 2 games back to back in less than 25 minutes",
  },
  balance: {
    id: "balance",
    points: 10,
    icon: "mdi-scale-unbalanced",
    name: "It's called balance!",
    description: "Lose a game vs every race",
  },
  crushing: {
    id: "crushing",
    points: 10,
    icon: "mdi-kabaddi",
    name: "Kneel before Zod",
    description: "Win a game vs every race",
  },

  // 5
  dying: {
    id: "dying",
    points: 5,
    icon: "mdi-grave-stone",
    name: "Learning By Dying",
    description: "Lose a ladder game",
  },

  winning: {
    id: "winning",
    points: 5,
    icon: "mdi-robot-angry",
    name: "I'm unstoppable!",
    description: "Win a ladder game",
  },
};

export const season_20_calculation = (account: any): any[] => {
  const result = [];
  const matches = _sortBy(account.data?.matches ?? [], "endTime").filter(
    (m) => m.durationInSeconds > 2 * 60,
  );
  const wins = matches.filter((m: any) => getwins(account.battleTag, m));
  const losses = matches.filter((m: any) => getloss(account.battleTag, m));
  const performance = account.data?.performance ?? [];
  const oppo = getopponent(account.battleTag);

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

  const opponentwins = wins.reduce((r, m) => {
    const t = oppo(m).players[0].battleTag;
    return { ...r, [r.t]: (r?.[t] ?? 0) + 1 };
  }, {});

  const opponentloss = losses.reduce((r, m) => {
    const t = oppo(m).players[0].battleTag;
    return { ...r, [r.t]: (r?.[t] ?? 0) + 1 };
  }, {});

  // Map based
  const locations = ["Hammerfall", "Tidehunters"];
  const mapwins = wins.map((m: any) => m.mapName);
  const visitedMakruras = locations.every((l) => mapwins.includes(l));

  // Time based

  const playduration = matches.reduce((s, m) => {
    return s + moment.duration(moment(m.endTime).diff(m.startTime)).asHours();
  }, 0);

  // 2 Win streak time
  let twoWinStreakInTime = false;
  for (let i = 0; i < matches.length; i++) {
    const isStreak =
      i > 0 &&
      iswin(matches[i], account.battleTag) &&
      iswin(matches[i - 1], account.battleTag);
    if (
      isStreak &&
      matches[i - 1].durationInSeconds + matches[i].durationInSeconds < 25 * 60
    ) {
      const twoWinStreakInTime = true;
      break;
    }
  }

  // race based
  const racewins = wins.reduce((s, m: any) => {
    const o = oppo(m);
    const r = o.players[0].race;
    return r === Race.Random ? s : { ...s, [o.players[0].race]: true };
  }, {});

  const raceloss = losses.reduce((s, m: any) => {
    const o = oppo(m);
    const r = o.players[0].race;
    return r === Race.Random ? s : { ...s, [o.players[0].race]: true };
  }, {});

  if (wins.length > 0) {
    result.push(season_20_definitions["winning"]);
  }

  if (losses.length > 0) {
    result.push(season_20_definitions["dying"]);
  }

  if (Object.values(racewins).every((x) => x)) {
    result.push(season_20_definitions["crushing"]);
  }

  if (Object.values(raceloss).every((x) => x)) {
    result.push(season_20_definitions["balance"]);
  }

  if (twoWinStreakInTime) {
    result.push(season_20_definitions["two_birds"]);
  }

  if (playduration >= 24) {
    result.push(season_20_definitions["basement_dweller"]);
  }

  if (visitedMakruras) {
    result.push(season_20_definitions["makrura"]);
  }

  if (Object.values(opponentwins).some((v: any) => v >= 3)) {
    result.push(season_20_definitions["dance"]);
  }

  if (Object.values(opponentloss).some((v: any) => v >= 5)) {
    result.push(season_20_definitions["theres_a_chance"]);
  }

  if (wins.filter((m: any) => m.durationInSeconds > 30 * 60).length >= 5) {
    result.push(season_20_definitions["lamer"]);
  }

  if (playduration >= 100) {
    result.push(season_20_definitions["working"]);
  }

  if (losses.filter((m: any) => m.durationInSeconds > 30 * 60).length >= 5) {
    result.push(season_20_definitions["bnet"]);
  }

  if (losses.length >= 300) {
    result.push(season_20_definitions["fine"]);
  }

  if (wins.length >= 300) {
    result.push(season_20_definitions["sparta"]);
  }

  if (calculateLadderPoints(account.battleTag, account.data.matches) >= 1000) {
    result.push(season_20_definitions["big_deal"]);
  }

  return result.reverse();
};

const season_21_definitions = {
  // 100
  big_deal: {
    id: "big_deal",
    points: 100,
    icon: "mdi-smoking-pipe",
    name: "I'm kind of a big deal",
    description: "Earn 1000 ladder points",
  },

  // 50
  sparta: {
    id: "sparta",
    points: 50,
    icon: "mdi-karate",
    name: "This is SPARTA",
    description: "Win 300 games",
  },
  fine: {
    id: "fine",
    points: 50,
    icon: "mdi-dog",
    name: "Everything is fine",
    description: "Lose 300 games",
  },

  bnet: {
    id: "bnet",
    points: 25,
    icon: "mdi-biohazard",
    name: "The BNET experience",
    description: "Lose 5 games that lasted over 30min",
  },
  working: {
    id: "working",
    points: 25,
    icon: "mdi-account-hard-hat",
    name: "Working night and day",
    description: "Spend over 100 hours in-game!",
  },
  danger: {
    id: "danger",
    points: 25,
    icon: "mdi-hat-fedora",
    name: "I am the danger!",
    description: "Win 10 games in a row",
  },
  lamer: {
    id: "lamer",
    points: 25,
    icon: "mdi-run-fast",
    name: "You know, I'm something of a lamer myself",
    description: "Win 5 games that lasted over 30min",
  },
  theres_a_chance: {
    id: "theres_a_chance",
    points: 25,
    icon: "mdi-slot-machine",
    name: "So you're telling me there's a chance..",
    description: "Lose 5 times vs the same opponent",
  },
  dance: {
    id: "dance",
    points: 25,
    icon: "mdi-dance-pole",
    name: "I can dance all day",
    description: "Win vs the same opponent 3 times",
  },

  makrura: {
    id: "makrura",
    points: 10,
    icon: "mdi-spider-thread",
    name: "MAKRURA for YOU",
    description: "Win a game on every Makrura location",
  },
  basement_dweller: {
    id: "basement_dweller",
    points: 10,
    icon: "mdi-stairs",
    name: "Basement dweller",
    description: "Spend over 24 hours in game!",
  },
  two_birds: {
    id: "two_birds",
    points: 10,
    icon: "mdi-bird",
    name: "Get two birds stoned at once",
    description: "Win 2 games back to back in less than 25 minutes",
  },
  balance: {
    id: "balance",
    points: 10,
    icon: "mdi-scale-unbalanced",
    name: "It's called balance!",
    description: "Lose a game vs every race",
  },
  crushing: {
    id: "crushing",
    points: 10,
    icon: "mdi-kabaddi",
    name: "Kneel before Zod",
    description: "Win a game vs every race",
  },

  // 5
  dying: {
    id: "dying",
    points: 5,
    icon: "mdi-grave-stone",
    name: "Learning By Dying",
    description: "Lose a ladder game",
  },

  winning: {
    id: "winning",
    points: 5,
    icon: "mdi-robot-angry",
    name: "I'm unstoppable!",
    description: "Win a ladder game",
  },
};

export const season_21_calculation = (account: any): any[] => {
  const result = [];
  const matches = _sortBy(account.data?.matches ?? [], "endTime").filter(
    (m) => m.durationInSeconds > 2 * 60,
  );
  const wins = matches.filter((m: any) => getwins(account.battleTag, m));
  const losses = matches.filter((m: any) => getloss(account.battleTag, m));
  const performance = account.data?.performance ?? [];
  const oppo = getopponent(account.battleTag);

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

  const opponentwins = wins.reduce((r, m) => {
    const t = oppo(m).players[0].battleTag;
    return { ...r, [r.t]: (r?.[t] ?? 0) + 1 };
  }, {});

  const opponentloss = losses.reduce((r, m) => {
    const t = oppo(m).players[0].battleTag;
    return { ...r, [r.t]: (r?.[t] ?? 0) + 1 };
  }, {});

  // Map based
  const locations = ["Hammerfall", "Tidehunters"];
  const mapwins = wins.map((m: any) => m.mapName);
  const visitedMakruras = locations.every((l) => mapwins.includes(l));

  // Time based

  const playduration = matches.reduce((s, m) => {
    return s + moment.duration(moment(m.endTime).diff(m.startTime)).asHours();
  }, 0);

  // 2 Win streak time
  let twoWinStreakInTime = false;
  for (let i = 0; i < matches.length; i++) {
    const isStreak =
      i > 0 &&
      iswin(matches[i], account.battleTag) &&
      iswin(matches[i - 1], account.battleTag);
    if (
      isStreak &&
      matches[i - 1].durationInSeconds + matches[i].durationInSeconds < 25 * 60
    ) {
      const twoWinStreakInTime = true;
      break;
    }
  }

  // race based
  const racewins = wins.reduce((s, m: any) => {
    const o = oppo(m);
    const r = o.players[0].race;
    return r === Race.Random ? s : { ...s, [o.players[0].race]: true };
  }, {});

  const raceloss = losses.reduce((s, m: any) => {
    const o = oppo(m);
    const r = o.players[0].race;
    return r === Race.Random ? s : { ...s, [o.players[0].race]: true };
  }, {});

  if (wins.length > 0) {
    result.push(season_21_definitions["winning"]);
  }

  if (losses.length > 0) {
    result.push(season_21_definitions["dying"]);
  }

  if (
    Object.values(racewins).length === 4 &&
    Object.values(racewins).every((x) => x)
  ) {
    result.push(season_21_definitions["crushing"]);
  }

  if (
    Object.values(raceloss).length === 4 &&
    Object.values(raceloss).every((x) => x)
  ) {
    result.push(season_21_definitions["balance"]);
  }

  if (twoWinStreakInTime) {
    result.push(season_21_definitions["two_birds"]);
  }

  if (playduration >= 24) {
    result.push(season_21_definitions["basement_dweller"]);
  }

  if (visitedMakruras) {
    result.push(season_21_definitions["makrura"]);
  }

  if (Object.values(opponentwins).some((v: any) => v >= 3)) {
    result.push(season_21_definitions["dance"]);
  }

  if (Object.values(opponentloss).some((v: any) => v >= 5)) {
    result.push(season_21_definitions["theres_a_chance"]);
  }

  if (wins.filter((m: any) => m.durationInSeconds > 30 * 60).length >= 5) {
    result.push(season_21_definitions["lamer"]);
  }

  if (playduration >= 100) {
    result.push(season_21_definitions["working"]);
  }

  if (losses.filter((m: any) => m.durationInSeconds > 30 * 60).length >= 5) {
    result.push(season_21_definitions["bnet"]);
  }

  if (losses.length >= 300) {
    result.push(season_21_definitions["fine"]);
  }

  if (wins.length >= 300) {
    result.push(season_21_definitions["sparta"]);
  }

  if (calculateLadderPoints(account.battleTag, account.data.matches) >= 1000) {
    result.push(season_21_definitions["big_deal"]);
  }

  return result.reverse();
};

const kreis_liga_season_5_definitions = {
  ...season_21_definitions,
  // 500
  ladder_goal: {
    id: "ladder_goal",
    points: 500,
    icon: "mdi-sausage",
    name: "Alles hat ein Ende, nur die Wurst hat zwei!",
    description: "Reach this seasons ladder goal!",
  },

  // 25
  alle_gute_dinge: {
    id: "alle_gute_dinge",
    points: 25,
    icon: "mdi-numeric-3-circle",
    name: "Aller guten Dinge sind drei",
    description: "Win 3 games in a row",
  },
  // 25
  ach_du_scheisse: {
    id: "ach_du_scheisse",
    points: 25,
    icon: "mdi-emoticon-poop",
    name: "Ach du Scheiße!",
    description: "Lose 5 games in a row",
  },

  // 10 + 1 per kill!
  aint_war_hell: {
    id: "aint_war_hell",
    points: 10,
    icon: "mdi-knife-military",
    name: "Get Some!",
    description: "Defeat a player from an opposing team",
  },
};

const kreis_liga_season_5_calculation = (
  account: any,
  ladderGoal: number,
  teams: any[] = [],
): any[] => {
  const result = season_21_calculation(account);

  const performance = account.data?.performance ?? [];
  const matches = account.data?.matches ?? [];

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

  let kills = 0;
  const team = account.team;
  const others = teams.reduce(
    (a, t) =>
      t.id === team ? a : [...a, ...t.players.map((p: any) => p.battleTag)],
    [],
  );

  const getPlayerOpponent = getopponent(account.battleTag);

  for (let i = 0; i < matches.length; i++) {
    const t = getPlayerOpponent(matches[i]).players[0].battleTag;
    if (others.includes(t)) {
      kills++;
    }
  }

  if (consecutiveLoss >= 5) {
    result.push(kreis_liga_season_5_definitions["ach_du_scheisse"]);
  }

  if (consecutiveWins >= 3) {
    result.push(kreis_liga_season_5_definitions["alle_gute_dinge"]);
  }

  if (kills > 0) {
    const r = { ...kreis_liga_season_5_definitions["aint_war_hell"] };
    r.points += kills;
    r.description += ` - ${kills} kill(s)`;
    result.push(r);
  }

  if (
    calculateLadderPoints(account.battleTag, account.data.matches) >= ladderGoal
  ) {
    result.push(kreis_liga_season_5_definitions["ladder_goal"]);
  }

  return result;
};

export const season_achievements = {
  20: {
    definitions: season_20_definitions,
    calculate: season_20_calculation,
  },
  21: {
    definitions: season_21_definitions,
    calculate: season_21_calculation,
  },
  kreis_liga_season_5: {
    definitions: kreis_liga_season_5_definitions,
    calculate: kreis_liga_season_5_calculation,
  },
};
