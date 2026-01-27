<script setup lang="ts">
import season_explain_dark from "@/assets/season_help_dark.png";
import season_explain from "@/assets/season_help.png";
import * as parser from "@/utilities/buildorderparser";

import moment from "moment";
import PlayerSearch from "@/components/PlayerSearch.vue";
import { useSettingsStore } from "@/stores/settings";
import { useSeasonStore } from "@/stores/season";
import {
  current_season,
  days_since_start,
  duration,
  end_color,
  races,
  ranks,
  start_color,
} from "@/utilities/constants.ts";
import { useStatsStore } from "@/stores/stats.ts";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import _take from "lodash/take";
import {
  getloss,
  getopponent,
  getplayer,
  getwins,
} from "@/utilities/matchcalculator.ts";
import RaceIcon from "@/components/RaceIcon.vue";
import MapLink from "@/components/MapLink.vue";
import MapPreview from "@/components/MapPreview.vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { Race, raceNameWithRandom as raceName } from "@/stores/races.ts";
import _reduce from "lodash/reduce";
import PlayerW3cLink from "@/components/PlayerW3cLink.vue";
import _sortBy from "lodash/sortBy";
import { useTheme } from "vuetify";
import axios from "axios";
import { useRoute } from "vue-router";
import { getMatch } from "@/utilities/api.ts";

const settings = useSettingsStore();
const season = useSeasonStore();
const stats = useStatsStore();

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

// Graph stuff
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

const route = useRoute();
const loading = ref(false);
const match = ref<any>(null);
const buildOrders = ref<any>(null);

const doTest = async (id: any) => {
  const match = await getMatch(id);
  const replay = await axios.get(
    `https://website-backend.w3champions.com/api/replays/${id}`,
    { responseType: "blob" },
  );
  const response = await axios.postForm(
    "https://w3tools.hexcoding.de/api/replay/parse",
    { file: replay.data },
  );

  return {
    ...match,
    buildOrders: response.data.playerBuildOrders.map((b: any) => ({
      player: b.playerName,
      items: parser.parse(10, b.buildOrderItems),
    })),
  };
};

onMounted(async () => {
  try {
    loading.value = true;
    const r = await doTest(route.params.id);

    console.log({ r });

    match.value = r.match;
    buildOrders.value = r.buildOrders;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {});

const player = computed(() => getplayer(settings.battleTag));
const opponent = computed(() => getopponent(settings.battleTag));

const mainlyPlays = computed(() => {
  const ranks = races.map((r) => ({
    race: r,
    pickrate:
      ((stats.player?.season[r]?.total ?? 0) /
        (stats.player?.season.summary.total ?? 1)) *
      100,
  }));

  const sorted = _sortBy(ranks, "pickrate").reverse();
  const filtered = sorted.filter((r: any) => r.pickrate >= 15);

  if (filtered.length === 0) {
    if (sorted.some((v) => v.pickrate > 0)) {
      return _take(sorted, 1);
    }
    return null;
  } else if (filtered.length === 1) {
    return _take(filtered, 1);
  } else {
    return filtered;
  }
});

const data = computed(() => {
  return {
    datasets: _reduce(
      stats.player?.season,
      (s: any[], v, k: string) => {
        if (v.matches.length && k !== "summary") {
          return [
            ...s,
            {
              label: raceName[k],
              borderColor: "red",
              backgroundColor: "red",
              data: v?.matches.map((m) => {
                return {
                  x: m.endTime,
                  y: player.value(m)?.players?.[0]?.currentMmr,
                };
              }),
            },
          ];
        }
        return s;
      },
      [],
    ),
  };
});

const options: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    datalabels: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
      },
    },
  },
};
</script>

<template>
  <main v-if="stats.player" style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-row>
        <v-col cols="12">
          <v-sheet class="pa-4" elevation="5" style="min-height: 356px">
            <v-row>
              <v-col cols="12" lg="8">
                <v-row class="my-0">
                  <v-col
                    cols="12"
                    lg="2"
                    class="mt-1 py-0 text-center text-lg-left">
                    <img :src="settings.profilePicture" :width="150" />
                  </v-col>
                  <v-col cols="12" lg class="text-center text-lg-left">
                    <v-row>
                      <v-col cols="12">
                        <player-w3c-link
                          :battle-tag="settings.battleTag"
                          style="
                            font-size: 48px;
                            font-weight: bold;
                            position: relative;
                            bottom: 25px;
                            right: 15px;
                          " />
                      </v-col>
                      <v-col cols="12">
                        <div
                          class="text-grey"
                          style="
                            font-size: 20px;
                            font-weight: bold;
                            position: relative;
                            bottom: 45px;
                            right: 10px;
                          ">
                          <span v-if="mainlyPlays === null"> </span>
                          <span v-else-if="mainlyPlays.length === 1">
                            Mainly plays
                            <race-icon :race="mainlyPlays[0].race" />
                            {{ raceName[mainlyPlays[0].race] }}
                          </span>
                          <span v-else>
                            <span class="mr-1" v-for="m in mainlyPlays">
                              <race-icon :race="m.race" />
                            </span>
                            Most played races
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="loading">
                <v-progress-linear indeterminate />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Game {{ match?.id }}</h2>
                    <hr />
                  </v-col>
                  <v-col v-if="false" cols="12">
                    <pre>{{ match }}</pre>
                  </v-col>
                  <v-col cols="12" v-if="match">
                    <v-table fixed-header density="compact">
                      <thead>
                        <tr>
                          <th
                            class="text-grey text-left text-no-wrap"
                            style="min-width: 265px">
                            MAP / MODE / DURATION
                          </th>
                          <th class="text-grey text-left">DATE</th>
                          <th class="text-grey text-left text-no-wrap">
                            RATING Δ
                          </th>
                          <th class="text-grey text-left">PLAYER</th>
                          <th class="text-grey text-right">RATING</th>
                          <th
                            class="text-grey text-center"
                            style="width: 15px"></th>
                          <th class="text-grey text-left">RATING</th>
                          <th class="text-grey text-right">OPPONENT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-no-wrap">
                            <v-row class="my-0">
                              <v-col class="mt-1 py-0" cols="4">
                                <map-preview :name="match.mapName" />
                              </v-col>
                              <v-col class="my-auto">
                                <v-col cols="12" class="py-0">
                                  <map-link :name="match.mapName" />
                                </v-col>
                                <v-col cols="12" class="py-0 pl-4 text-grey">
                                  Ranked 1v1
                                  {{
                                    moment
                                      .duration(
                                        match.durationInSeconds,
                                        "seconds",
                                      )
                                      .minutes()
                                  }}m
                                </v-col>
                              </v-col>
                            </v-row>
                          </td>
                          <td>
                            <div class="text-grey text-no-wrap">
                              {{ moment(match.endTime).fromNow() }}
                            </div>
                          </td>
                          <td>
                            <span
                              :class="{
                                'text-green':
                                  player(match)?.players?.[0]?.mmrGain > 0,
                                'text-red':
                                  player(match)?.players?.[0]?.mmrGain < 0,
                                'text-grey':
                                  player(match)?.players?.[0]?.mmrGain === 0,
                              }"
                              ><v-icon
                                :icon="
                                  player(match)?.players?.[0]?.mmrGain > 0
                                    ? 'mdi-arrow-up'
                                    : player(match)?.players?.[0]?.mmrGain < 0
                                      ? 'mdi-arrow-down'
                                      : 'mdi-minus'
                                " />
                              <span
                                class="font-weight-bold"
                                style="vertical-align: middle"
                                >{{
                                  player(match)?.players?.[0]?.mmrGain
                                }}</span
                              ></span
                            >
                          </td>
                          <td class="text-no-wrap">
                            <race-icon
                              :race="player(match)?.players?.[0]?.race"
                              :size="35" />
                            <player-w3c-link
                              :battle-tag="
                                player(match)?.players?.[0]?.battleTag
                              "
                              :won="player(match)?.players?.[0]?.won" />
                          </td>
                          <td class="text-right">
                            <span
                              class="text-grey"
                              :title="`(${player(match)?.players?.[0]?.mmrGain > 0 ? '+' : ''}${player(match)?.players?.[0]?.mmrGain}) mmr`"
                              >{{
                                player(match)?.players?.[0]?.currentMmr ?? "-"
                              }}</span
                            >
                          </td>
                          <td class="text-center">vs</td>
                          <td class="text-left">
                            <span
                              class="text-grey"
                              :title="`(${player(match)?.players?.[0]?.mmrGain > 0 ? '+' : ''}${opponent(match)?.players?.[0]?.mmrGain}) mmr`"
                              >{{
                                opponent(match)?.players?.[0]?.currentMmr ?? "-"
                              }}</span
                            >
                          </td>
                          <td class="text-right text-no-wrap">
                            <player-w3c-link
                              :battle-tag="
                                opponent(match)?.players?.[0]?.battleTag
                              "
                              :won="opponent(match)?.players?.[0]?.won"
                              left />
                            <race-icon
                              :race="opponent(match)?.players?.[0]?.race"
                              :size="35" />
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Match History</h2>
                    <hr />
                  </v-col>
                  <v-col cols="12" style="min-height: 400px">
                    <Line :data="data" :options="options" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Build Order</h2>
                    <hr />
                  </v-col>
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="12"
                        ><v-icon size="small" color="blue" icon="mdi-circle" />
                        {{ buildOrders?.[0]?.player }}
                        <race-icon :race="Race.Human"
                      /></v-col>
                    </v-row>
                    <v-row>
                      <v-table>
                        <thead></thead>
                        <tbody>
                          <tr v-for="step in buildOrders?.[0]?.items">
                            <td>{{ step.time }}</td>
                            <td>{{ step.instructions }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-row>
                    <pre>{{ buildOrders?.[0] }}</pre>
                  </v-col>
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="12"
                        ><v-icon size="small" color="red" icon="mdi-circle" />
                        {{ buildOrders?.[1]?.player }}
                        <race-icon :race="Race.Human"
                      /></v-col>
                    </v-row>
                    <v-row>
                      <v-table>
                        <thead>
                          <tr>
                            <td style="width: 10%" />
                            <td style="width: 90%" />
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="step in buildOrders?.[1]?.items">
                            <td>{{ step.time }}</td>
                            <td>{{ step.instructions }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-row>
                    <pre>{{ buildOrders?.[1] }}</pre>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<style scoped>
tbody.separated:not(:first-of-type) {
  tr:first-of-type > td {
    border-top: 2px solid rgba(255, 255, 255, 0.25);
  }
}

tbody.separated {
  tr:first-of-type > td {
    padding-top: 10px;
  }
  tr:last-of-type > td {
    padding-bottom: 10px;
  }
}

.season-progress-label {
  bottom: 21px;
  left: 2px;
  display: block;
  height: 0;
  position: relative;
  font-size: 11px;
  color: var(--level-start-color);
  filter: brightness(3);
}

.season-progress {
  transition: border-color 1.5s ease-in-out;
  &:hover {
    border: 1px solid var(--level-start-color);
  }
}
</style>
