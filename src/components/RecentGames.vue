<script setup lang="ts">
import _take from "lodash/take";
import { iswin } from "@/utilities/matchcalculator";
import { raceIcon } from "@/stores/races";
import moment from "moment/moment";

const open = (path: string) => window.open(path, "_blank");

interface Props {
  matches: any[];
  accounts: string[];
}

defineProps<Props>();
</script>

<template>
  <v-card elevation="0">
    <v-list-item v-for="game in matches">
      <v-list-item-title class="ml-2" v-if="iswin(game, ...accounts)">
        <span class="mr-5 text-subtitle-2">
          {{ moment(game.endTime).fromNow() }}:</span
        >
        <img
          style="vertical-align: middle"
          width="30px"
          :src="raceIcon[game.teams[0].players[0].race]"
        />
        <a
          class="text-green-lighten-1"
          :href="`https://www.w3champions.com/player/${encodeURIComponent(
            game.teams[0].players[0].battleTag,
          )}`"
          target="_blank"
        >
          <strong>
            {{ game.teams[0].players[0].name }}
          </strong>
        </a>

        vs.

        <img
          style="vertical-align: middle"
          width="30px"
          :src="raceIcon[game.teams[1].players[0].race]"
        />
        <a
          class="text-red-lighten-1"
          :href="`https://www.w3champions.com/player/${encodeURIComponent(
            game.teams[1].players[0].battleTag,
          )}`"
          target="_blank"
        >
          <strong>
            {{ game.teams[1].players[0].name }}
          </strong>
        </a>

        <span class="text-green">
          +{{ Math.ceil(game.teams[0].players[0].mmrGain) }} MMR {{
        }}</span>
        <v-btn
          @click="() => open(`https://www.w3champions.com/match/${game.id}`)"
          title="go to match"
          size="x-small"
          color="orange"
          icon="mdi-link"
          variant="text"
        />
      </v-list-item-title>
      <v-list-item-title class="ml-2" v-else>
        <span class="mr-5"> {{ moment(game.endTime).fromNow() }}:</span>
        <img
          style="vertical-align: middle"
          width="30px"
          :src="raceIcon[game.teams[1].players[0].race]"
        />
        <a
          class="text-red-lighten-1"
          :href="`https://www.w3champions.com/player/${encodeURIComponent(
            game.teams[1].players[0].battleTag,
          )}`"
          target="_blank"
        >
          <strong>
            {{ game.teams[1].players[0].name }}
          </strong>
        </a>

        vs.

        <img
          style="vertical-align: middle"
          width="30px"
          :src="raceIcon[game.teams[0].players[0].race]"
        />
        <a
          class="text-green-lighten-1"
          :href="`https://www.w3champions.com/player/${encodeURIComponent(
            game.teams[0].players[0].battleTag,
          )}`"
          target="_blank"
        >
          <strong>
            {{ game.teams[0].players[0].name }}
          </strong>
        </a>

        <span class="text-red ml-2">
          {{ Math.ceil(game.teams[1].players[0].mmrGain) }}
          MMR {{
        }}</span>
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

<style scoped></style>
