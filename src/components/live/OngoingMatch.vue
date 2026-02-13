<script setup lang="ts">
import type { IOngoing } from "@/utilities/types.ts";
import {
  category,
  CreepRouteCategory,
  creeproutes,
  heroIcon,
  Race,
  raceIcon,
} from "@/stores/races.ts";
import MapLink from "@/components/MapLink.vue";
import ResultChart from "@/components/ResultChart.vue";
import { ref } from "vue";
import moment from "moment/moment";
import _isNil from "lodash/isNil";
import PlayerW3cLink from "@/components/PlayerW3cLink.vue";

interface Props {
  game?: IOngoing;
}
const props = defineProps<Props>();

let ongoing_game_duration = ref(
  moment.utc(moment().diff(props.game?.start)).format("mm:ss"),
);
setInterval(() => {
  ongoing_game_duration.value = moment
    .utc(moment().diff(props.game?.start))
    .format("mm:ss");
}, 1000);

const getRoute = (
  race: Race,
  category: CreepRouteCategory,
  opponent: Race,
  map: string,
) => {
  const r = creeproutes[race]?.[category]?.[opponent]?.[map];
  if (_isNil(r?.img) || r?.img.includes("missing")) {
    return (
      creeproutes[race]?.[CreepRouteCategory.Beginner]?.[Race.Random]?.[map] ??
      {}
    );
  }

  return r;
};

const active = ref(true);
</script>

<template>
  <v-btn
    @click="active = true"
    prepend-icon="mdi-antenna"
    variant="plain"
    :disabbled="!game?.active"
    :class="{ elementToFadeInAndOut: game?.active }"
    :title="
      game?.active
        ? 'Currently playing a ladder game - click to see the overlay'
        : 'Not currently in a ladder game'
    "
    :color="game?.active ? 'green' : 'grey'"
    ><span class="font-weight-bold" v-if="game?.active">LIVE</span></v-btn
  >
  <v-dialog v-if="game?.active" v-model="active" scrim="black" height="80%">
    <v-sheet
      class="pa-10"
      :elevation="2"
      style="
        overflow: hidden;
        background: rgba(var(--v-theme-surface), 0.99);
        border: 1px solid silver;
      ">
      <v-row>
        <v-col cols="12" md="8" class="text-center">
          <v-col cols="12">
            <span class="text-h6 font-weight-bold"
              >Currently playing on '<map-link :name="game.map" />' :
              {{ ongoing_game_duration }}</span
            >
          </v-col>
          <v-col cols="12">
            <span class="text-h5" style="vertical-align: text-top">Vs. </span>
            <img
              class="mx-6"
              style="vertical-align: middle"
              width="100px"
              :src="raceIcon[game.opponent.race]" />
            <span class="text-h5" style="vertical-align: text-top">
              <player-w3c-link :battle-tag="game.opponent?.battleTag" />
              <span class="ml-3 text-grey"
                >({{ game.opponent?.oldMmr }} MMR)</span
              ></span
            >
          </v-col>
          <v-col cols="12" md="10" class="mx-auto">
            <ResultChart :result="game.history" />
          </v-col>

          <v-col cols="12" md="10" class="mx-auto">
            <v-row v-if="game.history.heroes.length">
              <v-col cols="12">
                <div class="text-h5 mb-2">
                  Heroes used by opponent in recent games vs
                  <img
                    style="vertical-align: middle"
                    width="50"
                    :src="raceIcon[game.player.race]" />
                </div>
              </v-col>
            </v-row>
            <v-table>
              <tbody>
                <tr v-for="([heroes, n], i) in game.history.heroes">
                  <td
                    style="width: 10px; font-size: 24px"
                    class="text-left font-weight-bold">
                    {{ i + 1 }}
                  </td>
                  <td class="text-left">
                    <span v-for="hero in heroes?.split(',')" class="mx-1">
                      <img width="40" :src="heroIcon[hero]" :alt="hero" />
                    </span>
                  </td>
                  <td class="text-right font-weight-bold">{{ n }} time(s)</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="d-flex align-center text-center mx-auto"
            v-if="
              game.history.games.winDuration > 0 &&
              game.history.games.lossDuration > 0
            ">
            <v-row>
              <v-col cols="12">
                <section>
                  Avg. duration per win:
                  <span class="font-weight-bold"
                    >{{ game.history.games.winDuration }}
                  </span>
                  minute(s)
                </section>
                <section>
                  Avg. duration per loss:
                  <span class="font-weight-bold">{{
                    game.history.games.lossDuration
                  }}</span>
                  minute(s)
                </section>
                <section class="mt-4">
                  <div
                    v-if="game.history.games.isLamer"
                    class="text-red font-weight-bold text-h5">
                    MIGHT BE A LAMER
                  </div>
                  <div v-else class="text-green font-weight-bold">
                    MOST LIKELY NOT A LAMER
                  </div>
                </section>
              </v-col>
            </v-row>
          </v-col>
        </v-col>

        <v-col cols="12" md="4">
          <v-col
            cols="12"
            :class="{
              'text-right': game.history.last.length,
              'text-center': !game.history.last.length,
            }">
            <div>
              <span
                class="text-caption font-weight-bold"
                v-if="game.history.last.length"
                >Last {{ game.history.last.length }}:
              </span>
              <span class="text-caption font-weight-bold" v-else>
                First Game This Season vs Opponent!
              </span>
              <template v-for="result in game.history.last">
                <v-chip
                  v-if="result"
                  size="x-small"
                  variant="tonal"
                  color="green"
                  label
                  class="rounded-0">
                  <v-icon icon="mdi-shield-crown" />
                </v-chip>
                <v-chip
                  v-else
                  size="x-small"
                  variant="tonal"
                  color="red"
                  label
                  class="rounded-0">
                  <v-icon icon="mdi-shield-crown-outline" />
                </v-chip>
              </template>
            </div>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
            v-if="
              getRoute(
                game.player?.race,
                category,
                game.opponent?.race,
                game.map,
              )?.img
            ">
            <span class="caption">Suggested Creep Route</span>
            <img
              :src="
                getRoute(
                  game.player?.race,
                  category,
                  game.opponent?.race,
                  game.map,
                )?.img
              "
              width="100%" />
          </v-col>
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<style scoped>
.elementToFadeInAndOut {
  -webkit-animation: fadeinout 2s linear infinite;
  animation: fadeinout 2s linear infinite;
  opacity: 0;
}

@-webkit-keyframes fadeinout {
  50% {
    opacity: 1;
  }
}

@keyframes fadeinout {
  50% {
    opacity: 1;
  }
}
</style>
