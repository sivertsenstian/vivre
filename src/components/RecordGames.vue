<script setup lang="ts">
import _take from "lodash/take";
import { iswin } from "@/utilities/matchcalculator";
import { raceIcon } from "@/stores/races";
import moment from "moment/moment";

const open = (path: string) => window.open(path, "_blank");

interface Props {
  matches: any[];
}

defineProps<Props>();
</script>

<template>
  <v-card elevation="0">
    <v-list-item v-for="(game, i) in matches">
      <v-list-item-title class="ml-2">
        <span
          class="text-subitle-2 font-weight-bold"
          style="
            position: relative;
            left: 15.75px;
            bottom: 0.75px;
            z-index: 99999;
            font-size: 14px;
          "
          >{{ i + 1 }}</span
        >
        <v-icon icon="mdi-trophy" style="color: goldenrod" class="mr-3" />
        <span class="mr-1 text-subtitle-2 font-weight-bold">
          {{ moment(game.endTime).format("DD/MM/YYYY HH:mm:ss") }} //</span
        >
        <span
          class="text-subtitle-2 mr-1"
          style="color: white; font-weight: bolder; display: inline-block"
        >
          <span
            class="text-subtitle-1 font-weight-bold"
            style="color: goldenrod"
            >{{ game.teams[0].players[0].currentMmr }}</span
          >
          MMR on</span
        >
        <img
          style="vertical-align: middle"
          width="30px"
          :src="raceIcon[game.teams[0].players[0].race]"
        />
        <a
          class="text-success"
          :href="`https://www.w3champions.com/player/${encodeURIComponent(
            game.teams[0].players[0].battleTag,
          )}`"
          target="_blank"
        >
          <strong>
            {{ game.teams[0].players[0].name }}
          </strong>
        </a>

        <v-btn
          @click="() => open(`https://www.w3champions.com/match/${game.id}`)"
          title="go to match"
          size="x-small"
          color="orange"
          icon="mdi-link"
          variant="text"
        />
      </v-list-item-title>
    </v-list-item>
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
</style>
