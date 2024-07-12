import { Race } from "@/stores/races";

export interface IVSRaceStatistics {
  total: number;
  wins: number;
  loss: number;
  percentage: number;
}

export interface IRaceStatisticsSummary extends IRaceStatistics {
  suspiciousGames: {
    total: number;
    wins: number;
    loss: number;
  };
}

export interface IRaceStatistics {
  total: number;
  wins: number;
  loss: number;
  percentage: number;
  performance: boolean[];
  mmr: {
    initial: number;
    current: number;
    diff: number;
    averages: {
      count: number;
      win: number;
      loss: number;
      gain: number;
    };
  };
  race: {
    [Race.Random]: IVSRaceStatistics;
    [Race.Human]: IVSRaceStatistics;
    [Race.Orc]: IVSRaceStatistics;
    [Race.NightElf]: IVSRaceStatistics;
    [Race.Undead]: IVSRaceStatistics;
  };
}

export interface IStatistics {
  battleTag: string;
  race: Race;
  day: IRaceStatistics;
  week: IRaceStatistics;
  season: {
    summary: IRaceStatisticsSummary;
    [Race.Random]: IRaceStatistics;
    [Race.Human]: IRaceStatistics;
    [Race.Orc]: IRaceStatistics;
    [Race.NightElf]: IRaceStatistics;
    [Race.Undead]: IRaceStatistics;
  };
}

export interface IOngoingHistory {
  wins: number;
  loss: number;
  total: number;
  performance: boolean[];
  last: boolean[];
  heroes: any[][];
}

export interface IOngoing {
  id: string | null;
  start: string | null;
  active: boolean;
  player: { name: string; race: Race; battleTag: string; oldMmr: number };
  opponent: { name: string; race: Race; battleTag: string; oldMmr: number };
  map: string;
  server: any;
  history: IOngoingHistory;
}
