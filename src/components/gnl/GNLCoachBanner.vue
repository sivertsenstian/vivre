<script setup lang="ts">
import _sample from "lodash/sample";

import { raceIcon } from "@/stores/races";
import gnl_coach_saulapeman from "@assets/gnl/coaches/saulapeman.jpg";
import gnl_coach_barren from "@assets/gnl/coaches/barren.jpg";
import gnl_coach_spycreed from "@assets/gnl/coaches/spycreed.jpg";
import gnl_coach_jabba from "@assets/gnl/coaches/jabba.jpg";
import gnl_coach_northdrakkar from "@assets/gnl/coaches/northdrakkar.jpg";
import gnl_coach_slayday from "@assets/gnl/coaches/slayday.jpg";
import gnl_coach_dark from "@assets/gnl/coaches/chelsea.png";
import gnl_coach_ikbencool from "@assets/gnl/coaches/ikbencool.png";

import gnl_coach_eashibby from "@assets/gnl/coaches/eashibby.jpg";
import gnl_coach_oldgreg from "@assets/gnl/coaches/oldgreg.jpg";
import gnl_coach_quadgfan from "@assets/gnl/coaches/quadgfan.jpg";
import gnl_coach_RaZeR from "@assets/gnl/coaches/RaZeR.jpg";
import gnl_coach_sharky from "@assets/gnl/coaches/Sharky_Profile.jpg";
import gnl_coach_Thaedalius from "@assets/gnl/coaches/Thaedalius.png";
import gnl_coach_Anar from "@assets/gnl/coaches/Anar.jpg";
import gnl_coach_Carson from "@assets/gnl/coaches/carsoNNN.png";
import gnl_coach_Echo from "@assets/gnl/coaches/EchoGoodman.jpg";
import gnl_coach_ves from "@assets/gnl/coaches/veS.jpg";
import gnl_coach_kage from "@assets/gnl/coaches/KaGeMaN.jpg";
import gnl_coach_fatts from "@assets/gnl/coaches/fatts.jpg";

import gnl_coach_missing from "@/assets/creeproutes/missing.png";

import w3cicon from "@/assets/w3c.png";
import w3ciconDark from "@/assets/w3c_dark.png";

const coachGnlBanner: any = {
  ["React#21633"]: gnl_coach_barren,
  ["SaulApeMan#2163"]: gnl_coach_saulapeman,
  ["jolin#31419"]: gnl_coach_jabba,
  ["spycreed#2536"]: gnl_coach_spycreed,
  ["NorthDrakkar#1745"]: gnl_coach_northdrakkar,
  ["Slayday#11794"]: gnl_coach_slayday,
  ["ChelseaFC#21447"]: gnl_coach_dark,
  ["ikbencool#2603"]: gnl_coach_ikbencool,

  ["EAShibby#2644"]: gnl_coach_eashibby,
  ["OldGreg#11862"]: gnl_coach_oldgreg,
  ["quadgfan#1418"]: gnl_coach_quadgfan,
  ["RaZeR#23389"]: gnl_coach_RaZeR,
  ["RobotNinja#2136641"]: gnl_coach_sharky,
  ["Thaedalius#1362"]: gnl_coach_Thaedalius,
  ["Anár#1939"]: gnl_coach_Anar,
  ["carsoNNN#1657"]: gnl_coach_Carson,
  ["EchoGoodman#2734"]: gnl_coach_Echo,
  ["veS#1614"]: gnl_coach_ves,
  ["KaGeMaN#1160"]: gnl_coach_kage,
  ["MangoIsNice#1230"]: gnl_coach_fatts,
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
          >{{ coach.battleTag.split("#")[0] }}
        </div>
      </template>
    </v-list-item>

    <v-img
      class="rounded portrait"
      height="250"
      :src="coachGnlBanner?.[coach.battleTag] ?? gnl_coach_missing"
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
          class="text-subtitle-2 text-wrap"
          style="opacity: 0.7; font-size: 12px !important; height: 35px"
          >{{ coach.quotes?.length ? _sample(coach.quotes) : "" }}</i
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
