﻿import type { IRaceStatistics } from "@/utilities/types";
import { Race } from "@/stores/races";
import _isNil from "lodash/isNil";
import _last from "lodash/last";
import _round from "lodash/round";
import _first from "lodash/first";
import _groupBy from "lodash/groupBy";
import axios from "axios";
import moment from "moment";
import type { Moment } from "moment";
import _sortBy from "lodash/sortBy";
import {
  season_achievements,
  calculateAchievementPoints,
  calculateLadderPoints,
} from "@/utilities/achievements.ts";

export const getPercentage = (data: any, race: Race) => {
  return _round(
    ((data?.wins?.[race]?.length ?? 0) / Math.max(1, getTotal(data, race))) *
      100,
    1,
  );
};

export const getTotal = (data: any, race: Race) => {
  return (data?.wins?.[race]?.length ?? 0) + (data?.loss?.[race]?.length ?? 0);
};

export const getInfo = (tag: string, matches: any[]) => {
  const first = _first<any>(matches)?.teams?.reduce(
    (r: any, t: any) =>
      t.players.some(
        (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
      )
        ? t.players[0]
        : r,
    {},
  );

  if (_isNil(first)) {
    return {};
  }

  const last = _last<any>(matches)?.teams?.reduce(
    (r: any, t: any) =>
      t.players.some(
        (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
      )
        ? t.players[0]
        : r,
    {},
  );

  first.initialMmr = last?.oldMmr ?? first.currentMmr;
  first.diffMmr = first.currentMmr - first.initialMmr;

  return first;
};

export const iswin = (m: any, ...tags: string[]) => {
  return tags.some((tag: string) =>
    m?.teams?.some(
      (t: any) =>
        t.won &&
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
        ),
    ),
  );
};

export const getwins = (tag: string, m: any) =>
  m?.teams?.some(
    (t: any) =>
      t.won &&
      t.players.some(
        (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
      ),
  );
export const getloss = (tag: string, m: any) =>
  m?.teams?.some(
    (t: any) =>
      !t.won &&
      t.players.some(
        (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
      ),
  );

export const getplayer = (tag: string) => (m: any) => {
  return {
    ...m?.teams?.find((t: any) =>
      t.players.find(
        (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
      ),
    ),
    match: m,
  };
};

export const getopponent = (tag: string) => (m: any) => {
  return {
    ...m?.teams?.find((t: any) =>
      t.players.find(
        (p: any) => p.battleTag.toLowerCase() !== tag.toLowerCase(),
      ),
    ),
    match: m,
  };
};

export const isRace = (tag: string, m: any, r: Race) =>
  m?.teams?.some((t: any) =>
    t.players.some(
      (p: any) =>
        p.battleTag.toLowerCase() === tag.toLowerCase() && p.race === r,
    ),
  );

export const opponentIsRace = (tag: string, m: any, r: Race) =>
  m?.teams?.some((t: any) =>
    t.players.some(
      (p: any) =>
        p.battleTag.toLowerCase() !== tag.toLowerCase() && p.race === r,
    ),
  );

const getPerformance = (tag: string, matches: any[]) => {
  return matches.map(
    (match: any) =>
      match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
      tag.toLowerCase(),
  );
};

export const getRaceStatistics = (tag: string, m: any[]): IRaceStatistics => {
  const matches = _sortBy(m, "endTime").reverse();
  const wins = matches.filter((m) => getwins(tag, m));
  const loss = matches.filter((m) => getloss(tag, m));
  const info = getInfo(tag, matches);

  const race = {
    wins: _groupBy(
      matches.filter((m) => getwins(tag, m)),
      (w) => w.teams[1].players[0].race,
    ),
    loss: _groupBy(
      matches.filter((m) => getloss(tag, m)),
      (l) => l.teams[0].players[0].race,
    ),
  };

  // Calculate mmr averages based on last 10 games played
  const c = matches.length;

  const averageWin = Math.abs(
    matches.reduce((s, m) => {
      const gain = getplayer(tag)(m).players[0].mmrGain;
      return gain > 0 ? s + gain : s;
    }, 0),
  );
  const averageLoss = Math.abs(
    matches.reduce((s, m) => {
      const gain = getplayer(tag)(m).players[0].mmrGain;
      return gain < 0 ? s + gain : s;
    }, 0),
  );
  const averageGain =
    matches.reduce((s, m) => s + getplayer(tag)(m).players[0].mmrGain, 0) / c;

  let result: IRaceStatistics = {
    matches,
    total: matches?.length ?? 0,
    wins: wins?.length ?? 0,
    loss: loss?.length ?? 0,
    percentage: (wins?.length ?? 0) / (wins?.length + loss?.length),
    performance: getPerformance(tag, matches),

    points: 0,
    totalPoints: 0,
    achievements: [],
    achievementPoints: 0,

    mmr: {
      initial: info?.initialMmr ?? 0,
      current: info?.currentMmr ?? 0,
      diff: info?.diffMmr ?? 0,
      averages: {
        count: c,
        win: _round(averageWin, 2),
        loss: _round(averageLoss, 2),
        gain: _round(averageGain, 2),
      },
    },
    race: {
      [Race.Random]: {
        total: getTotal(race, Race.Random),
        percentage: getPercentage(race, Race.Random),
        wins: race?.wins?.[Race.Random]?.length ?? 0,
        loss: race?.loss?.[Race.Random]?.length ?? 0,
      },
      [Race.Human]: {
        total: getTotal(race, Race.Human),
        percentage: getPercentage(race, Race.Human),
        wins: race?.wins?.[Race.Human]?.length ?? 0,
        loss: race?.loss?.[Race.Human]?.length ?? 0,
      },
      [Race.Orc]: {
        total: getTotal(race, Race.Orc),
        percentage: getPercentage(race, Race.Orc),
        wins: race?.wins?.[Race.Orc]?.length ?? 0,
        loss: race?.loss?.[Race.Orc]?.length ?? 0,
      },
      [Race.NightElf]: {
        total: getTotal(race, Race.NightElf),
        percentage: getPercentage(race, Race.NightElf),
        wins: race?.wins?.[Race.NightElf]?.length ?? 0,
        loss: race?.loss?.[Race.NightElf]?.length ?? 0,
      },
      [Race.Undead]: {
        total: getTotal(race, Race.Undead),
        percentage: getPercentage(race, Race.Undead),
        wins: race?.wins?.[Race.Undead]?.length ?? 0,
        loss: race?.loss?.[Race.Undead]?.length ?? 0,
      },
    },
  };

  result.points = calculateLadderPoints(tag, result.matches);
  result.achievements = season_achievements[20].calculate({
    battleTag: tag,
    data: result,
  } as any);
  result.achievementPoints = calculateAchievementPoints(result.achievements);
  result.totalPoints = result.points + result.achievementPoints;

  return result;
};

const url = (
  tag: string,
  offset: number = 0,
  size: number = 100,
  season: number = 19,
) =>
  `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
    tag,
  )}&gateway=20&offset=${offset}&pageSize=${size}&gameMode=1&season=${season}`;

export const getMostRecentGames: any = async (
  tag: string,
  season: number,
  amount: number = 1,
) => {
  const { data: response } = await axios.get(url(tag, 0, amount, season));
  return response.matches;
};

export const getAllSeasonGames = async (
  tag: string,
  season: number,
  max: number = 0,
) => {
  let all: any[] = [];
  let finished = false;
  let prev = all.length;
  let failsafe = 0;

  while (!finished && failsafe < 30) {
    const { data: response } = await axios.get(
      url(tag, all.length, 100, season),
    );

    all = [...all, ...response.matches];

    finished =
      all.length === response.count ||
      all.length === prev ||
      (max !== 0 && all.length > max);
    prev = all.length;
    failsafe++;
  }

  return all;
};

export const getSeasonGamesBetween = async (
  tag: string,
  seasons: number[],
  from: Moment,
  to: Moment,
  max: number = 0,
) => {
  let all: any[] = [];

  for (let s = 0; s < seasons.length; s++) {
    const season = seasons[s];
    let finished = false;
    let prev = 0;
    let failsafe = 0;
    let seasonAll: any[] = [];

    while (!finished && failsafe < 10) {
      const { data: response } = await axios.get(
        url(tag, seasonAll.length, 100, season),
      );

      seasonAll = [...seasonAll, ...response.matches];

      finished =
        seasonAll.length === response.count ||
        seasonAll.length === prev ||
        (max !== 0 && seasonAll.length > max) ||
        moment(_last(seasonAll)?.endTime).isBefore(from);
      prev = seasonAll.length;
      failsafe++;
    }

    all = [...all, ...seasonAll];
  }

  return all.filter(
    (m) =>
      moment(m.endTime).isAfter(from) && moment(m.endTime).isSameOrBefore(to),
  );
};

export const numberOfGames = (target: number, avg: number) =>
  Math.abs(Math.ceil(target / avg));
