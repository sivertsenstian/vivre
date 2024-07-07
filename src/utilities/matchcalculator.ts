import type { IRaceStatistics } from "@/utilities/types";
import { Race } from "@/stores/races";
import _isNil from "lodash/isNil";
import _last from "lodash/last";
import _round from "lodash/round";
import _first from "lodash/first";
import _groupBy from "lodash/groupBy";

const getPercentage = (data: any, race: Race) => {
  return _round(
    ((data?.wins?.[race]?.length ?? 0) / Math.max(1, getTotal(data, race))) *
      100,
    1,
  );
};

const getTotal = (data: any, race: Race) => {
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

const isRace = (tag: string, m: any, r: Race) =>
  m?.teams?.some((t: any) =>
    t.players.some(
      (p: any) =>
        p.battleTag.toLowerCase() === tag.toLowerCase() && p.race === r,
    ),
  );

const getPerformance = (tag: string, matches: any[]) => {
  return matches.map(
    (match: any) =>
      match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
      tag.toLowerCase(),
  );
};

export const getRaceStatistics = (
  tag: string,
  matches: any[],
): IRaceStatistics => {
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

  let result: IRaceStatistics = {
    total: matches?.length ?? 0,
    wins: wins?.length ?? 0,
    loss: loss?.length ?? 0,
    percentage: (wins?.length ?? 0) / (wins?.length + loss?.length) ?? 1,
    performance: getPerformance(tag, matches),
    mmr: {
      initial: info?.initialMmr ?? 0,
      current: info?.currentMmr ?? 0,
      diff: info?.diffMmr ?? 0,
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

  return result;
};
