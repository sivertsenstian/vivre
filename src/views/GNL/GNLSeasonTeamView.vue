<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, ref } from "vue";
import { teamGnlBanner, useGNLStore } from "@/stores/gnl";
import ActivityTable from "@/components/ActivityTable.vue";
import GNLPlayerBanner from "@/components/gnl/GNLPlayerBanner.vue";
import GNLCoachBanner from "@/components/gnl/GNLCoachBanner.vue";
import _isEmpty from "lodash/isEmpty";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import { doc } from "firebase/firestore";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const route = useRoute();
const router = useRouter();

const store = useGNLStore();

const db = useFirestore();
const { data, promise } = useDocument<any>(
  doc(db, "gnl", "45b5decb-26ec-4a52-a8ec-982d07aecd3d"),
);

const current = ref<any>({});

promise.value.then((data) => {
  const team = data.teams.find(
    (t: any) => t.id.toLowerCase() === String(route.params.team).toLowerCase(),
  );

  if (team) {
    current.value = team;
    store.initialize(data, team);
  }
});

onBeforeRouteUpdate((to) => {
  const team = data.value?.teams.find(
    (t: any) => t.id.toLowerCase() === String(to.params.team).toLowerCase(),
  );

  if (team) {
    current.value = team;
    store.initialize(data, team);
  }
});

onBeforeRouteLeave(() => {
  store.clear();
});

const points = computed(() => {
  try {
    return store.players.map((p) => {
      const d = store.data[p.battleTag].season[p.race];
      return { battleTag: p.battleTag, points: d.wins * 3 + d.loss };
    });
  } catch {
    return [];
  }
});

const teamPoints = computed(() => {
  return points.value.reduce((s, p) => (s += p.points), 0);
});

const players = computed(() => {
  try {
    return store.players
      .map((p) => {
        const d = store.data[p.battleTag].season[p.race];
        return { battleTag: p.battleTag, points: d.wins * 3 + d.loss };
      })
      .sort((a, b) => b.points - a.points)
      .map((p) => {
        return store.players.find((x) => x.battleTag === p.battleTag);
      });
  } catch {
    return [];
  }
});

const matches = computed(() => {
  try {
    return store.players
      .map((p) => store.data[p.battleTag].season[p.race].matches)
      .reduce((s, m) => [...s, ...m], []);
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
    y: {
      grid: { display: false },
      suggestedMax: 800,
    },
  },
} as any;
// End
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-sheet
        class="pa-12"
        elevation="10"
        style="min-height: 90vh"
        transition="fade-transition"
        v-if="_isEmpty(store.data)">
        <v-row>
          <v-col cols="12" class="text-center">
            <div class="text-h2">GNL Season {{ data?.season }}</div>
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
        class="pa-12"
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
            ><div class="text-h2">
              <span>GNL Season {{ data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">{{ current?.name }}</span>
            </div>
            <hr />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
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
          <v-col cols="4">
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
                    labels: points.map((p) => p.battleTag),
                    datasets: [
                      {
                        label: 'points',
                        backgroundColor: 'rgba(218, 165, 32, 0.3)',
                        borderColor: 'goldenrod',
                        borderWidth: 2,
                        barPercentage: 0.8,
                        data: points.map((p) => p.points),
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
          <v-col cols="4">
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
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Coaches</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3" v-for="coach in store.coaches">
            <GNLCoachBanner :coach="coach" />
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
              v-if="player"
              :dates="store.dates"
              :rank="rank"
              :team-points="teamPoints"
              :player="player"
              :data="store.data[player.battleTag].season[player.race]"
              :current="
                store.data[player.battleTag].season[player.race].mmr.current
              " />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
