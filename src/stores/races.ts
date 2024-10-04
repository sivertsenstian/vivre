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
  [Race.Random]: "Any",
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

import human_upkeep from "@/assets/upkeep/human.png";
import orc_upkeep from "@/assets/upkeep/orc.png";
import nightelf_upkeep from "@/assets/upkeep/nightelf.png";
import undead_upkeep from "@/assets/upkeep/undead.png";

export const raceUpkeep: any = {
  [Race.Human]: human_upkeep,
  [Race.Orc]: orc_upkeep,
  [Race.Undead]: undead_upkeep,
  [Race.NightElf]: nightelf_upkeep,
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

// Human
import cr_hu_vs_hu_1 from "@/assets/creeproutes/human/human/AL.jpg";
import cr_hu_vs_hu_2 from "@/assets/creeproutes/human/human/CH.jpg";
import cr_hu_vs_hu_3 from "@/assets/creeproutes/human/human/HF.jpg";
import cr_hu_vs_hu_4 from "@/assets/creeproutes/human/human/LR.jpg";
import cr_hu_vs_hu_5 from "@/assets/creeproutes/human/human/NiS.jpg";
import cr_hu_vs_hu_6 from "@/assets/creeproutes/human/human/SG.jpg";
import cr_hu_vs_hu_7 from "@/assets/creeproutes/human/human/TH.jpg";
import cr_hu_vs_hu_8 from "@/assets/creeproutes/human/human/ST.jpg";
import cr_hu_vs_hu_9 from "@/assets/creeproutes/human/human/LT.jpg";
import cr_hu_vs_hu_10 from "@/assets/creeproutes/human/human/TM.jpg";

import cr_hu_vs_ne_1 from "@/assets/creeproutes/human/nightelf/AL.jpg";
import cr_hu_vs_ne_2 from "@/assets/creeproutes/human/nightelf/CH.jpg";
import cr_hu_vs_ne_3 from "@/assets/creeproutes/human/nightelf/HF.jpg";
import cr_hu_vs_ne_4 from "@/assets/creeproutes/human/nightelf/LR.jpg";
import cr_hu_vs_ne_5 from "@/assets/creeproutes/human/nightelf/NiS.jpg";
import cr_hu_vs_ne_6 from "@/assets/creeproutes/human/nightelf/SG.jpg";
import cr_hu_vs_ne_7 from "@/assets/creeproutes/human/nightelf/TH.jpg";
import cr_hu_vs_ne_8 from "@/assets/creeproutes/human/nightelf/ST.jpg";
import cr_hu_vs_ne_9 from "@/assets/creeproutes/human/nightelf/LT.jpg";

import cr_hu_vs_oc_1 from "@/assets/creeproutes/human/orc/AL.jpg";
import cr_hu_vs_oc_2 from "@/assets/creeproutes/human/orc/CH.jpg";
import cr_hu_vs_oc_3 from "@/assets/creeproutes/human/orc/HF.jpg";
import cr_hu_vs_oc_4 from "@/assets/creeproutes/human/orc/LR.jpg";
import cr_hu_vs_oc_5 from "@/assets/creeproutes/human/orc/NiS.jpg";
import cr_hu_vs_oc_6 from "@/assets/creeproutes/human/orc/SG.jpg";
import cr_hu_vs_oc_7 from "@/assets/creeproutes/human/orc/TH.jpg";
import cr_hu_vs_oc_8 from "@/assets/creeproutes/human/orc/ST.jpg";
import cr_hu_vs_oc_9 from "@/assets/creeproutes/human/orc/LT.jpg";

import cr_hu_vs_ud_1 from "@/assets/creeproutes/human/undead/AL.jpg";
import cr_hu_vs_ud_2 from "@/assets/creeproutes/human/undead/CH.jpg";
import cr_hu_vs_ud_3 from "@/assets/creeproutes/human/undead/HF.jpg";
import cr_hu_vs_ud_4 from "@/assets/creeproutes/human/undead/LR.jpg";
import cr_hu_vs_ud_5 from "@/assets/creeproutes/human/undead/NiS.jpg";
import cr_hu_vs_ud_6 from "@/assets/creeproutes/human/undead/SG.jpg";
import cr_hu_vs_ud_7 from "@/assets/creeproutes/human/undead/TH.jpg";
import cr_hu_vs_ud_8 from "@/assets/creeproutes/human/undead/ST.jpg";
import cr_hu_vs_ud_9 from "@/assets/creeproutes/human/undead/LT.jpg";

import cr_hu_vs_r_1 from "@/assets/creeproutes/human/random/AL.jpg";
import cr_hu_vs_r_2 from "@/assets/creeproutes/human/random/CH.jpg";
import cr_hu_vs_r_3 from "@/assets/creeproutes/human/random/HF.jpg";
import cr_hu_vs_r_4 from "@/assets/creeproutes/human/random/LR.jpg";
import cr_hu_vs_r_5 from "@/assets/creeproutes/human/random/NiS.jpg";
import cr_hu_vs_r_6 from "@/assets/creeproutes/human/random/SG.jpg";
import cr_hu_vs_r_7 from "@/assets/creeproutes/human/random/TH.jpg";
import cr_hu_vs_r_8 from "@/assets/creeproutes/human/random/ST.jpg";
import cr_hu_vs_r_9 from "@/assets/creeproutes/human/random/LT.jpg";

// Undead
import cr_ud_vs_hu_1 from "@/assets/creeproutes/undead/human/AL.jpg";
import cr_ud_vs_hu_2 from "@/assets/creeproutes/undead/human/CH.jpg";
import cr_ud_vs_hu_3 from "@/assets/creeproutes/undead/human/HF.jpg";
import cr_ud_vs_hu_4 from "@/assets/creeproutes/undead/human/LR.jpg";
import cr_ud_vs_hu_5 from "@/assets/creeproutes/undead/human/NiS.jpg";
import cr_ud_vs_hu_6 from "@/assets/creeproutes/undead/human/SG.jpg";
import cr_ud_vs_hu_7 from "@/assets/creeproutes/undead/human/TH.jpg";
import cr_ud_vs_hu_8 from "@/assets/creeproutes/undead/human/ST.jpg";
import cr_ud_vs_hu_9 from "@/assets/creeproutes/undead/human/LT.jpg";

import cr_ud_vs_ne_1 from "@/assets/creeproutes/undead/nightelf/AL.jpg";
import cr_ud_vs_ne_2 from "@/assets/creeproutes/undead/nightelf/CH.jpg";
import cr_ud_vs_ne_3 from "@/assets/creeproutes/undead/nightelf/HF.jpg";
import cr_ud_vs_ne_4 from "@/assets/creeproutes/undead/nightelf/LR.jpg";
import cr_ud_vs_ne_5 from "@/assets/creeproutes/undead/nightelf/NiS.jpg";
import cr_ud_vs_ne_6 from "@/assets/creeproutes/undead/nightelf/SG.jpg";
import cr_ud_vs_ne_7 from "@/assets/creeproutes/undead/nightelf/TH.jpg";
import cr_ud_vs_ne_8 from "@/assets/creeproutes/undead/nightelf/ST.jpg";

import cr_ud_vs_oc_1 from "@/assets/creeproutes/undead/orc/AL.jpg";
import cr_ud_vs_oc_2 from "@/assets/creeproutes/undead/orc/CH.jpg";
import cr_ud_vs_oc_3 from "@/assets/creeproutes/undead/orc/HF.jpg";
import cr_ud_vs_oc_4 from "@/assets/creeproutes/undead/orc/LR.jpg";
import cr_ud_vs_oc_5 from "@/assets/creeproutes/undead/orc/NiS.jpg";
import cr_ud_vs_oc_6 from "@/assets/creeproutes/undead/orc/SG.jpg";
import cr_ud_vs_oc_7 from "@/assets/creeproutes/undead/orc/TH.jpg";
import cr_ud_vs_oc_8 from "@/assets/creeproutes/undead/orc/ST.jpg";
import cr_ud_vs_oc_9 from "@/assets/creeproutes/undead/orc/LT.jpg";

import cr_ud_vs_ud_1 from "@/assets/creeproutes/undead/undead/AL.jpg";
import cr_ud_vs_ud_2 from "@/assets/creeproutes/undead/undead/CH.jpg";
import cr_ud_vs_ud_3 from "@/assets/creeproutes/undead/undead/HF.jpg";
import cr_ud_vs_ud_4 from "@/assets/creeproutes/undead/undead/LR.jpg";
import cr_ud_vs_ud_5 from "@/assets/creeproutes/undead/undead/NiS.jpg";
import cr_ud_vs_ud_6 from "@/assets/creeproutes/undead/undead/SG.jpg";
import cr_ud_vs_ud_7 from "@/assets/creeproutes/undead/undead/TH.jpg";
import cr_ud_vs_ud_8 from "@/assets/creeproutes/undead/undead/ST.jpg";
import cr_ud_vs_ud_9 from "@/assets/creeproutes/undead/undead/LT.jpg";

import cr_ud_vs_r_1 from "@/assets/creeproutes/undead/random/AL.jpg";
import cr_ud_vs_r_2 from "@/assets/creeproutes/undead/random/CH.jpg";
import cr_ud_vs_r_3 from "@/assets/creeproutes/undead/random/HF.jpg";
import cr_ud_vs_r_4 from "@/assets/creeproutes/undead/random/LR.jpg";
import cr_ud_vs_r_5 from "@/assets/creeproutes/undead/random/NiS.jpg";
import cr_ud_vs_r_6 from "@/assets/creeproutes/undead/random/SG.jpg";
import cr_ud_vs_r_7 from "@/assets/creeproutes/undead/random/TH.jpg";
import cr_ud_vs_r_8 from "@/assets/creeproutes/undead/random/ST.jpg";
import cr_ud_vs_r_9 from "@/assets/creeproutes/undead/random/LT.jpg";

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
      "Lost Temple LV": { img: cr_hu_vs_r_9, games: [] },
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
      Springtime: { img: cr_hu_vs_hu_8, games: ["66e58c470ebc9196a2b19213"] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": {
        img: cr_hu_vs_hu_9,
        games: [
          "66d071d40ebc9196a25eac04",
          "66cc79510ebc9196a2651c0e",
          "66cd72580ebc9196a2a6ce5d",
        ],
      },
      Tidehunters: { img: cr_hu_vs_hu_7, games: [] },
      "Twisted Meadows": {
        img: cr_hu_vs_hu_10,
        games: [
          "66e2edbf0ebc9196a2085301",
          "66cc6fcd0ebc9196a26200f2",
          "66cb2dd70ebc9196a209063e",
        ],
      },
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
      Springtime: {
        img: cr_hu_vs_oc_8,
        games: ["66c4e2820ebc9196a2a0b5f1", "66b740930ebc9196a27fb261"],
      },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": {
        img: cr_hu_vs_oc_9,
        games: [
          "669bc76a82a9ebbac5943a02",
          "667c08cd82a9ebbac5b513ab",
          "66a8cd0682a9ebbac58df2c7",
        ],
      },
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
      Springtime: {
        img: cr_hu_vs_ne_8,
        games: [
          "66e5bf5e0ebc9196a2c353d6",
          "66cc7e1d0ebc9196a266a3e3",
          "66e042810ebc9196a25fc9b0",
        ],
      },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": {
        img: cr_hu_vs_ne_9,
        games: ["66a35ba182a9ebbac547e377"],
      },
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
      Springtime: { img: cr_hu_vs_ud_8, games: ["66d85de90ebc9196a23fe29d"] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": {
        img: cr_hu_vs_ud_9,
        games: [
          "66d1b2a40ebc9196a2a75214",
          "66e2db8a0ebc9196a2034d84",
          "66e532b70ebc9196a2987c13",
        ],
      },
      Tidehunters: { img: cr_hu_vs_ud_7, games: [] },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
  },

  [Race.Undead]: {
    [Race.Random]: {
      "Autumn Leaves v2": { img: cr_ud_vs_r_1, games: [] },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": { img: cr_ud_vs_r_2, games: [] },
      Hammerfall: { img: cr_ud_vs_r_3, games: [] },
      "Last Refuge": { img: cr_ud_vs_r_4, games: [] },
      "Northern Isles": { img: cr_ud_vs_r_5, games: [] },
      "Shallow Grave": { img: cr_ud_vs_r_6, games: [] },
      Springtime: { img: cr_ud_vs_r_8, games: [] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": { img: cr_ud_vs_r_9, games: [] },
      Tidehunters: { img: cr_ud_vs_r_7, games: [] },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.Human]: {
      "Autumn Leaves v2": {
        img: cr_ud_vs_hu_1,
        games: [
          "66b39a1e0ebc9196a2c1b02f",
          "66c088a10ebc9196a29969df",
          "66aa031b82a9ebbac5ce574a",
        ],
      },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": {
        img: cr_ud_vs_hu_2,
        games: [
          "66a8ab0f82a9ebbac5877d5f",
          "66c4ad930ebc9196a2915e59",
          "669a92d582a9ebbac54d58a1",
        ],
      },
      Hammerfall: {
        img: cr_ud_vs_hu_3,
        games: [
          "66a0d01b82a9ebbac5b81cf8",
          "66b0e3a50ebc9196a234b5ce",
          "668fa86c82a9ebbac5d6c1a2",
        ],
      },
      "Last Refuge": {
        img: cr_ud_vs_hu_4,
        games: [
          "66b39e9b0ebc9196a2c2d22c",
          "66b372f80ebc9196a2b7208b",
          "66b370590ebc9196a2b669e3",
        ],
      },
      "Northern Isles": {
        img: cr_ud_vs_hu_5,
        games: [
          "66ade96482a9ebbac5a67f6e",
          "66adf00282a9ebbac5a804a5",
          "66b9f38b0ebc9196a219e84b",
        ],
      },
      "Shallow Grave": {
        img: cr_ud_vs_hu_6,
        games: [
          "66aa14be82a9ebbac5d1e9ab",
          "66b0da960ebc9196a23255dd",
          "66bccb9c0ebc9196a2c00b01",
        ],
      },
      Springtime: {
        img: cr_ud_vs_hu_8,
        games: ["66bb70ba0ebc9196a26fab32", "66b7383c0ebc9196a27dade8"],
      },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": {
        img: cr_ud_vs_hu_9,
        games: [
          "66bcc47a0ebc9196a2bde9d8",
          "66bcc73a0ebc9196a2beb5c0",
          "66c0719d0ebc9196a2938c1c",
        ],
      },
      Tidehunters: {
        img: cr_ud_vs_hu_7,
        games: [
          "66b0e4df0ebc9196a2350518",
          "66b0e08e0ebc9196a233e905",
          "66b379b90ebc9196a2b8e755",
        ],
      },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.Orc]: {
      "Autumn Leaves v2": {
        img: cr_ud_vs_oc_1,
        games: [
          "66a8d65e82a9ebbac590007c",
          "66a9ff2582a9ebbac5cd89f2",
          "6693ab1082a9ebbac5bf574c",
        ],
      },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": {
        img: cr_ud_vs_oc_2,
        games: [
          "66aa232d82a9ebbac5d50ae9",
          "66b385d10ebc9196a2bc53f7",
          "66a8db9682a9ebbac5913b87",
        ],
      },
      Hammerfall: {
        img: cr_ud_vs_oc_3,
        games: [
          "66a8ccb182a9ebbac58ddf10",
          "66a90af582a9ebbac59d44da",
          "66bcc31d0ebc9196a2bd93ac",
        ],
      },
      "Last Refuge": {
        img: cr_ud_vs_oc_4,
        games: [
          "66aa207982a9ebbac5d46f37",
          "66c08b740ebc9196a29a31d1",
          "668f9e4c82a9ebbac5d4bf95",
        ],
      },
      "Northern Isles": {
        img: cr_ud_vs_oc_5,
        games: [
          "66b9ed000ebc9196a21869c3",
          "66bb8dd80ebc9196a27888d6",
          "66bc7add0ebc9196a2ab50e7",
        ],
      },
      "Shallow Grave": {
        img: cr_ud_vs_oc_6,
        games: [
          "66aa4dbc82a9ebbac5dfcfa9",
          "66acb2e382a9ebbac5605dff",
          "66bcbc410ebc9196a2bb9a2b",
        ],
      },
      Springtime: {
        img: cr_ud_vs_oc_8,
        games: [
          "66abbadc82a9ebbac52fd60f",
          "66acb5f882a9ebbac56109de",
          "66acf5de82a9ebbac57121cb",
        ],
      },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": {
        img: cr_ud_vs_oc_9,
        games: [
          "66a90fcd82a9ebbac59e99d7",
          "66c06ee30ebc9196a292d502",
          "668ea0fc82a9ebbac5a49dc0",
        ],
      },
      Tidehunters: {
        img: cr_ud_vs_oc_7,
        games: [
          "66b9fff60ebc9196a21c8cef",
          "66b74f0e0ebc9196a2831c84",
          "66b641130ebc9196a24c8fa7",
        ],
      },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.NightElf]: {
      "Autumn Leaves v2": {
        img: cr_ud_vs_ne_1,
        games: [
          "66a8be8e82a9ebbac58b0384",
          "66b0e86b0ebc9196a235fc33",
          "66b38ad90ebc9196a2bd9c3c",
        ],
      },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": {
        img: cr_ud_vs_ne_2,
        games: [
          "66a0bf5c82a9ebbac5b452ad",
          "66a91f1782a9ebbac5a2c7cc",
          "669a903c82a9ebbac54c8e12",
        ],
      },
      Hammerfall: {
        img: cr_ud_vs_ne_3,
        games: [
          "66b38dce0ebc9196a2be6f8b",
          "66b395dd0ebc9196a2c09160",
          "66b4967c0ebc9196a2f29108",
        ],
      },
      "Last Refuge": {
        img: cr_ud_vs_ne_4,
        games: [
          "66b0ecce0ebc9196a2371f75",
          "66b37e0d0ebc9196a2ba20e4",
          "66b392e50ebc9196a2bfcd97",
        ],
      },
      "Northern Isles": {
        img: cr_ud_vs_ne_5,
        games: [
          "66b5e3560ebc9196a236cd80",
          "66b33ed80ebc9196a2ab7358",
          "66b633e70ebc9196a2490fdd",
        ],
      },
      "Shallow Grave": {
        img: cr_ud_vs_ne_6,
        games: [
          "66a8f64782a9ebbac597bfb5",
          "66a923a782a9ebbac5a40466",
          "66b0eaee0ebc9196a236a609",
        ],
      },
      Springtime: { img: cr_ud_vs_ne_8, games: [] },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": { img: cr_missing, games: [] },
      Tidehunters: {
        img: cr_ud_vs_ne_7,
        games: [
          "66ad0f0782a9ebbac578114e",
          "66b33b930ebc9196a2aad8f3",
          "66b36f070ebc9196a2b61523",
        ],
      },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
    [Race.Undead]: {
      "Autumn Leaves v2": {
        img: cr_ud_vs_ud_1,
        games: [
          "66b387db0ebc9196a2bccdf0",
          "66c4a95a0ebc9196a28ffcfa",
          "66c069650ebc9196a2917054",
        ],
      },
      "Echo Isles v2": { img: cr_missing, games: [] },
      "Gloom Stalker": { img: cr_missing, games: [] },
      "Concealed Hill": {
        img: cr_ud_vs_ud_2,
        games: [
          "66b48d840ebc9196a2f0c283",
          "66c08d520ebc9196a29ac1d2",
          "668e8f8182a9ebbac5a05e2b",
        ],
      },
      Hammerfall: { img: cr_ud_vs_ud_3, games: ["6682c34782a9ebbac537e68c"] },
      "Last Refuge": {
        img: cr_ud_vs_ud_4,
        games: ["66b491390ebc9196a2f187b7", "66c494240ebc9196a289b5f8"],
      },
      "Northern Isles": {
        img: cr_ud_vs_ud_5,
        games: [
          "66abbccc82a9ebbac53047c7",
          "66b361600ebc9196a2b2bf6d",
          "66a51c7182a9ebbac5b75d9c",
        ],
      },
      "Shallow Grave": {
        img: cr_ud_vs_ud_6,
        games: [
          "66a5163982a9ebbac5b56256",
          "66ae1bff82a9ebbac5b2d1f1",
          "66b624120ebc9196a244cd01",
        ],
      },
      Springtime: {
        img: cr_ud_vs_ud_8,
        games: ["66bc99a70ebc9196a2b25dfa", "668ead2782a9ebbac5a79713"],
      },
      "Shattered Exile v2": { img: cr_missing, games: [] },
      "Lost Temple LV": {
        img: cr_ud_vs_ud_9,
        games: ["6682a49f82a9ebbac530112e"],
      },
      Tidehunters: {
        img: cr_ud_vs_ud_7,
        games: [
          "66b36b770ebc9196a2b52115",
          "66abb5ab82a9ebbac52e8392",
          "66ae021582a9ebbac5ac7b4f",
        ],
      },
      "Twisted Meadows": { img: cr_missing, games: [] },
    },
  },
};
