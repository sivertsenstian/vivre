<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";
import { useGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";
import ActivityTable from "@/components/ActivityTable.vue";
import GNLPlayerBanner from "@/components/gnl/GNLPLayerBanner.vue";
import GNLCoachBanner from "@/components/gnl/GNLCoachBanner.vue";
import _isEmpty from "lodash/isEmpty";
import { Bar } from "vue-chartjs";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const season = 15;
const store = useGNLStore();

store.initialize(
  [
    {
      battleTag: "SaulApeMan#2163",
      race: Race.Random,
      races: [Race.Human, Race.Undead, Race.Orc, Race.NightElf],
      roles: ["Caster", "Coach", "Ape"],
    },
    {
      battleTag: "KaGeMaN#1160",
      race: Race.Human,
      races: [Race.Human],
      roles: ["Coach"],
    },
  ],
  [
    { battleTag: "Longjacket#2840", race: Race.Human },
    { battleTag: "SneakyTurtle#2326919", race: Race.NightElf },
    { battleTag: "siyanleo#1295", race: Race.Orc },
    { battleTag: "FVB#1736", race: Race.Orc },
    { battleTag: "RaZeR#23389", race: Race.Undead },
    { battleTag: "hengyi#31966", race: Race.Human },
    { battleTag: "Stakr#21386", race: Race.NightElf },
    { battleTag: "jung#31458", race: Race.Human },
    { battleTag: "Lonestar#1441", race: Race.Orc },
    { battleTag: "K0rbinian#21728", race: Race.Human },
    { battleTag: "sd1528681#2302", race: Race.NightElf },
    { battleTag: "ET3#31514", race: Race.Human },
    { battleTag: "vscan#3284", race: Race.Orc },
  ],
);

const points = computed(() => {
  return store.players.map((p) => {
    const d = store.data[p.battleTag].season[p.race];
    return { battleTag: p.battleTag, points: d.wins * 3 + d.loss };
  });
});

const players = computed(() => {
  return store.players
    .map((p) => {
      const d = store.data[p.battleTag].season[p.race];
      return { battleTag: p.battleTag, points: d.wins * 3 + d.loss };
    })
    .sort((a, b) => b.points - a.points)
    .map((p) => {
      return store.players.find((x) => x.battleTag === p.battleTag);
    });
});

const matches = computed(() =>
  store.players
    .map((p) => store.data[p.battleTag].season[p.race].matches)
    .reduce((s, m) => [...s, ...m], []),
);

// Chart stuff
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  LineController,
} from "chart.js";
import "chartjs-adapter-moment";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  ChartDataLabels,
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      type: "category",
    },
  },
} as any;
// End
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-skeleton-loader v-if="_isEmpty(store.data)"></v-skeleton-loader>
      <v-sheet v-else class="pa-12" elevation="10" style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-h2">GNL Season {{ store.season }}</div>
            <hr />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-row>
              <v-col cols="12">
                <div class="text-h5">
                  Team Points:
                  <span class="font-weight-bold" style="color: goldenrod">
                    <span style="vertical-align: middle">{{
                      points.reduce((s, p) => (s += p.points), 0)
                    }}</span>
                    <v-icon
                      size="x-small"
                      class="ml-1"
                      icon="mdi-progress-star-four-points"
                  /></span>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Bar
                  height="400px"
                  :data="{
                    labels: points.map((p) => p.battleTag),
                    datasets: [
                      {
                        label: 'points',
                        backgroundColor: 'goldenrod',
                        borderColor: 'darkgoldenrod',
                        borderWidth: 0,
                        data: points.map((p) => p.points),
                        datalabels: {
                          clip: false,
                          clamp: false,
                          anchor: 'end',
                          align: 'end',
                          offset: 0,
                          color: 'goldenrod',
                        },
                      },
                    ],
                  }"
                  :options="options" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <div class="text-h5">Team Ladder Activity</div>
            <ActivityTable :matches="matches" :dark="isDark" />
          </v-col>
        </v-row>

        <v-row>
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Coaches</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3" v-for="coach in store.coaches">
            <GNLCoachBanner
              :data="store.data[coach.battleTag].season[coach.race]"
              :battle-tag="coach.battleTag"
              :race="coach.race"
              :races="coach.races"
              :roles="coach.roles"
              :current="
                store.data[coach.battleTag].season[coach.race].mmr.current
              "
              :label="coach.battleTag" />
          </v-col>
        </v-row>
        <v-row>
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Players</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3" v-for="(player, rank) in players">
            <GNLPlayerBanner
              :rank="rank"
              :data="store.data[player.battleTag].season[player.race]"
              :battle-tag="player.battleTag"
              :race="player.race"
              :current="
                store.data[player.battleTag].season[player.race].mmr.current
              "
              :label="player.battleTag" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
