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
      "Autumn Leaves v2": cr_hu_vs_r_1,
      "Echo Isles v2": cr_missing,
      "Gloom Stalker": cr_missing,
      "Concealed Hill": cr_hu_vs_r_2,
      Hammerfall: cr_hu_vs_r_3,
      "Last Refuge": cr_hu_vs_r_4,
      "Northern Isles": cr_hu_vs_r_5,
      "Shallow Grave": cr_hu_vs_r_6,
      Springtime: cr_hu_vs_r_8,
      "Rune Maul": cr_missing,
      "Shattered Exile v2": cr_missing,
      "Terenas Stand LV": cr_missing,
      Tidehunters: cr_hu_vs_r_7,
      "Twisted Meadows": cr_missing,
    },
    [Race.Human]: {
      "Autumn Leaves v2": cr_hu_vs_hu_1,
      "Echo Isles v2": cr_missing,
      "Gloom Stalker": cr_missing,
      "Concealed Hill": cr_hu_vs_hu_2,
      Hammerfall: cr_hu_vs_hu_3,
      "Last Refuge": cr_hu_vs_hu_4,
      "Northern Isles": cr_hu_vs_hu_5,
      "Shallow Grave": cr_hu_vs_hu_6,
      Springtime: cr_hu_vs_hu_8,
      "Rune Maul": cr_missing,
      "Shattered Exile v2": cr_missing,
      "Terenas Stand LV": cr_missing,
      Tidehunters: cr_hu_vs_hu_7,
      "Twisted Meadows": cr_missing,
    },
    [Race.Orc]: {
      "Autumn Leaves v2": cr_hu_vs_oc_1,
      "Echo Isles v2": cr_missing,
      "Gloom Stalker": cr_missing,
      "Concealed Hill": cr_hu_vs_oc_2,
      Hammerfall: cr_hu_vs_oc_3,
      "Last Refuge": cr_hu_vs_oc_4,
      "Northern Isles": cr_hu_vs_oc_5,
      "Shallow Grave": cr_hu_vs_oc_6,
      Springtime: cr_hu_vs_oc_8,
      "Rune Maul": cr_missing,
      "Shattered Exile v2": cr_missing,
      "Terenas Stand LV": cr_missing,
      Tidehunters: cr_hu_vs_oc_7,
      "Twisted Meadows": cr_missing,
    },
    [Race.NightElf]: {
      "Autumn Leaves v2": cr_hu_vs_ne_1,
      "Echo Isles v2": cr_missing,
      "Gloom Stalker": cr_missing,
      "Concealed Hill": cr_hu_vs_ne_2,
      Hammerfall: cr_hu_vs_ne_3,
      "Last Refuge": cr_hu_vs_ne_4,
      "Northern Isles": cr_hu_vs_ne_5,
      "Shallow Grave": cr_hu_vs_ne_6,
      Springtime: cr_hu_vs_ne_8,
      "Rune Maul": cr_missing,
      "Shattered Exile v2": cr_missing,
      "Terenas Stand LV": cr_missing,
      Tidehunters: cr_hu_vs_ne_7,
      "Twisted Meadows": cr_missing,
    },
    [Race.Undead]: {
      "Autumn Leaves v2": cr_hu_vs_ud_1,
      "Echo Isles v2": cr_missing,
      "Gloom Stalker": cr_missing,
      "Concealed Hill": cr_hu_vs_ud_2,
      Hammerfall: cr_hu_vs_ud_3,
      "Last Refuge": cr_hu_vs_ud_4,
      "Northern Isles": cr_hu_vs_ud_5,
      "Shallow Grave": cr_hu_vs_ud_6,
      Springtime: cr_missing,
      "Rune Maul": cr_missing,
      "Shattered Exile v2": cr_missing,
      "Terenas Stand LV": cr_missing,
      Tidehunters: cr_hu_vs_ud_7,
      "Twisted Meadows": cr_missing,
    },
  },
};
