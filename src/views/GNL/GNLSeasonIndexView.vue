<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, onMounted } from "vue";
import { teamGnlIndexBanner, useGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";
import VueCountdown from "@chenfengyuan/vue-countdown";

import gnl_logo from "@/assets/gnl/logo.png";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const router = useRouter();
const store = useGNLStore();

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
import { v4 as uuidv4 } from "uuid";
import moment from "moment/moment";
import { useRouter } from "vue-router";
import _round from "lodash/round";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import _range from "lodash/range";
import _isEmpty from "lodash/isEmpty";
import _take from "lodash/take";
import _skip from "lodash/drop";
import GNLCoachBanner from "@/components/gnl/GNLCoachBanner.vue";
import GNLPlayerBanner from "@/components/gnl/GNLPlayerBanner.vue";
import _capitalize from "lodash/capitalize";
import _first from "lodash/first";

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

const options = computed<any>(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        type: "category",
        stacked: true,
      },
      y: {
        grid: { display: false },
        min: 0,
        suggestedMax: Math.max(...points.value) * 1.2,
      },
    },
  };
});
// End

const points = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams.map((t: any) => {
    return t.players?.reduce((s: number, p: any) => {
      return s + (p.totalPoints ?? 0);
    }, 0);
  });
});

const games = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams.map((t: any) => {
    return t.players?.reduce((s: number, p: any) => {
      return s + (p.data?.total ?? 0);
    }, 0);
  });
});

const leader = computed(() => {
  const i = points.value.indexOf(Math.max(...points.value));
  return i > 0 ? store.data?.teams?.[i] : {};
});

const players = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams
    .reduce((s: any[], t: any) => {
      return [...s, ...t.players];
    }, [])
    .sort((a: any, b: any) => b.totalPoints - a.totalPoints);
});

// Text
const model = defineModel<string>({
  default: `
  # Information about the page
  This page is a support tool to help motivate all the GNL participants and teams to practice on the [w3c ladder](https://w3champions.com/) in between official GNL games.
  If you are on a team, you can contribute to make sure that **your** team wins the GNL Ladder race!

  Every win on the ladder awards **3** points, and every loss awards **1** point for the team that you represent. __Regardless of MMR__

  This overview page shows the current total ladder points for each team, with the current leader - and the individual team pages show both information
  about coaches and players! You can access the team pages in the menu on the left or by clicking the team icon above!

  Can you help your team win the ladder race? Are you the one to claim ladder RANK #1 on your team?
  Why delay? Go search for a ladder game right now and find out!
  `,
});

onMounted(() => {
  store.initialize();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-sheet
        v-if="_isEmpty(store.data)"
        class="pa-md-12 pa-3"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center">
            >
            <div class="text-md-h2 text-h5 d-flex align-center justify-center">
              <img
                class="mr-auto"
                alt="Gym Newbie League!"
                :src="gnl_logo"
                height="100" />
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <hr />
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="12">
            <v-row>
              <v-col cols="3" v-for="_ in _range(0, 8)">
                <v-skeleton-loader type="image" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-skeleton-loader type="image" height="100" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-divider className="my-2" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="image" height="150" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="paragraph" />
          </v-col>
        </v-row>
      </v-sheet>

      <v-sheet
        v-else
        class="pa-md-12 pa-3"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-md-h2 text-h5 d-flex align-center justify-center">
              <img
                v-if="!$vuetify.display.mobile"
                class="mr-auto"
                alt="Gym Newbiew League!"
                :src="gnl_logo"
                height="100" />
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary mr-auto">Overview</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col cols="12">
            <v-row>
              <v-col
                v-for="team in store.data?.teams ?? []"
                cols="6"
                sm="4"
                md="3">
                <v-card
                  :class="`team ${leader?.id === team.id ? 'gold' : ''}`"
                  @click="() => router.push(`/gnl/${team.teamId}`)">
                  <div class="team-image-wrapper">
                    <v-img
                      :src="teamGnlIndexBanner(team.teamId)"
                      height="120px"
                      contain
                      class="team-image">
                    </v-img>
                  </div>
                  <v-card-title class="text-body-2 text-sm-body-1 pa-2 justify-center">
                    <span
                      :style="{
                        verticalAlign: 'middle',
                        color: leader?.id === team.id ? 'goldenrod' : 'inherit',
                      }">
                      <v-icon
                        v-if="leader?.id === team.id"
                        icon="mdi-trophy"
                        color="goldenrod"
                        size="small"
                        class="mr-1" />
                      {{ team.name }}
                    </span>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <Bar
              height="250px"
              :data="{
                labels: _isEmpty(store.data.teams)
                  ? []
                  : store.data.teams?.map((t: any) =>
                      $vuetify.display.mobile && t.name.length > 10
                        ? `${t.name.substring(0, 10)}...`
                        : t.name,
                    ),
                datasets: [
                  {
                    label: 'points',
                    backgroundColor: 'rgba(218, 165, 32, 0.3)',
                    borderColor: 'goldenrod',
                    borderWidth: 2,
                    barPercentage: 0.5,
                    data: points,
                    datalabels: {
                      clip: true,
                      clamp: true,
                      anchor: 'end',
                      align: 'end',
                      offset: 0,
                      color: 'goldenrod',
                    },
                  },
                  {
                    label: 'games',
                    backgroundColor: 'rgba(218, 165, 32, 0.4)',
                    borderColor: 'goldenrod',
                    borderWidth: 2,
                    barPercentage: 0.5,
                    data: games,
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
        <v-row>
          <v-col cols="12">
            <v-divider />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            class="text-center text-h6 text-uppercase d-flex align-center">
            <span class="text-h4 text-green-accent-3 ml-auto mr-2">{{
              games.reduce((r: any, s: any) => r + s, 0)
            }}</span>
            <span v-if="store.dates.timeRemaining > 0" class="mr-auto"
              >GNL Ladder Games Played So Far!</span
            >
            <span v-else class="mr-auto"
              >GNL Ladder Games Were Played This Season!</span
            >
          </v-col></v-row
        >
        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center"
            v-if="store.dates.timeRemaining > 0">
            <v-icon icon="mdi-run" size="x-large" />
            <span
              class="font-weight-bold"
              style="
                width: 0;
                height: 0;
                position: relative;
                top: 30px;
                right: 50px;
              ">
              {{ store.dates.start.format("DD.MM.YYYY") }}
            </span>
            <v-progress-linear
              striped
              style="border: 1px solid gray"
              :color="
                store.dates.durationInDays - (store.dates.daysSinceStart - 1) <=
                0
                  ? 'success'
                  : 'warning'
              "
              :model-value="store.dates.daysSinceStart - 1"
              :max="store.dates.durationInDays"
              :height="45">
              <strong v-if="store.dates.daysSinceStart >= 0"
                >{{
                  Math.max(
                    0,
                    _round(
                      ((store.dates.daysSinceStart - 1) /
                        store.dates.durationInDays) *
                        100,
                    ),
                  )
                }}%</strong
              >
            </v-progress-linear>
            <v-icon icon="mdi-exit-run" size="x-large" />
            <v-icon icon="mdi-flag-checkered" size="x-large" />
            <span
              class="font-weight-bold"
              style="
                width: 0;
                height: 0;
                position: relative;
                top: 30px;
                right: 75px;
              ">
              {{ store.dates.end.format("DD.MM.YYYY") }}
            </span>
          </v-col>
          <v-icon
            v-if="
              (store.dates.daysSinceStart - 1) / store.dates.durationInDays >
                0.01 &&
              (store.dates.daysSinceStart - 1) / store.dates.durationInDays <
                0.9
            "
            icon="mdi-run-fast"
            color="warning"
            size="x-large"
            :style="`width: 0; heigth: 0; position: relative;
            top: -50px;
              left: calc(${(store.dates.daysSinceStart / store.dates.durationInDays) * 100}%)
              `" />
          <v-col
            cols="12"
            class="text-center"
            v-if="
              store.dates.daysSinceStart > 0 && store.dates.timeRemaining > 0
            ">
            <div class="text-md-h5 text-h6 font-weight-bold">
              <span>
                <vue-countdown
                  :time="store.dates.timeRemaining"
                  v-slot="{ days, hours, minutes, seconds }">
                  {{ days }} day(s), {{ hours }} hour(s),
                  {{ minutes }} minute(s), {{ seconds }} second(s) left of the
                  league!
                </vue-countdown>
              </span>
              <span class="px-2">-</span>
              <span>Let's Go!</span>
            </div>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
            v-if="store.dates.daysSinceStart <= 0">
            <div class="text-md-h5 text-h6 font-weight-bold">
              <span
                >{{ Math.abs(store.dates.daysSinceStart - 1) }} day(s) until we
                roll</span
              >
              <span class="px-2">-</span>
              <span>HYPE!</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center" v-if="false">
          <v-col cols="12" class="text-center">
            <span class="text-h4" style="color: goldenrod">
              CURRENT GNL LADDER GODS
            </span>
          </v-col>
          <v-col cols="12" class="my-0 py-0">
            <v-col cols="10" class="mx-auto">
              <hr color="goldenrod" class="my-0 py-0" />
            </v-col>
            <v-col cols="12" md="12" class="pt-0 text-center" v-if="false">
              <v-radio-group
                inline
                v-model="store.ladderGodCategory"
                hide-details>
                <v-radio
                  v-for="(c, i) in store.ladderGodCategories"
                  :label="_capitalize(c)"
                  :disabled="i > 1"
                  :value="c"
                  :style="{
                    color:
                      c === store.ladderGodCategory ? 'goldenrod' : 'inherit',
                  }"
                  density="comfortable" />
              </v-radio-group>
            </v-col>
          </v-col>
          <v-col
            v-if="store.initialized"
            cols="12"
            md="3"
            v-for="(player, rank) in _take(players, 12)"
            :key="rank">
            <GNLPlayerBanner
              logo
              :dates="store.dates"
              :rank="rank"
              :team-points="0"
              :prefix="
                store.data.teams.find((t: any) => t.id === (player as any).team)
                  ?.prefix
              "
              :player="player" />
          </v-col>
          <v-col cols="12" class="text-center" v-else>
            <div
              class="text-h5 fontweight-bold"
              style="color: goldenrod; vertical-align: middle">
              <v-progress-circular indeterminate />
            </div>
            <div class="text-h5 fontweight-bold" style="color: goldenrod">
              Calculating...
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <markdown-viewer v-model="model" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>

<style>
.team {
  border: 1px solid transparent;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.3s ease;
}
.team:hover {
  opacity: 1;
  border: 1px solid white;
  transform: translateY(-4px);
}

.team-image-wrapper {
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
}

.team-image {
  border-radius: 4px;
}

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

.gold .team-image-wrapper {
  border-color: rgba(218, 165, 32, 0.5);
  background: rgba(218, 165, 32, 0.1);
}

.team.gold:hover {
  border-color: goldenrod;
}
</style>
