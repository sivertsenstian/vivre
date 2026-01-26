import moment from "moment";
import { Race } from "@/stores/races.ts";

export const current_season = 24;
export const seasonDurationInWeeks = 16;
export const start = moment("26.01.26", "DD.MM.YYYY");
export const end = moment(start).add(seasonDurationInWeeks, "weeks");
export const duration = Math.abs(end.diff(start, "days"));
export const today = moment().startOf("day");
export const current_week = moment().startOf("isoWeek");
export const current_month = moment().startOf("month");

export const days_since_start = today.diff(start, "days");
export const version = { major: 2, minor: 0, patch: 3, full: "2.0.3" };

export const races = [
  Race.Human,
  Race.Orc,
  Race.NightElf,
  Race.Undead,
  Race.Random,
];

export const start_color = "rgb(192 110 72)";
export const end_color = "rgb(247 203 94)";

export const ranks = [
  { name: "Grandmaster", icon: "mdi-trophy-award", color: "#FFD700" },
  { name: "Master", icon: "mdi-trophy", color: "#CB3A1F" },
  { name: "Adept", icon: "mdi-trophy-outline", color: "#EB42EF" },
  { name: "Diamond", icon: "mdi-diamond", color: "#b9f2ff" },
  { name: "Platinum", icon: "mdi-gold", color: "#e5e4e2" },
  { name: "Gold", icon: "mdi-gold", color: "#FFD700" },
  { name: "Silver", icon: "mdi-gold", color: "#C0C0C0" },
  { name: "Bronze", icon: "mdi-gold", color: "#CD7F32" },
  { name: "Grass", icon: "mdi-grass", color: "#136d15" },
];
