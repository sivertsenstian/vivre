import moment from "moment";
import { Race } from "@/stores/races.ts";
import archmage from "@/assets/heroes/archmage.png";
import avatarofflame from "@/assets/heroes/avatarofflame.png";
import bansheeranger from "@/assets/heroes/bansheeranger.png";
import beastmaster from "@/assets/heroes/beastmaster.png";
import blademaster from "@/assets/heroes/blademaster.png";
import cryptlord from "@/assets/heroes/cryptlord.png";
import deathknight from "@/assets/heroes/deathknight.png";
import demonhunter from "@/assets/heroes/demonhunter.png";
import dreadlord from "@/assets/heroes/dreadlord.png";
import farseer from "@/assets/heroes/farseer.png";
import keeperofthegrove from "@/assets/heroes/keeperofthegrove.png";
import lich from "@/assets/heroes/lich.png";
import mountainking from "@/assets/heroes/mountainking.png";
import paladin from "@/assets/heroes/paladin.png";
import pandarenbrewmaster from "@/assets/heroes/pandarenbrewmaster.png";
import pitlord from "@/assets/heroes/pitlord.png";
import priestessofthemoon from "@/assets/heroes/priestessofthemoon.png";
import seawitch from "@/assets/heroes/seawitch.png";
import shadowhunter from "@/assets/heroes/shadowhunter.png";
import sorceror from "@/assets/heroes/sorceror.png";
import taurenchieftain from "@/assets/heroes/taurenchieftain.png";
import tinker from "@/assets/heroes/tinker.png";
import warden from "@/assets/heroes/warden.png";

export const current_season = 24;
export const seasonDurationInWeeks = 16;
export const start = moment("26.01.26", "DD.MM.YYYY");
export const end = moment(start).add(seasonDurationInWeeks, "weeks");
export const duration = Math.abs(end.diff(start, "days"));
export const today = moment().startOf("day");
export const current_week = moment().startOf("isoWeek");
export const current_month = moment().startOf("month");

export const days_since_start = today.diff(start, "days");
export const version = { major: 2, minor: 0, patch: 4, full: "2.0.4" };

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

export const heroes: { [key: string]: string } = {
  alchemist: "Alchemist",
  archmage: "Archmage",
  avatarofflame: "Firelord",
  bansheeranger: "Dark Ranger",
  beastmaster: "Beastmaster",
  blademaster: "Blademaster",
  cryptlord: "Crypt Lord",
  deathknight: "Death Knight",
  demonhunter: "Demon Hunter",
  dreadlord: "Dreadlord",
  farseer: "Far Seer",
  keeperofthegrove: "Keeper of the Grove",
  lich: "Lich",
  mountainking: "Mountain King",
  paladin: "Paladin",
  pandarenbrewmaster: "Pandaren Brewmaster",
  pitlord: "Pit Lord",
  priestessofthemoon: "Priestess of the Moon",
  seawitch: "Naga Sea Witch",
  shadowhunter: "Shadow Hunter",
  sorceror: "Blood Mage",
  taurenchieftain: "Tauren Chieftain",
  tinker: "Tinker",
  warden: "Warden",
};
