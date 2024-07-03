import { Race } from "@/stores/races";

export interface IVSRaceStatistics {
  total: number;
  wins: number;
  loss: number;
  percentage: number;
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
    summary: IRaceStatistics;
    [Race.Random]: IRaceStatistics;
    [Race.Human]: IRaceStatistics;
    [Race.Orc]: IRaceStatistics;
    [Race.NightElf]: IRaceStatistics;
    [Race.Undead]: IRaceStatistics;
  };
}
