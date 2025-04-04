﻿<script setup lang="ts">
import _sample from "lodash/sample";

import { raceIcon } from "@/stores/races";
import gnl_coach_exiled from "@assets/kreisliga/coaches/Exiled_Profile.png";
import gnl_coach_quikeet from "@assets/kreisliga/coaches/Quikeet_Profile.jpg";
import gnl_coach_sparta from "@assets/kreisliga/coaches/sparta.png";
import gnl_coach_sharky from "@assets/kreisliga/coaches/Sharky_Profile.jpg";
import gnl_coach_whitefang from "@assets/kreisliga/coaches/WhiteFang_Profile.png";

import kl_coach_missing from "@/assets/creeproutes/missing.png";

import w3cicon from "@/assets/w3c.png";
import w3ciconDark from "@/assets/w3c_dark.png";

const coachKLBanner: any = {
  ["Quikeet#21349"]: gnl_coach_quikeet,
  ["Exiled#21153"]: gnl_coach_exiled,
  ["sp4rta#21828"]: gnl_coach_sparta,
  ["RobotNinja#2136641"]: gnl_coach_sharky,
  ["WhiteFang28#2496"]: gnl_coach_whitefang,
};

interface Props {
  prefix?: string;
  coach: any;
}
const props = defineProps<Props>();

const open = (battleTag: string) =>
  window.open(
    `https://www.w3champions.com/player/${encodeURIComponent(battleTag)}`,
    "_blank",
  );
</script>

<template>
  <v-card class="text-center pa-3 gold" color="surface" :elevation="10">
    <v-list-item class="px-0">
      <template v-slot:prepend>
        <img
          style="vertical-align: middle"
          width="40px"
          :src="raceIcon[coach.race]" />
      </template>
      <template v-slot:title>
        <div class="ml-1 text-left text-h5">
          <span v-if="prefix" class="mr-1">{{ prefix }}</span
          >{{ coach?.name ?? coach.battleTag.split("#")[0] }}
        </div>
      </template>
    </v-list-item>

    <v-img
      class="rounded portrait"
      height="250"
      :src="coachKLBanner?.[coach.battleTag] ?? kl_coach_missing"
      cover></v-img>

    <v-card-item>
      <v-card-title class="text-left"
        >Role:
        <v-chip class="ml-1" v-for="role in coach.roles">{{
          role
        }}</v-chip></v-card-title
      >
    </v-card-item>

    <v-divider />

    <v-card-item>
      <v-card-title class="text-left d-flex align-center"
        ><span style="vertical-align: middle">Expertise:</span>
        <img
          :src="raceIcon[race]"
          width="30px"
          class="ml-1"
          v-for="race in coach.races" />
      </v-card-title>
    </v-card-item>

    <v-card-item>
      <v-card-title class="d-flex align-center"
        ><i
          v-if="coach.quotes?.length"
          class="text-subtitle-2 text-wrap"
          style="opacity: 0.7; font-size: 12px !important; height: 35px"
          >{{ _sample(coach.quotes) }}</i
        >
      </v-card-title>
    </v-card-item>

    <v-card-actions>
      <v-btn
        title="Open W3Champions Profile Page"
        color="transparent"
        block
        variant="flat"
        @click="() => open(coach.battleTag)"
        ><img :src="w3ciconDark" height="22px"
      /></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.gold {
  border-radius: 0.875rem;
  padding: 4rem 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid darkgoldenrod;

  background: radial-gradient(
      ellipse farthest-corner at right bottom,
      #fedb37 0%,
      #fdb931 8%,
      #9f7928 30%,
      #8a6e2f 40%,
      transparent 80%
    ),
    radial-gradient(
      ellipse farthest-corner at left top,
      #ffffff 0%,
      #ffffac 8%,
      #d1b464 25%,
      #5d4a1f 62.5%,
      #5d4a1f 100%
    );
}

.portrait {
  border-width: 3px;
  border-style: solid;
  border-color: darkgoldenrod;
}
</style>
