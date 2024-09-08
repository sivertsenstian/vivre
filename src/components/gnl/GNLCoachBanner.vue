<script setup lang="ts">
import { Race, raceIcon } from "@/stores/races";
import gnl_coach_saulapeman from "@assets/gnl/coaches/saulapeman.jpg";
import gnl_coach_kageman from "@assets/gnl/coaches/kageman.jpg";
import _range from "lodash/range";
import moment from "moment/moment";
import w3cicon from "@/assets/w3c.png";
import w3ciconDark from "@/assets/w3c_dark.png";

const days = moment()
  .startOf("day")
  .diff(moment("01.07.2024", "DD.MM.YYYY").startOf("day"), "days");

const coachGnlBanner = {
  ["KaGeMaN#1160"]: gnl_coach_kageman,
  ["SaulApeMan#2163"]: gnl_coach_saulapeman,
};

import { computed } from "vue";

interface Props {
  race: Race;
  current: number;
  diff?: number;
  label: string;
  highlight?: boolean;
  battleTag: string;
  data: any;
  races: Race[];
  roles: string[];
}
const props = defineProps<Props>();

const open = (battleTag: string) =>
  window.open(
    `https://www.w3champions.com/player/${encodeURIComponent(battleTag)}`,
    "_blank",
  );
</script>

<template>
  <v-card
    class="text-center pa-3 gold"
    color="surface"
    :elevation="10"
    style="border: 1px solid darkgoldenrod">
    <v-list-item class="px-0">
      <template v-slot:prepend>
        <img
          style="vertical-align: middle"
          width="40px"
          :src="raceIcon[race]" />
      </template>
      <template v-slot:title>
        <div class="ml-1 text-left text-h5">
          {{ battleTag }}
        </div>
      </template>
    </v-list-item>

    <v-img
      class="rounded portrait"
      height="250"
      :src="coachGnlBanner[battleTag]"
      cover></v-img>

    <v-card-item>
      <v-card-title class="text-left"
        >Role:
        <v-chip class="ml-1" v-for="role in roles">{{
          role
        }}</v-chip></v-card-title
      >
    </v-card-item>

    <v-divider />

    <v-card-item>
      <v-card-title class="text-left d-flex align-center"
        ><span>Ask me about:</span>
        <img
          :src="raceIcon[race]"
          width="35px"
          class="ml-1"
          v-for="race in races" />
      </v-card-title>
    </v-card-item>

    <v-card-actions>
      <v-btn
        title="Open W3Champions Profile Page"
        color="dark"
        block
        border
        variant="text"
        @click="() => open(battleTag)"
        ><img :src="w3ciconDark" height="22px"
      /></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.gold {
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

.card-shine-effect {
  --shine-deg: 45deg;
  position: relative;
  overflow: hidden;
  border-radius: 0.875rem;
  border: 1px solid rgb(15 23 42);
  background-color: rgb(9 9 11);
  padding: 4rem 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 28rem;

  background-repeat: no-repeat;
  background-position:
    -100% 0,
    0 0;

  background-image: linear-gradient(
    var(--shine-deg),
    transparent 20%,
    transparent 40%,
    rgb(68, 68, 68, 0.2) 50%,
    rgb(68, 68, 68, 0.2) 55%,
    transparent 70%,
    transparent 100%
  );

  background-size:
    250% 250%,
    100% 100%;
  transition: background-position 0s ease;
}

.card-shine-effect:hover {
  background-position:
    200%0,
    0 0;
  transition-duration: 1.5s;
}
</style>
