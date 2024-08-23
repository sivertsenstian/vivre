export enum Race {
  Random = 0,
  Human = 1,
  Orc = 2,
  NightElf = 4,
  Undead = 8,
}

export const raceName: any = {
  [Race.Human]: "Human",
  [Race.Orc]: "Orc",
  [Race.Undead]: "Undead",
  [Race.NightElf]: "Night Elf",
  [Race.Random]: "Random",
};

import human from "@/assets/race/human.png";
import orc from "@/assets/race/orc.png";
import nightelf from "@/assets/race/nightelf.png";
import undead from "@/assets/race/undead.png";
import random from "@/assets/race/random.png";

export const raceIcon: any = {
  [Race.Human]: human,
  [Race.Orc]: orc,
  [Race.Undead]: undead,
  [Race.NightElf]: nightelf,
  [Race.Random]: random,
};

import alchemist from "@/assets/heroes/alchemist.png";
import archmage from "@/assets/heroes/archmage.png";
import avatarofflame from "@/assets/heroes/alchemist.png";
import bansheeranger from "@/assets/heroes/bansheeranger.png";
import beastmaster from "@/assets/heroes/beastmaster.png";
import blademaster from "@/assets/heroes/blademaster.png";
import cryptlord from "@/assets/heroes/cryptlord.png";
import deathknight from "@/assets/heroes/deathknight.png";
import demonhunter from "@/assets/heroes/demonhunter.png";
import dreadlord from "@/assets/heroes/alchemist.png";
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

export const heroIcon: any = {
  alchemist,
  archmage,
  avatarofflame,
  bansheeranger,
  beastmaster,
  blademaster,
  cryptlord,
  deathknight,
  demonhunter,
  dreadlord,
  farseer,
  keeperofthegrove,
  lich,
  mountainking,
  paladin,
  pandarenbrewmaster,
  pitlord,
  priestessofthemoon,
  seawitch,
  shadowhunter,
  sorceror,
  taurenchieftain,
  tinker,
  warden,
};

import cr_hu_vs_hu_1 from "@/assets/creeproutes/human/human/AL.jpg";
import cr_hu_vs_hu_2 from "@/assets/creeproutes/human/human/CH.jpg";
import cr_hu_vs_hu_3 from "@/assets/creeproutes/human/human/HF.jpg";
import cr_hu_vs_hu_4 from "@/assets/creeproutes/human/human/LR.jpg";
import cr_hu_vs_hu_5 from "@/assets/creeproutes/human/human/NiS.jpg";
import cr_hu_vs_hu_6 from "@/assets/creeproutes/human/human/SG.jpg";
import cr_hu_vs_hu_7 from "@/assets/creeproutes/human/human/TH.jpg";
import cr_hu_vs_hu_8 from "@/assets/creeproutes/human/human/ST.jpg";

import cr_hu_vs_ne_1 from "@/assets/creeproutes/human/nightelf/AL.jpg";
import cr_hu_vs_ne_2 from "@/assets/creeproutes/human/nightelf/CH.jpg";
import cr_hu_vs_ne_3 from "@/assets/creeproutes/human/nightelf/HF.jpg";
import cr_hu_vs_ne_4 from "@/assets/creeproutes/human/nightelf/LR.jpg";
import cr_hu_vs_ne_5 from "@/assets/creeproutes/human/nightelf/NiS.jpg";
import cr_hu_vs_ne_6 from "@/assets/creeproutes/human/nightelf/SG.jpg";
import cr_hu_vs_ne_7 from "@/assets/creeproutes/human/nightelf/TH.jpg";
import cr_hu_vs_ne_8 from "@/assets/creeproutes/human/nightelf/ST.jpg";

import cr_hu_vs_oc_1 from "@/assets/creeproutes/human/orc/AL.jpg";
import cr_hu_vs_oc_2 from "@/assets/creeproutes/human/orc/CH.jpg";
import cr_hu_vs_oc_3 from "@/assets/creeproutes/human/orc/HF.jpg";
import cr_hu_vs_oc_4 from "@/assets/creeproutes/human/orc/LR.jpg";
import cr_hu_vs_oc_5 from "@/assets/creeproutes/human/orc/NiS.jpg";
import cr_hu_vs_oc_6 from "@/assets/creeproutes/human/orc/SG.jpg";
import cr_hu_vs_oc_7 from "@/assets/creeproutes/human/orc/TH.jpg";
import cr_hu_vs_oc_8 from "@/assets/creeproutes/human/orc/ST.jpg";

import cr_hu_vs_ud_1 from "@/assets/creeproutes/human/undead/AL.jpg";
import cr_hu_vs_ud_2 from "@/assets/creeproutes/human/undead/CH.jpg";
import cr_hu_vs_ud_3 from "@/assets/creeproutes/human/undead/HF.jpg";
import cr_hu_vs_ud_4 from "@/assets/creeproutes/human/undead/LR.jpg";
import cr_hu_vs_ud_5 from "@/assets/creeproutes/human/undead/NiS.jpg";
import cr_hu_vs_ud_6 from "@/assets/creeproutes/human/undead/SG.jpg";
import cr_hu_vs_ud_7 from "@/assets/creeproutes/human/undead/TH.jpg";

import cr_hu_vs_r_1 from "@/assets/creeproutes/human/random/AL.jpg";
import cr_hu_vs_r_2 from "@/assets/creeproutes/human/random/CH.jpg";
import cr_hu_vs_r_3 from "@/assets/creeproutes/human/random/HF.jpg";
import cr_hu_vs_r_4 from "@/assets/creeproutes/human/random/LR.jpg";
import cr_hu_vs_r_5 from "@/assets/creeproutes/human/random/NiS.jpg";
import cr_hu_vs_r_6 from "@/assets/creeproutes/human/random/SG.jpg";
import cr_hu_vs_r_7 from "@/assets/creeproutes/human/random/TH.jpg";
import cr_hu_vs_r_8 from "@/assets/creeproutes/human/random/ST.jpg";

import cr_missing from "@/assets/creeproutes/missing.png";

export const creeproutes: any = {
  [Race.Human]: {
    [Race.Random]: {
      "Autumn Leaves v2": { img: cr_hu_vs_r_1, games: [] },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": { img: cr_hu_vs_r_2, games: [] },
      Hammerfall: { img: cr_hu_vs_r_3, games: [] },
      "Last Refuge": { img: cr_hu_vs_r_4, games: [] },
      "Northern Isles": { img: cr_hu_vs_r_5, games: [] },
      "Shallow Grave": { img: cr_hu_vs_r_6, games: [] },
      Springtime: { img: cr_hu_vs_r_8, games: [] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": { img: cr_missing, games: [] },
      Tidehunters: { img: cr_hu_vs_r_7, games: [] },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.Human]: {
      "Autumn Leaves v2": { img: cr_hu_vs_hu_1, games: [] },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": { img: cr_hu_vs_hu_2, games: [] },
      Hammerfall: { img: cr_hu_vs_hu_3, games: [] },
      "Last Refuge": { img: cr_hu_vs_hu_4, games: [] },
      "Northern Isles": { img: cr_hu_vs_hu_5, games: [] },
      "Shallow Grave": { img: cr_hu_vs_hu_6, games: [] },
      Springtime: { img: cr_hu_vs_hu_8, games: [] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": { img: cr_missing, games: [] },
      Tidehunters: { img: cr_hu_vs_hu_7, games: [] },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.Orc]: {
      "Autumn Leaves v2": { img: cr_hu_vs_oc_1, games: [] },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": { img: cr_hu_vs_oc_2, games: [] },
      Hammerfall: { img: cr_hu_vs_oc_3, games: [] },
      "Last Refuge": { img: cr_hu_vs_oc_4, games: [] },
      "Northern Isles": { img: cr_hu_vs_oc_5, games: [] },
      "Shallow Grave": { img: cr_hu_vs_oc_6, games: [] },
      Springtime: { img: cr_hu_vs_oc_8, games: [] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": { img: cr_missing, games: [] },
      Tidehunters: { img: cr_hu_vs_oc_7, games: [] },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.NightElf]: {
      "Autumn Leaves v2": { img: cr_hu_vs_ne_1, games: [] },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": { img: cr_hu_vs_ne_2, games: [] },
      Hammerfall: {
        img: cr_hu_vs_ne_3,
        games: [
          "66ae269882a9ebbac5b59633",
          "66a22e9382a9ebbac50747a8",
          "669a96e482a9ebbac54e89af",
        ],
      },
      "Last Refuge": { img: cr_hu_vs_ne_4, games: [] },
      "Northern Isles": { img: cr_hu_vs_ne_5, games: [] },
      "Shallow Grave": {
        img: cr_hu_vs_ne_6,
        games: ["6683e32a82a9ebbac56f2f0f", "6690d00d82a9ebbac5196bd6"],
      },
      Springtime: { img: cr_hu_vs_ne_8, games: [] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": { img: cr_missing, games: [] },
      Tidehunters: {
        img: cr_hu_vs_ne_7,
        games: ["66c1d0ad0ebc9196a2e7bce5", "66a4b6c282a9ebbac59b06a1"],
      },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.Undead]: {
      "Autumn Leaves v2": { img: cr_hu_vs_ud_1, games: [] },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": { img: cr_hu_vs_ud_2, games: [] },
      Hammerfall: { img: cr_hu_vs_ud_3, games: [] },
      "Last Refuge": { img: cr_hu_vs_ud_4, games: [] },
      "Northern Isles": { img: cr_hu_vs_ud_5, games: [] },
      "Shallow Grave": { img: cr_hu_vs_ud_6, games: [] },
      Springtime: { img: cr_missing, games: [] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": { img: cr_missing, games: [] },
      Tidehunters: { img: cr_hu_vs_ud_7, games: [] },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
  },
};
