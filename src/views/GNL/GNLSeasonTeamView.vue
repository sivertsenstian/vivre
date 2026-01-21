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

store.current = Number(route.params.team);

const current = computed(() => {
  return store.data?.teams?.find((t: any) => t.teamId === store.current) ?? {};
});

onBeforeRouteLeave(() => {
  store.current = undefined;
});

const teamPoints = computed(() => {
  return (
    current.value?.players?.reduce(
      (s: number, p: any) => (s += p?.totalPoints ?? 0),
      0,
    ) ?? 0
  );
});

const teamMatches = computed(() => {
  return (
    current.value?.players?.reduce(
      (r: number, p: IGNLAccount) => r + (p.data?.total ?? 0),
      0,
    ) ?? 0
  );
});

const players = computed(() => {
  try {
    return current.value.players.sort(
      (a: IGNLAccount, b: IGNLAccount) =>
        (b.totalPoints ?? 0) - (a.totalPoints ?? 0),
    );
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
import _isNil from "lodash/isNil";
import ResultChart from "@/components/ResultChart.vue";
import _orderBy from "lodash/orderBy";

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
  plugins: {
    legend: false,
  },
  scales: {
    x: {
      grid: { display: false },
      type: "category",
      display: false,
    },
    y: {
      grid: { display: false },
      suggestedMax: 350,
    },
  },
} as any;
// End

const playermode = ref<"cards" | "table">("cards");
const search = ref();
const sort = ref("points");
const sortdir = ref<"asc" | "desc">("desc");
const playersort = computed(() => {
  if (sort.value === "mmr") {
    return "data.mmr.current";
  }

  if (sort.value === "mmr-max") {
    return "data.mmr.max";
  }

  if (sort.value === "mmr-min") {
    return "data.mmr.min";
  }

  if (sort.value === "mmr-initial") {
    return "data.mmr.initial";
  }

  if (sort.value === "battleTag") {
    return "battleTag";
  }

  return "totalPoints";
});

const playerfilter = (p: any) => {
  if (_isNil(search.value) || search.value?.trim().length < 1) {
    return true;
  }

  // MMR search
  if (search.value?.includes("-")) {
    const [from, to] = search.value.split("-");
    if (from.length && to.length) {
      return (
        p.data?.mmr?.current >= Number(from) &&
        p.data?.mmr?.current <= Number(to)
      );
    } else if (!from.length && to.length) {
      return p.data?.mmr?.current <= Number(to);
    } else if (!to.length && from.length) {
      return p.data?.mmr?.current >= Number(from);
    }

    return true;
  }

  // Wildcard search
  return (
    p.battleTag.toLowerCase().startsWith(search.value.toLowerCase()) ||
    String(p.data?.mmr?.current)?.startsWith(search.value)
  );
};

const sortBy = (s: string) => {
  if (s === sort.value) {
    sortdir.value = sortdir.value === "asc" ? "desc" : "asc";
  } else {
    sortdir.value = "desc";
    sort.value = s;
  }
};

import { Race, raceIcon } from "@/stores/races";

const raceGnlColor: any = {
  [Race.Human]: "#e8b453",
  [Race.NightElf]: "#6a5693",
  [Race.Undead]: "#5198ba",
  [Race.Orc]: "#7b1414",
  [Race.Random]: "#59524A",
};

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
        v-if="!store.initialized || !current.name">
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
                :src="teamGnlBanner(current.teamId)"
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
              <v-col cols="12" md="6" class="text-center">
                <div class="text-h5 text-no-wrap">
                  Team Points:
                  <span class="font-weight-bold" style="color: goldenrod">
                    <span style="vertical-align: middle">{{ teamPoints }}</span>
                    <v-icon size="x-small" class="ml-1" icon="mdi-medal"
                  /></span>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="text-center">
                <div class="text-h5 text-no-wrap">
                  Matches:
                  <span class="font-weight-bold" style="color: goldenrod">
                    <span style="vertical-align: middle">{{
                      teamMatches
                    }}</span>
                    <v-icon size="x-small" class="ml-1" icon="mdi-shield-crown"
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
                    labels: current.players
                      .filter((p: IGNLAccount) => (p.totalPoints ?? 0) > 0)
                      .map((p: IGNLAccount) => p.battleTag.split('#')[0]),
                    datasets: [
                      {
                        label: 'points',
                        backgroundColor: 'rgba(218, 165, 32, 0.3)',
                        borderColor: 'goldenrod',
                        borderWidth: 2,
                        barPercentage: 0.8,
                        data: current.players
                          .filter((p: IGNLAccount) => (p.totalPoints ?? 0) > 0)
                          .map((p: IGNLAccount) => p.totalPoints),
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
            <div class="text-h5">Ladder Activity</div>
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
            <GNLCoachBanner :coach="coach" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" offset-md="4" class="text-center">
            <div class="text-h4">Players</div>
            <hr />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" md="6" offset-md="3" class="text-right">
            <v-text-field
              v-model="search"
              label="Search players...  for MMR range use '-' e.g. 1500 - 1600"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              hide-details
              single-line
              clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn-group>
              <v-btn
                title="Show player cards (default)"
                @click="playermode = 'cards'"
                icon="mdi-cards-variant"
                variant="text"
                :color="playermode === 'cards' ? '#d4af37' : ''"></v-btn>
              <v-btn
                title="Show players as a sortable table"
                @click="playermode = 'table'"
                icon="mdi-table"
                variant="text"
                :color="playermode === 'table' ? '#d4af37' : ''"></v-btn>
            </v-btn-group>
          </v-col>
        </v-row>

        <v-row class="justify-center" v-if="playermode === 'table'">
          <v-col cols="12">
            <v-table style="min-height: 500px" height="1000" fixed-header>
              <thead>
                <tr style="white-space: nowrap" class="text-center">
                  <th style="min-width: 65px"></th>
                  <th
                    @click="sortBy('battleTag')"
                    class="sortable left"
                    :style="{
                      color: sort === 'battleTag' ? 'gold' : '',
                    }">
                    Name
                    <span v-if="sort === 'battleTag'"
                      ><v-icon
                        v-if="sortdir === 'desc'"
                        icon="mdi-chevron-down" />
                      <v-icon v-else icon="mdi-chevron-up"
                    /></span>
                  </th>
                  <th
                    class="sortable"
                    @click="sortBy('points')"
                    :style="{ color: sort === 'points' ? 'gold' : '' }">
                    Points
                    <span v-if="sort === 'points'"
                      ><v-icon
                        v-if="sortdir === 'desc'"
                        icon="mdi-chevron-down" />
                      <v-icon v-else icon="mdi-chevron-up"
                    /></span>
                  </th>
                  <th
                    class="sortable"
                    @click="sortBy('mmr')"
                    :style="{ color: sort === 'mmr' ? 'gold' : '' }">
                    MMR
                    <span v-if="sort === 'mmr'"
                      ><v-icon
                        v-if="sortdir === 'desc'"
                        icon="mdi-chevron-down" />
                      <v-icon v-else icon="mdi-chevron-up"
                    /></span>
                  </th>
                  <th>Wins</th>
                  <th>Loss</th>
                  <th>Total</th>
                  <th
                    class="sortable"
                    @click="sortBy('mmr-initial')"
                    :style="{ color: sort === 'mmr-initial' ? 'gold' : '' }">
                    MMR start
                    <span v-if="sort === 'mmr-initial'"
                      ><v-icon
                        v-if="sortdir === 'desc'"
                        icon="mdi-chevron-down" />
                      <v-icon v-else icon="mdi-chevron-up"
                    /></span>
                  </th>
                  <th
                    class="sortable"
                    @click="sortBy('mmr-min')"
                    :style="{ color: sort === 'mmr-min' ? 'gold' : '' }">
                    MMR min
                    <span v-if="sort === 'mmr-min'"
                      ><v-icon
                        v-if="sortdir === 'desc'"
                        icon="mdi-chevron-down" />
                      <v-icon v-else icon="mdi-chevron-up"
                    /></span>
                  </th>
                  <th
                    class="sortable"
                    @click="sortBy('mmr-max')"
                    :style="{ color: sort === 'mmr-max' ? 'gold' : '' }">
                    MMR max
                    <span v-if="sort === 'mmr-max'"
                      ><v-icon
                        v-if="sortdir === 'desc'"
                        icon="mdi-chevron-down" />
                      <v-icon v-else icon="mdi-chevron-up"
                    /></span>
                  </th>
                  <th>MMR +/-</th>
                  <th style="min-width: 300px; width: 300px">
                    <v-img
                      class="mx-auto"
                      width="35px"
                      :src="raceIcon[Race.Human]" />
                  </th>
                  <th style="min-width: 300px; width: 300px">
                    <v-img
                      class="mx-auto"
                      width="35px"
                      :src="raceIcon[Race.Orc]" />
                  </th>
                  <th style="min-width: 300px; width: 300px">
                    <v-img
                      class="mx-auto"
                      width="35px"
                      :src="raceIcon[Race.NightElf]" />
                  </th>
                  <th style="min-width: 300px; width: 300px">
                    <v-img
                      class="mx-auto"
                      width="35px"
                      :src="raceIcon[Race.Undead]" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="text-center"
                  v-for="(player, rank) in _orderBy<any>(
                    players.filter(playerfilter),
                    playersort,
                    sortdir,
                  )"
                  :key="rank">
                  <td><v-img :src="raceIcon[player.race]" /></td>
                  <td class="text-left">{{ player.battleTag }}</td>
                  <td style="color: goldenrod">{{ player.totalPoints }}</td>
                  <td>{{ player.data?.mmr?.current }}</td>
                  <td class="text-green-lighten-1">{{ player.data?.wins }}</td>
                  <td class="text-red-lighten-1">{{ player.data?.loss }}</td>
                  <td class="text-no-wrap">
                    {{ player.data?.total }} |
                    <span
                      :class="
                        player?.data?.percentage > 0.75
                          ? 'text-green'
                          : player?.data?.percentage > 0.65
                            ? 'text-green-lighten-1'
                            : player?.data?.percentage > 0.55
                              ? 'text-green-lighten-2'
                              : player?.data?.percentage > 0.5
                                ? 'text-green-lighten-3'
                                : player?.data?.percentage > 0.4
                                  ? 'text-orange'
                                  : player?.data?.percentage > 0.3
                                    ? 'text-yellow'
                                    : player?.data?.percentage > 0
                                      ? 'text-red-lighten-1'
                                      : 'text-grey'
                      "
                      >{{
                        Math.round((player.data?.percentage || 0) * 100)
                      }}%</span
                    >
                  </td>
                  <td>{{ player.data?.mmr?.initial }}</td>
                  <td>{{ player.data?.mmr?.min }}</td>
                  <td>{{ player.data?.mmr?.max }}</td>
                  <td
                    :class="
                      player.data?.mmr?.current > player.data?.mmr?.initial
                        ? 'text-green-lighten-1'
                        : 'text-red-lighten-1'
                    ">
                    <span
                      v-if="
                        player.data?.mmr?.current > player.data?.mmr?.initial
                      "
                      >+</span
                    >{{ player.data?.mmr?.current - player.data?.mmr?.initial }}
                  </td>
                  <td class="text-no-wrap">
                    <ResultChart
                      :result="player.data?.race?.[Race.Human]"
                      percentage />
                  </td>
                  <td>
                    <ResultChart
                      :result="player.data?.race?.[Race.Orc]"
                      percentage />
                  </td>
                  <td>
                    <ResultChart
                      :result="player.data?.race?.[Race.NightElf]"
                      percentage />
                  </td>
                  <td>
                    <ResultChart
                      :result="player.data?.race?.[Race.Undead]"
                      percentage />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>

        <v-row class="justify-center" v-else>
          <v-col
            cols="12"
            md="3"
            v-for="(player, rank) in players.filter(playerfilter)"
            :key="rank">
            <GNLPlayerBanner
              :dates="store.dates"
              :rank="rank"
              :prefix="player.prefix"
              :player="player" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>

<style scoped>
.sortable {
  cursor: pointer;
  font-weight: bold !important;

  &:hover {
    filter: brightness(1.5);
  }

  &.left {
    text-align: left !important;
  }
}

th {
  text-align: center !important;
}
</style>
