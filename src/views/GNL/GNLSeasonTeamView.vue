<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, onMounted, ref } from "vue";
import { teamGnlBanner, useGNLStore } from "@/stores/gnl";
import ActivityTable from "@/components/ActivityTable.vue";
import GNLPlayerBanner from "@/components/gnl/GNLPlayerBanner.vue";
import GNLCoachBanner from "@/components/gnl/GNLCoachBanner.vue";
import _isEmpty from "lodash/isEmpty";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const route = useRoute();
const router = useRouter();

const store = useGNLStore();

store.current = String(route.params.team).toLowerCase();

const current = computed(
  () => store.data.teams?.find((t: any) => t.id === store.current) ?? {},
);

onBeforeRouteLeave(() => {
  store.current = undefined;
});

const points = computed(() => {
  try {
    return current.value.players.map((p: IGNLAccount) => {
      const d = p.data ?? {};
      return {
        battleTag: p.battleTag,
        points: (d.wins ?? 0) * 3 + (d.loss ?? 0),
      };
    });
  } catch {
    return [];
  }
});

const teamPoints = computed(() => {
  return points.value.reduce((s: number, p: any) => (s += p?.points ?? 0), 0);
});

const players = computed(() => {
  try {
    return current.value.players
      .map((p: IGNLAccount) => {
        const d = p.data ?? {};
        return { battleTag: p.battleTag, points: d.wins * 3 + d.loss, data: d };
      })
      .sort(
        (a: IGNLAccount, b: IGNLAccount) => (b.points ?? 0) - (a.points ?? 0),
      )
      .map((p: IGNLAccount) => {
        return current.value.players.find(
          (x: IGNLAccount) => x.battleTag === p.battleTag,
        );
      });
  } catch {
    return [];
  }
});

const matches = computed(() => {
  try {
    return current.value.players
      .map((p: any) => p.data.matches)
      .reduce((s: any, m: any) => [...s, ...m], []);
  } catch {
    return [];
  }
});

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
import type { IGNLAccount } from "@/utilities/types";

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
      display: false,
    },
    y: {
      grid: { display: false },
      suggestedMax: 800,
    },
  },
} as any;
// End

onMounted(() => {
  store.initialize();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-sheet
        class="pa-12"
        elevation="10"
        style="min-height: 90vh"
        transition="fade-transition"
        v-if="_isEmpty(current)">
        <v-row>
          <v-col cols="12" class="text-center">
            <div class="text-h2">GNL Season {{ store.data?.season }}</div>
            <v-progress-linear indeterminate />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-skeleton-loader type="table"></v-skeleton-loader>
          </v-col>
          <v-col cols="4">
            <v-skeleton-loader type="table"></v-skeleton-loader>
          </v-col>
          <v-col cols="4"
            ><v-skeleton-loader type="table"></v-skeleton-loader
          ></v-col>
        </v-row>
        <v-row>
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Coaches</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3"> <v-skeleton-loader type="card" /> </v-col>
          <v-col cols="3"> <v-skeleton-loader type="card" /> </v-col>
        </v-row>
        <v-row>
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Players</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3"> <v-skeleton-loader type="card" /> </v-col>
          <v-col cols="3"> <v-skeleton-loader type="card" /> </v-col>
          <v-col cols="3"> <v-skeleton-loader type="card" /> </v-col>
          <v-col cols="3"> <v-skeleton-loader type="card" /> </v-col>
        </v-row>
      </v-sheet>

      <v-sheet
        class="pa-md-12 pa-3"
        elevation="10"
        style="min-height: 90vh"
        transition="fade-transition"
        v-else>
        <v-btn
          prepend-icon="mdi-arrow-left"
          color="secondary"
          variant="text"
          @click="() => router.push('/gnl')"
          >Go Back</v-btn
        >

        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-md-h2 text-h5">
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">{{ current?.name }}</span>
            </div>
            <hr />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-img
                height="380"
                :src="teamGnlBanner(current.id)"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                cover>
                <v-card-title
                  class="text-white"
                  v-text="current.name"></v-card-title>
              </v-img>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12">
                <div class="text-h5">
                  Team Points:
                  <span class="font-weight-bold" style="color: goldenrod">
                    <span style="vertical-align: middle">{{ teamPoints }}</span>
                    <v-icon size="x-small" class="ml-1" icon="mdi-medal"
                  /></span>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <Bar
                  height="315px"
                  style="overflow: visible"
                  :data="{
                    labels: points
                      .filter((p: IGNLAccount) => (p.points ?? 0) > 0)
                      .map((p: IGNLAccount) => p.battleTag.split('#')[0]),
                    datasets: [
                      {
                        label: 'points',
                        backgroundColor: 'rgba(218, 165, 32, 0.3)',
                        borderColor: 'goldenrod',
                        borderWidth: 2,
                        barPercentage: 0.8,
                        data: points
                          .filter((p: IGNLAccount) => (p.points ?? 0) > 0)
                          .map((p: IGNLAccount) => p.points),
                        datalabels: {
                          clip: true,
                          clamp: true,
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
          <v-col cols="12" md="4">
            <div class="text-h5">Team Ladder Activity</div>
            <ActivityTable :matches="matches" :dark="isDark" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-divider />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4" offset-md="4" class="text-center">
            <div class="text-h4">Coaches</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="3" v-for="coach in current.coaches">
            <GNLCoachBanner :prefix="current.prefix" :coach="coach" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" offset-md="4" class="text-center">
            <div class="text-h4">Players</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="3" v-for="(player, rank) in players" :key="rank">
            <GNLPlayerBanner
              :dates="store.dates"
              :rank="rank"
              :team-points="teamPoints"
              :prefix="current.prefix"
              :player="player" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
