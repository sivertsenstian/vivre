import { Race } from "@/stores/races";

export interface IVSRaceStatistics {
  total: number;
  wins: number;
  loss: number;
  percentage: number;
  matches: any[];
}

export interface IRaceStatisticsSummary extends IRaceStatistics {
  suspiciousGames: {
    total: number;
    wins: number;
    loss: number;
  };
}

export interface IRaceStatistics {
  matches: any[];
  maps: any;
  total: number;
  wins: number;
  loss: number;
  percentage: number;
  performance: boolean[];
  points: number;
  achievements: any[];
  achievementPoints: number;
  totalPoints: number;
  mmr: {
    max: number;
    min: number;
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
  month: IRaceStatistics;
  season: {
    summary: IRaceStatisticsSummary;
    [Race.Random]: IRaceStatistics;
    [Race.Human]: IRaceStatistics;
    [Race.Orc]: IRaceStatistics;
    [Race.NightElf]: IRaceStatistics;
    [Race.Undead]: IRaceStatistics;
  };
}

export interface IGNLStatistics {
  battleTag: string;
  race: Race;
  season: {
    summary: IRaceStatistics;
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
  games: {
    winDuration: number;
    lossDuration: number;
    isLamer: boolean;
  };
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

export interface IStepAnnotation {
  type: "None" | "Army" | "Tech" | "Information";
  text: string;
}

export interface IStep {
  id: string;
  time: string;
  food: string;
  instructions: string;
  timing: boolean;
  separator: boolean;
  annotation?: IStepAnnotation;
}
export interface ISampleGame {
  id: string;
  name?: string;
}

export interface IBuild {
  id: string;
  slug: string;
  author: string;
  originalAuthor: string;
  created: any;
  updated?: any;
  workInProgress: boolean;
  name: string;
  secret?: string;
  description: string;
  version: string;
  difficulty: string;
  viability: number;
  games: ISampleGame[];
  tags: string[];
  stars: number;
  starred?: any;
  player: Race;
  opponent: Race;
  steps: IStep[];
}
export interface IBuildOrderState {
  new: IBuild;
  edit: Partial<IBuild>;
  active: {};
  starred: { [key: string]: boolean };
  owns: { [key: string]: boolean };
}

export interface IGNLAccount {
  battleTag: string;
  race: Race;
  data?: any;
  ongoing?: any;
  points?: number;
  achievementPoints?: number;
  totalPoints?: number;
  achievements?: any[];
}
