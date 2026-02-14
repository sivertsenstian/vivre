import type { IStep } from "@/utilities/types";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import type { Duration } from "moment";
import momentDurationSetup from "moment-duration-format";
import { Race } from "@/stores/races.ts";
import _has from "lodash/has";
import _includes from "lodash/includes";
import _capitalize from "lodash/capitalize";
momentDurationSetup(moment);

export enum BuildOrderType {
  BuildUnit = "Build unit",
  BuildBuilding = "Build building",
  BuildHero = "Build hero",
  Learn = "Learn",
  Tech = "Tech",
  CancelUnit = "Cancel unit",
  CancelBuilding = "Cancel building",
  CancelHero = "Cancel hero",
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

const toImg = (instruction: string) => {
  return `/icons/btn${String(instruction ?? "")
    .replace(/ /g, "")
    .replace(/\//g, "")
    .replace(/’/g, "")
    .toLowerCase()}.jpg`;
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
          case BuildOrderType.BuildUnit:
          case BuildOrderType.BuildHero:
          case BuildOrderType.BuildBuilding:
            return {
              ...base,
              instructions: `Build ${aan(item.obj)} ${item.obj}`,
            };
          case BuildOrderType.CancelUnit:
          case BuildOrderType.CancelBuilding:
          case BuildOrderType.CancelHero:
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
): { items: any[]; count: { [key: string]: number } } => {
  let count: { [key: string]: number } = {};

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
          id: item.obj,
          type: item.type,
          class: item.type.split(" ").map(_capitalize).join(""),
          time: duration(item.timeSpan),
          timespan: item.timeSpan,
          timing: false,
          separator: false,
          icon: toImg(item.obj),
          count: count?.[item.obj] ?? 1,
          showCount: false,
        };

        if (
          [
            BuildOrderType.CancelUnit,
            BuildOrderType.CancelBuilding,
            BuildOrderType.CancelHero,
          ].some((e) => e === item.type)
        ) {
          count[item.obj] = _has(count, item.obj) ? count[item.obj] - 1 : 0;
        } else {
          count[item.obj] = _has(count, item.obj) ? count[item.obj] + 1 : 2;
        }

        switch (item.type) {
          case BuildOrderType.BuildUnit:
          case BuildOrderType.BuildBuilding:
          case BuildOrderType.BuildHero:
            return {
              ...base,
              instructions: `Built ${aan(item.obj)} ${item.obj}`,
              showCount: item.type === BuildOrderType.BuildUnit,
              expansion:
                item.type === BuildOrderType.BuildBuilding &&
                [
                  "town hall",
                  "great hall",
                  "haunted goldmine",
                  "tree of ages",
                ].some((m) => item.obj.toLowerCase() === m),
            };
          case BuildOrderType.CancelUnit:
          case BuildOrderType.CancelBuilding:
          case BuildOrderType.CancelHero:
            return { ...base, instructions: `Cancelled ${item.obj}` };
          case BuildOrderType.Tech:
          case BuildOrderType.Upgrade:
            return {
              ...base,
              instructions: `Upgraded ${item.obj}`,
              timing: true,
            };
          case BuildOrderType.Learn:
            return {
              ...base,
              instructions: `Trained ${item.obj} Level ${base.count}`,
            };
          case BuildOrderType.Research:
            // General caster upgrades
            let obj =
              _includes(item.obj.toLowerCase(), "training") &&
              !_includes(item.obj.toLowerCase(), "animal war")
                ? item.obj.replace(
                    "Training",
                    base.count === 1 ? "Adept Training" : "Master Training",
                  )
                : item.obj;

            // Human upgrades
            obj = _includes(item.obj.toLowerCase(), "lumber harvesting")
              ? item.obj.replace(
                  "Lumber",
                  base.count === 1 ? "Improved Lumber" : "Advanced Lumber",
                )
              : obj;

            obj =
              ["iron plating", "iron forged swords"].some((v) =>
                _includes(item.obj.toLowerCase(), v),
              ) && base.count > 1
                ? item.obj.replace(
                    "Iron",
                    base.count === 2 ? "Steel" : "Mithril",
                  )
                : obj;

            obj =
              _includes(item.obj.toLowerCase(), "black gunpowder") &&
              base.count > 1
                ? item.obj.replace(
                    "Black",
                    base.count === 2 ? "Refined" : "Imbued",
                  )
                : obj;

            obj =
              _includes(item.obj.toLowerCase(), "studded leather") &&
              base.count > 1
                ? item.obj.replace(
                    "Studded Leather",
                    base.count === 2 ? "Reinforced Leather" : "Dragonhide",
                  )
                : obj;

            // Orc upgrades
            obj =
              ["steel melee", "steel armor", "steel ranged"].some((v) =>
                _includes(item.obj.toLowerCase(), v),
              ) && base.count > 1
                ? item.obj.replace(
                    "Steel",
                    base.count === 2 ? "Thorium" : "Arcanite",
                  )
                : obj;

            // Night elf & undead upgrades
            obj =
              [
                "strength of the",
                "moon armor",
                "reinforced hides",
                "unholy armor",
                "creature carapace",
                "unholy strength",
                "creature attack",
              ].some((v) => _includes(item.obj.toLowerCase(), v)) &&
              base.count > 1
                ? base.count === 2
                  ? `Improved ${item.obj}`
                  : `Advanced ${item.obj}`
                : obj;

            return {
              ...base,
              instructions: `Researched ${obj}`,
              icon: toImg(obj),
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

  return { items: steps, count };
};
