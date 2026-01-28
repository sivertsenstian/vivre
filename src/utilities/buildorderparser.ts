import type { IStep } from "@/utilities/types";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import type { Duration } from "moment";
import momentDurationSetup from "moment-duration-format";
import { Race } from "@/stores/races.ts";
momentDurationSetup(moment);

enum BuildOrderType {
  Build = "Build",
  Learn = "Learn",
  Tech = "Tech",
  Cancel = "Cancel",
  Research = "Research",
  Hire = "Hire",
  Buy = "Buy",
  Upgrade = "Upgrade",
  Unsummon = "Unsummon",
}

interface IReplayBuildOrderItem {
  timeSpan: string;
  type: BuildOrderType;
  obj: string;
}

interface IReplayBuildOrder {
  playerName: string;
  buildOrderItems: IReplayBuildOrderItem[];
}

export interface IReplay {
  replayName: string;
  playerBuildOrders: IReplayBuildOrder[];
}

const aan = (word: string) => {
  const s = word?.[0] ?? "";
  if (
    s === "a" ||
    s === "e" ||
    s === "i" ||
    s === "o" ||
    s === "u" ||
    s === "A" ||
    s === "E" ||
    s === "I" ||
    s === "O" ||
    s === "U"
  ) {
    return "an";
  } else {
    return "a";
  }
};

export const getRaceFromBuildOrderItems = (
  items: IReplayBuildOrderItem[],
): Race => {
  if (items.some((item) => item.obj.toLowerCase() === "wisp")) {
    return Race.NightElf;
  }

  if (items.some((item) => item.obj.toLowerCase() === "peasant")) {
    return Race.Human;
  }

  if (items.some((item) => item.obj.toLowerCase() === "peon")) {
    return Race.Orc;
  }

  if (items.some((item) => item.obj.toLowerCase() === "acolyte")) {
    return Race.Undead;
  }

  return Race.Random;
};

const duration = (timespan: string) => {
  return (moment.duration(timespan) as any).format("mm:ss", { trim: false });
};

export const formatTimeSpanDuration = (d: Duration): string => {
  return (d as any)?.format("mm:ss", { trim: false }) ?? "00:00";
};

export const parse = (
  minutes: number,
  replayBuildOrderItems: IReplayBuildOrderItem[],
  initialFood: string = "",
): IStep[] => {
  let steps =
    replayBuildOrderItems
      .filter((item, index, array) => {
        if (index > 0) {
          const prev = array[index - 1];
          const p = (moment.duration(prev.timeSpan) as any).format("mm:ss", {
            trim: false,
          });
          const c = (moment.duration(item.timeSpan) as any).format("mm:ss", {
            trim: false,
          });

          return (
            moment.duration(item.timeSpan).minutes() <= minutes - 1 &&
            (prev.type !== item.type || prev.obj !== item.obj || p !== c)
          );
        }
        return true;
      })
      .map((item) => {
        const base = {
          id: uuidv4(),
          time: duration(item.timeSpan),
          food: initialFood,
          timing: false,
          separator: false,
        };

        switch (item.type) {
          case BuildOrderType.Build:
            return {
              ...base,
              instructions: `Build ${aan(item.obj)} ${item.obj}`,
            };
          case BuildOrderType.Cancel:
            return { ...base, instructions: `Cancel the ${item.obj}` };
          case BuildOrderType.Tech:
          case BuildOrderType.Upgrade:
            return {
              ...base,
              instructions: `Upgrade your ${item.obj}`,
              timing: true,
            };
          case BuildOrderType.Learn:
            return { ...base, instructions: `Train ${item.obj}` };
          case BuildOrderType.Research:
            return {
              ...base,
              instructions: `Research ${item.obj}`,
              timing: true,
            };
          case BuildOrderType.Hire:
            return {
              ...base,
              instructions: `Hire ${aan(item.obj)} ${item.obj}`,
            };
          case BuildOrderType.Buy:
            return {
              ...base,
              instructions: `Buy ${aan(item.obj)} ${item.obj}`,
            };
          default:
            return { ...base, instructions: `[${item.type}] ${item.obj}` };
        }
      }) ?? [];

  return steps;
};

export const summarize = (
  replayBuildOrderItems: IReplayBuildOrderItem[],
): any[] => {
  let steps =
    replayBuildOrderItems
      .filter((item, index, array) => {
        if (index > 0) {
          const prev = array[index - 1];
          const p = (moment.duration(prev.timeSpan) as any).format("mm:ss", {
            trim: false,
          });
          const c = (moment.duration(item.timeSpan) as any).format("mm:ss", {
            trim: false,
          });

          return prev.type !== item.type || prev.obj !== item.obj || p !== c;
        }
        return true;
      })
      .map((item) => {
        const base = {
          id: uuidv4(),
          type: item.type,
          time: duration(item.timeSpan),
          timespan: item.timeSpan,
          timing: false,
          separator: false,
        };

        switch (item.type) {
          case BuildOrderType.Build:
            return {
              ...base,
              instructions: `Built ${aan(item.obj)} ${item.obj}`,
            };
          case BuildOrderType.Cancel:
            return { ...base, instructions: `Cancelled ${item.obj}` };
          case BuildOrderType.Tech:
          case BuildOrderType.Upgrade:
            return {
              ...base,
              instructions: `Upgraded ${item.obj}`,
              timing: true,
            };
          case BuildOrderType.Learn:
            return { ...base, instructions: `Trained ${item.obj}` };
          case BuildOrderType.Research:
            return {
              ...base,
              instructions: `Researched ${item.obj}`,
              timing: true,
            };
          case BuildOrderType.Hire:
            return {
              ...base,
              instructions: `Hired ${aan(item.obj)} ${item.obj}`,
            };
          case BuildOrderType.Buy:
            return {
              ...base,
              instructions: `Bought ${aan(item.obj)} ${item.obj}`,
            };
          case BuildOrderType.Unsummon:
            return {
              ...base,
              instructions: `Unsummoned ${aan(item.obj)} ${item.obj}`,
            };
          default:
            return { ...base, instructions: `[${item.type}] ${item.obj}` };
        }
      }) ?? [];

  return steps;
};
