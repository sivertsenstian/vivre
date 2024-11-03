<script setup lang="ts">
import logo from "@/assets/logo.png";
import { useEscapeStore } from "@/stores/escape";
import RecentGames from "@/components/RecentGames.vue";
import { computed } from "vue";
import _sortBy from "lodash/sortBy";
import moment from "moment";
import _first from "lodash/first";
import WeeklyResultChart from "@/components/WeeklyResultChart.vue";

const escape = useEscapeStore();

const recent = computed(() => {
  return _sortBy(escape.data, (p) =>
    moment(
      _first(_sortBy(p.matches, (m) => moment(m.endTime)).reverse())?.endTime,
    ),
  ).reverse();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet class="pa-6" elevation="10" style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center ma-0 pa-0">
            <img :src="logo" alt="APE SCIENCE - WC3 RESEARCH FACILITY" />
            <div class="text-h5 font-weight-bold">
              THE GREAT LADDER ESCAPE - WHO ARE STILL PLAYING ON W3CHAMPIONS
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4" v-for="(player, i) in recent" class="my-2">
            <v-row>
              <v-col cols="12">
                <h3 class="text-center">
                  <span style="color: goldenrod" class="font-weight-bold mr-2"
                    >#{{ i + 1 }}</span
                  >
                  <span>{{ player.player }}</span>
                </h3>
                <hr />
              </v-col>
              <v-col cols="12">
                <RecentGames
                  :matches="player.matches"
                  :accounts="player.accounts"
                  :limit="1" />
              </v-col>
              <v-col cols="12">
                <WeeklyResultChart :weekly="player.weekly" :goal="100" />
                <h1
                  v-if="player.matches.length > 0 && player.weekly.count === 0"
                  class="text-red font-weight-bold text-center"
                  style="
                    font-size: 75px;
                    position: relative;
                    bottom: 170px;
                    height: 0;
                  ">
                  RIP :(
                </h1>
                <h4 class="text-center text-grey">
                  Match history for the current week
                  <span style="font-size: 12px"
                    >#{{ moment().format("W") }}</span
                  >
                </h4>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
