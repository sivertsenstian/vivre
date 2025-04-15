import _isEmpty from "lodash/isEmpty";
import _sortBy from "lodash/sortBy";
import {
  getloss,
  getopponent,
  getplayer,
  getwins,
  iswin,
} from "@/utilities/matchcalculator.ts";
import moment from "moment/moment";
import { Race } from "@/stores/races.ts";
import type { Moment } from "moment";
import _last from "lodash/last";
import _groupBy from "lodash/groupBy";
import _map from "lodash/map";
import cr_beginner_hu_1 from "@/assets/creeproutes/beginner/human/random/AL.jpg";
import cr_beginner_hu_2 from "@/assets/creeproutes/beginner/human/random/CH.jpg";
import cr_beginner_hu_3 from "@/assets/creeproutes/beginner/human/random/HF.jpg";
import cr_beginner_hu_4 from "@/assets/creeproutes/beginner/human/random/LR.jpg";
import cr_beginner_hu_5 from "@/assets/creeproutes/beginner/human/random/NiS.jpg";
import cr_beginner_hu_6 from "@/assets/creeproutes/beginner/human/random/SG.jpg";
import cr_beginner_hu_8 from "@/assets/creeproutes/beginner/human/random/ST.jpg";
import cr_beginner_hu_7 from "@/assets/creeproutes/beginner/human/random/TH.jpg";
import cr_beginner_hu_9 from "@/assets/creeproutes/beginner/human/random/WH.jpg";
import cr_beginner_hu_10 from "@/assets/creeproutes/beginner/human/random/SV.jpg";
import cr_beginner_hu_11 from "@/assets/creeproutes/beginner/human/random/MV.jpg";
import cr_beginner_hu_12 from "@/assets/creeproutes/beginner/human/random/BV.jpg";

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
  const wins = account.data?.matches?.filter((m: any) =>
    iswin(m, account.battleTag),
  );

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

  for (let i = 0; i < wins.length; i++) {
    const t = getPlayerOpponent(wins[i]).players[0].battleTag;
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

const gnl_season_16_definitions = {
  // 500
  ladder_goal: {
    id: "ladder_goal",
    points: 500,
    icon: "mdi-seed-plus",
    name: "The end of a journey holds the seed of new dreams!",
    description: "Reach this seasons ladder goal!",
  },

  // 100
  i_am_the_captain_now: {
    id: "i_am_the_captain_now",
    points: 100,
    icon: "mdi-ferry",
    name: "I'm the captain now!",
    description: "Win a ladder game vs. a GNL coach!",
  },
  addicted: {
    id: "addicted",
    points: 100,
    icon: "mdi-flask",
    name: "Better Living Through Chemistry",
    description: "Play 30 games in 24-hour span",
  },
  elite: {
    id: "elite",
    points: 100,
    icon: "mdi-emoticon-cool-outline",
    name: "1337",
    description: "Get your MMR to 1337",
  },

  // 50
  dats_fakt_ap: {
    id: "dats_fakt_ap",
    points: 50,
    icon: "mdi-egg",
    name: "DATS FAKT AP",
    description: "Lose 10 games in a row",
  },
  winner_winner: {
    id: "winner_winner",
    points: 50,
    icon: "mdi-food-drumstick",
    name: "Winner winner chicken dinner!",
    description: "Win 100 games",
  },
  sad_trombone: {
    id: "sad_trombone",
    points: 50,
    icon: "mdi-trumpet",
    name: "Sad Trombone",
    description: "Lose 100 games",
  },

  // 25
  win_first: {
    id: "win_first",
    points: 15,
    icon: "mdi-redhat",
    name: "I am the danger!",
    description: "Win your first GNL game",
  },
  lose_first: {
    id: "lose_first",
    points: 25,
    icon: "mdi-skull",
    name: "When I'm In Command, Every Mission Is A Suicide Mission.",
    description: "Lose your first GNL game",
  },
  win_streak: {
    id: "win_streak",
    points: 25,
    icon: "mdi-tally-mark-5",
    name: "Connect Five!",
    description: "Win 5 games in a row",
  },
  win_every_map: {
    id: "win_every_map",
    points: 25,
    icon: "mdi-map-check",
    name: "Dora the explorer",
    description: "Win a game on every ladder map",
  },
  rising_star: {
    id: "rising_star",
    points: 25,
    icon: "mdi-brain",
    name: "I know kung fu",
    description: "Earn over 100 MMR in a single day",
  },

  // 10 + 5 per kill!
  duck_hunting: {
    id: "duck_hunting",
    points: 10,
    icon: "mdi-target-account",
    name: "Hunting Season!",
    description: "Defeat a player from an opposing team",
  },

  // 10 + 1 per win!
  night_elf: {
    id: "night_elf",
    points: 10,
    icon: "mdi-shield-moon",
    name: "Destroyer of Trees",
    description: "Win 10+ games vs. Night Elf",
  },
  undead: {
    id: "undead",
    points: 10,
    icon: "mdi-ghost-outline",
    name: "Bane of the Scourge",
    description: "Win 10+ games vs. Undead",
  },
  orc: {
    id: "orc",
    points: 10,
    icon: "mdi-paw-outline",
    name: "Reaper of Greenskins",
    description: "Win 10+ games vs. Orc",
  },
  human: {
    id: "human",
    points: 10,
    icon: "mdi-wizard-hat",
    name: "A plague upon Humanity",
    description: "Win 10+ games vs. Human",
  },

  // 10
  join_them: {
    id: "join_them",
    points: 10,
    icon: "mdi-handshake",
    name: "If you can't beat them...",
    description: "Win and Lose a game that lasted over 30min",
  },
  winter: {
    id: "winter",
    points: 10,
    icon: "mdi-weather-snowy-heavy",
    name: "A true Stark",
    description: "Win a game on every winter map",
  },

  // 5
  holiday: {
    id: "holiday",
    points: 5,
    icon: "mdi-palm-tree",
    name: "I'm on holiday!",
    description: "Win a game on Tide Hunters",
  },
  newbie: {
    id: "newbie",
    points: 5,
    icon: "mdi-new-box",
    name: "Don’t be afraid to try something new!",
    description: "Win a game on every NEW map!",
  },
};

const gnl_season_16_calculation = (
  account: any,
  ladderGoal: number,
  teams: any[] = [],
): any[] => {
  const result = [];

  const getPlayerOpponent = getopponent(account.battleTag);
  const getPlayer = getplayer(account.battleTag);

  const performance = account.data?.performance ?? [];
  const matches = account.data?.matches ?? [];
  const wins =
    account.data?.matches?.filter((m: any) => iswin(m, account.battleTag)) ??
    [];
  const losses =
    account.data?.matches?.filter((m: any) => !iswin(m, account.battleTag)) ??
    [];

  // First match
  const first = _last(matches);
  if (matches.length > 0) {
    if (iswin(first, account.battleTag)) {
      result.push(gnl_season_16_definitions["win_first"]);
    } else {
      result.push(gnl_season_16_definitions["lose_first"]);
    }
  }

  if (wins.length >= 100) {
    result.push(gnl_season_16_definitions["winner_winner"]);
  }

  if (losses.length >= 100) {
    result.push(gnl_season_16_definitions["sad_trombone"]);
  }

  // MMR
  const mmrs = matches.map((m: any) =>
    Math.round(getPlayer(m).players[0].currentMmr),
  );
  if (mmrs.some((v: any) => v === 1337)) {
    result.push(gnl_season_16_definitions["elite"]);
  }

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
  let coachKills = 0;
  const team = account.team;
  const others = teams.reduce(
    (a, t) =>
      t.id === team ? a : [...a, ...t.players.map((p: any) => p.battleTag)],
    [],
  );
  const coaches = teams.reduce(
    (a, t) => [...a, ...t.coaches.map((p: any) => p.battleTag)],
    [],
  );

  for (let i = 0; i < wins.length; i++) {
    const t = getPlayerOpponent(wins[i]).players[0].battleTag;
    if (others.includes(t)) {
      kills++;
    }
    if (!coaches.includes(account.battleTag) && coaches.includes(t)) {
      coachKills++;
    }
  }

  if (consecutiveLoss >= 10) {
    result.push(gnl_season_16_definitions["dats_fakt_ap"]);
  }

  if (consecutiveWins >= 5) {
    result.push(gnl_season_16_definitions["win_streak"]);
  }

  if (kills > 0) {
    const r = { ...gnl_season_16_definitions["duck_hunting"] };
    r.points += kills * 5;
    r.description += ` - ${kills} kill(s)`;
    result.push(r);
  }

  if (coachKills > 0) {
    result.push(gnl_season_16_definitions["i_am_the_captain_now"]);
  }

  // Race based
  const wins_ne =
    wins.filter(
      (m: any) => getPlayerOpponent(m).players[0].race === Race.NightElf,
    )?.length ?? 0;
  const wins_oc =
    wins.filter((m: any) => getPlayerOpponent(m).players[0].race === Race.Orc)
      ?.length ?? 0;
  const wins_hu =
    wins.filter((m: any) => getPlayerOpponent(m).players[0].race === Race.Human)
      ?.length ?? 0;
  const wins_ud =
    wins.filter(
      (m: any) => getPlayerOpponent(m).players[0].race === Race.Undead,
    )?.length ?? 0;

  if (wins_ne >= 10) {
    const r = { ...gnl_season_16_definitions["night_elf"] };
    r.points += wins_ne;
    r.description += ` - ${wins_ne} wins!`;
    result.push(r);
  }

  if (wins_oc >= 10) {
    const r = { ...gnl_season_16_definitions["orc"] };
    r.points += wins_oc;
    r.description += ` - ${wins_oc} wins!`;
    result.push(r);
  }

  if (wins_ud >= 10) {
    const r = { ...gnl_season_16_definitions["undead"] };
    r.points += wins_ud;
    r.description += ` - ${wins_ud} wins!`;
    result.push(r);
  }

  if (wins_hu >= 10) {
    const r = { ...gnl_season_16_definitions["human"] };
    r.points += wins_hu;
    r.description += ` - ${wins_hu} wins!`;
    result.push(r);
  }

  // Map based
  const mapwins = wins.map((m: any) => m.mapName);

  const holiday = ["Tidehunters"];
  const winterMaps = ["Northern Isles", "Melting Valley v2", "Springtime"];
  const newMaps = [
    "War Hail",
    "Melting Valley v2",
    "Secret Valley v2",
    "Boulder Vale",
  ];
  const allMaps = [
    "Autumn Leaves v2",
    "Concealed Hill",
    "Hammerfall",
    "Last Refuge",
    "Northern Isles",
    "Shallow Grave",
    "Springtime",
    "Tidehunters",
    "War Hail",
    "Secret Valley v2",
    "Melting Valley v2",
    "Boulder Vale",
  ];

  const onHoliday = holiday.every((l) => mapwins.includes(l));
  const isWinterReady = winterMaps.every((l) => mapwins.includes(l));
  const isNewbie = newMaps.every((l) => mapwins.includes(l));
  const isExplorer = allMaps.every((l) => mapwins.includes(l));

  if (onHoliday) {
    result.push(gnl_season_16_definitions["holiday"]);
  }

  if (isWinterReady) {
    result.push(gnl_season_16_definitions["winter"]);
  }

  if (isNewbie) {
    result.push(gnl_season_16_definitions["newbie"]);
  }

  if (isExplorer) {
    result.push(gnl_season_16_definitions["win_every_map"]);
  }

  // Lamers
  const longestWin = wins.reduce((r: number, m: any) => {
    return r < m.durationInSeconds ? m.durationInSeconds : r;
  }, 0);
  const longestLoss = losses.reduce((r: number, m: any) => {
    return r < m.durationInSeconds ? m.durationInSeconds : r;
  }, 0);

  if (longestWin > 60 * 30 && longestLoss > 60 * 30) {
    result.push(gnl_season_16_definitions["join_them"]);
  }

  // # games in 24hr
  const matchesPerDay = _groupBy(matches, (m: any) =>
    moment(m.endTime).dayOfYear(),
  );
  const grindCounter = _map(matchesPerDay, (v: any[]) => v.length);
  const maxMatchesPerDay = Math.max(...grindCounter, 0);

  if (maxMatchesPerDay >= 30) {
    result.push(gnl_season_16_definitions["addicted"]);
  }

  const gain = _map(matchesPerDay, (v: any[]) =>
    v.reduce((r: number, s: any) => r + getPlayer(s).players[0].mmrGain, 0),
  );
  const mmrGainInADay = Math.max(...gain, 0);
  if (mmrGainInADay > 100) {
    result.push(gnl_season_16_definitions["rising_star"]);
  }

  if (
    calculateLadderPoints(account.battleTag, account.data.matches) >= ladderGoal
  ) {
    result.push(gnl_season_16_definitions["ladder_goal"]);
  }

  return result.sort((a, b) => b.points - a.points);
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
  gnl_season_16: {
    definitions: gnl_season_16_definitions,
    calculate: gnl_season_16_calculation,
  },
};
