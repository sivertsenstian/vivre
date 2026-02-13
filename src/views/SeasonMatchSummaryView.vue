<script setup lang="ts">
import * as parser from "@/utilities/buildorderparser";
import _has from "lodash/has";
import _take from "lodash/take";
import _keys from "lodash/keys";
import _uniqBy from "lodash/uniqBy";

import moment from "moment";
import { useSettingsStore } from "@/stores/settings";
import { races, heroes } from "@/utilities/constants.ts";
import { useSeasonStore } from "@/stores/season.ts";
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  gethero,
  getopponent,
  getplayer,
} from "@/utilities/matchcalculator.ts";
import RaceIcon from "@/components/RaceIcon.vue";
import MapLink from "@/components/MapLink.vue";
import MapPreview from "@/components/MapPreview.vue";
import ChartAnnotation from "chartjs-plugin-annotation";
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
import axios from "axios";
import { useRoute } from "vue-router";
import { getMatch } from "@/utilities/api.ts";
import _sample from "lodash/sample";
import { BuildOrderType } from "@/utilities/buildorderparser";

const settings = useSettingsStore();
const season = useSeasonStore();

// Graph stuff
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartAnnotation,
);

const route = useRoute();
const loading = ref(false);
const match = ref<any>(null);
const buildOrders = ref<any>(null);

const fetchData = async (id: string) => {
  if (_has(settings.replays, id)) {
    return settings.replays[id];
  }

  const match = await getMatch(id);
  const replay = await axios.get(
    `https://website-backend.w3champions.com/api/replays/${id}`,
    { responseType: "blob" },
  );
  const response = await axios.postForm(
    "https://w3tools.hexcoding.de/api/replay/parse",
    { file: replay.data },
  );

  const result: any = {
    ...match,
    buildOrders: response.data.playerBuildOrders.map((b: any) => ({
      player: b.playerName,
      items: b.buildOrderItems,
    })),
  };

  if (_keys(settings.replays).length > 100) {
    const unlucky: any = _sample(settings.replays);
    delete settings.replays[unlucky.match.id];
  }

  (settings.replays as any)[id] = result;

  return result;
};

onMounted(async () => {
  try {
    loading.value = true;
    const r = await fetchData(String(route.params.id));

    match.value = r.match;
    buildOrders.value = r.buildOrders.map((b: any) => ({
      ...b,
      ...parser.summarize(b.items),
    }));
  } finally {
    loading.value = false;
  }
});

const player = computed(() => {
  let r = getplayer(settings.battleTag)(match.value);
  if (!r?.players?.length) {
    // if the match does not include the active player - just get the first player from the build order data
    r = getplayer(buildOrders.value?.[0].player)(match.value);
  }
  return r?.players?.[0];
});
const opponent = computed(
  () => getopponent(player.value?.battleTag)(match.value)?.players?.[0],
);

const mainlyPlays = computed(() => {
  const ranks = races.map((r) => ({
    race: r,
    pickrate:
      ((season.player?.season[r]?.total ?? 0) /
        (season.player?.season.summary.total ?? 1)) *
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
    datasets: (buildOrders?.value ?? []).map((b: any, i: number) => {
      return {
        label: b.player,
        borderColor: i === 1 ? "red" : "blue",
        backgroundColor: i === 1 ? "red" : "blue",
        data: b.items.map((v: any, j: number) => {
          return {
            x: moment(match.value.startTime).add(moment.duration(v.timespan)), //moment.duration(v.timespan).asSeconds(),
            y: j,
            item: v,
          };
        }),
      };
    }),
  };
});

const annotations = computed(() => {
  if (!match.value) {
    return {};
  }

  const result = {
    ..._reduce(
      buildOrders?.value?.[0]?.items ?? [],
      (a, v, p) => {
        if (v.type === BuildOrderType.Tech) {
          const res = {
            ...a,
            [v.id]: {
              type: "line",
              display: (ctx: any) => {
                return ctx.chart.isDatasetVisible(0);
              },
              borderColor: "blue",
              borderWidth: 2,
              borderDash: [6, 6],
              borderDashOffset: 0,
              label: {
                drawTime: "afterDraw",
                position: "end",
                backgroundColor: "rgba(0, 0, 255, 0.8)",
                content: v.instructions,
                display: true,
              },
              scaleID: "x",
              value: moment(match.value.startTime).add(
                moment.duration(v.timespan),
              ),
            },
          };

          return res;
        }
        if (v.type === BuildOrderType.BuildHero) {
          const res = {
            ...a,
            [v.id]: {
              type: "line",
              display: (ctx: any) => {
                return ctx.chart.isDatasetVisible(0);
              },
              borderColor: "cornflowerblue",
              borderWidth: 2,
              borderDash: [6, 6],
              borderDashOffset: 0,
              label: {
                drawTime: "afterDraw",
                position: "middle",
                yAdjust: 20,
                backgroundColor: "rgba(100, 149, 237, 0.8)",
                content: v.instructions,
                display: true,
              },
              scaleID: "x",
              value: moment(match.value.startTime).add(
                moment.duration(v.timespan),
              ),
            },
          };

          return res;
        }
        return a;
      },
      {},
    ),
    ..._reduce(
      buildOrders?.value?.[1]?.items ?? [],
      (a, v, p) => {
        if (v.type === "Tech") {
          const res = {
            ...a,
            [v.id]: {
              type: "line",
              display: (ctx: any) => {
                return ctx.chart.isDatasetVisible(1);
              },
              borderColor: "red",
              borderWidth: 2,
              borderDash: [6, 6],
              borderDashOffset: 0,
              label: {
                drawTime: "afterDraw",
                position: "start",
                backgroundColor: "rgba(255,0,0,0.8)",
                content: v.instructions,
                display: true,
              },
              scaleID: "x",
              value: moment(match.value.startTime).add(
                moment.duration(v.timespan),
              ),
            },
          };

          return res;
        }

        if (v.type === BuildOrderType.BuildHero) {
          const res = {
            ...a,
            [v.id]: {
              type: "line",
              display: (ctx: any) => {
                return ctx.chart.isDatasetVisible(1);
              },
              borderColor: "crimson",
              borderWidth: 2,
              borderDash: [6, 6],
              borderDashOffset: 0,
              label: {
                drawTime: "afterDraw",
                position: "middle",
                yAdjust: -20,
                backgroundColor: "rgba(220, 20, 60,0.8)",
                content: v.instructions,
                display: true,
              },
              scaleID: "x",
              value: moment(match.value.startTime).add(
                moment.duration(v.timespan),
              ),
            },
          };

          return res;
        }
        return a;
      },
      {},
    ),
  };

  return result;
});

const options: any = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    datalabels: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";

          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.raw.item?.instructions;
          }
          return label;
        },
      },
    },
    annotation: { annotations: annotations.value },
  },
  elements: {
    line: {
      tension: 0.3,
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "minute",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
      },
    },
    y: {
      display: false,
      grid: {
        color: "rgba(255, 255, 255, 0.05)",
      },
    },
  },
}));
</script>

<template>
  <main v-if="season.player" style="height: 100vh; overflow-y: auto">
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
                    <h2 class="font-weight-bold">
                      Game <span class="text-grey">{{ match?.id }}</span>
                    </h2>
                    <hr />
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
                                'text-green': player?.mmrGain > 0,
                                'text-red': player?.mmrGain < 0,
                                'text-grey': player?.mmrGain === 0,
                              }"
                              ><v-icon
                                :icon="
                                  player?.mmrGain > 0
                                    ? 'mdi-arrow-up'
                                    : player?.mmrGain < 0
                                      ? 'mdi-arrow-down'
                                      : 'mdi-minus'
                                " />
                              <span
                                class="font-weight-bold"
                                style="vertical-align: middle"
                                >{{ player?.mmrGain }}</span
                              ></span
                            >
                          </td>
                          <td class="text-no-wrap">
                            <race-icon :race="player?.race" :size="35" />
                            <player-w3c-link
                              :battle-tag="player?.battleTag"
                              :won="player?.won" />
                          </td>
                          <td class="text-right">
                            <span
                              class="text-grey"
                              :title="`(${player?.mmrGain > 0 ? '+' : ''}${player?.mmrGain}) mmr`"
                              >{{ player?.currentMmr ?? "-" }}</span
                            >
                          </td>
                          <td class="text-center">vs</td>
                          <td class="text-left">
                            <span
                              class="text-grey"
                              :title="`(${player?.mmrGain > 0 ? '+' : ''}${opponent?.mmrGain}) mmr`"
                              >{{ opponent?.currentMmr ?? "-" }}</span
                            >
                          </td>
                          <td class="text-right text-no-wrap">
                            <player-w3c-link
                              :battle-tag="opponent?.battleTag"
                              :won="opponent?.won"
                              left />
                            <race-icon :race="opponent?.race" :size="35" />
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>

                <v-row v-if="loading" style="min-width: 600px">
                  <v-col cols="12" class="pb-0 text-center">
                    <h3 class="font-weight-bold">Loading summary...</h3>
                  </v-col>
                </v-row>

                <v-row v-if="!loading">
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Match History</h2>
                    <hr />
                  </v-col>
                  <v-col
                    cols="11"
                    class="mx-auto mt-2"
                    style="min-height: 400px">
                    <Line :data="data" :options="options" />
                  </v-col>
                </v-row>

                <v-row v-if="!loading">
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Build Order</h2>
                    <hr />
                  </v-col>

                  <v-col cols="12" lg="6" v-for="(bo, i) in buildOrders">
                    <v-row>
                      <v-col
                        cols="12"
                        lg="8"
                        :offset-lg="i === 0 ? 4 : 0"
                        class="text-center"
                        ><v-icon
                          style="margin-top: 2px"
                          size="small"
                          :color="i === 0 ? 'blue' : 'red'"
                          icon="mdi-circle" />
                        <span
                          class="font-weight-bold mx-1"
                          style="vertical-align: middle; font-size: 22px"
                          >{{ bo?.player }}</span
                        >
                        <race-icon
                          :race="
                            getplayer(bo.player)(match)?.players?.[0]?.race ??
                            Race.Random
                          " />
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" lg="8" :offset-lg="i === 0 ? 4 : 0">
                        <div
                          style="
                            background-color: rgb(84, 75, 75);
                            border-radius: 6px;
                          ">
                          <v-col cols="12" class="text-center">
                            <div
                              class="d-inline-flex"
                              :title="step.id"
                              v-for="step in _uniqBy<any>(
                                bo?.items.filter(
                                  (i: any) =>
                                    i.type === BuildOrderType.BuildHero,
                                ),
                                'id',
                              )">
                              <img :src="step.icon" />
                              <span
                                class="font-weight-bold ml-1 mr-4 mt-1"
                                style="color: gold">
                                Level
                                {{ gethero(bo.player, step.id)(match)?.level }}
                              </span>
                            </div>
                          </v-col>
                          <v-col cols="12" class="text-center pa-0">
                            <div
                              class="d-inline-flex"
                              :title="step.id"
                              v-for="step in _uniqBy<any>(
                                bo?.items
                                  .filter(
                                    (i: any) => i.type === BuildOrderType.Learn,
                                  )
                                  .sort((a: any, b: any) =>
                                    a.id.localeCompare(b.name),
                                  ),
                                'id',
                              )">
                              <div
                                class="text-center mr-2"
                                :title="step.instruction">
                                <img :src="step.icon" />
                                <div
                                  class="font-weight-bold"
                                  style="margin-top: -7px">
                                  {{ bo?.count[step.id] - 1 }}
                                </div>
                              </div>
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <div
                              class="d-inline-flex"
                              :title="step.id"
                              v-for="step in _uniqBy<any>(
                                bo?.items
                                  .filter(
                                    (i: any) =>
                                      i.type === BuildOrderType.BuildUnit &&
                                      bo?.count[i.id] - 1 > 0,
                                  )
                                  .sort((a: any, b: any) =>
                                    a.id.localeCompare(b.name),
                                  ),
                                'id',
                              )">
                              <div
                                class="text-center mr-2"
                                :title="step.instruction">
                                <img :src="step.icon" />
                                <div
                                  class="font-weight-bold"
                                  style="margin-top: -7px">
                                  {{ bo?.count[step.id] - 1 }}
                                </div>
                              </div>
                            </div>
                          </v-col>
                        </div>
                      </v-col>
                      <v-col cols="12" lg="8" :offset-lg="i === 0 ? 4 : 0">
                        <div
                          style="
                            padding: 10px;
                            background-color: rgb(71, 57, 57);
                            border-radius: 6px;
                          ">
                          <div
                            class="d-inline-flex"
                            :title="step.id"
                            v-for="step in _uniqBy<any>(
                              bo?.items
                                .filter(
                                  (i: any) =>
                                    i.type === BuildOrderType.BuildBuilding &&
                                    bo?.count[i.id] - 1 > 0,
                                )
                                .sort((a: any, b: any) =>
                                  a.id.localeCompare(b.name),
                                ),
                              'id',
                            )">
                            <div class="text-center mr-2">
                              <img :src="step.icon" />
                              <div
                                class="font-weight-bold"
                                style="margin-top: -7px">
                                {{ bo?.count[step.id] - 1 }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" lg="8" :offset-lg="i === 0 ? 4 : 0">
                        <v-table class="summary-build-order" density="compact">
                          <tbody>
                            <tr v-for="step in bo?.items">
                              <td
                                :class="{
                                  [step.class]: true,
                                  expansion: step.expansion,
                                }">
                                <span
                                  class="ml-1 font-weight-bold text-grey"
                                  style="vertical-align: middle"
                                  >{{ step.time }}</span
                                >
                              </td>
                              <td
                                :class="{
                                  [step.class]: true,
                                  expansion: step.expansion,
                                }">
                                <img
                                  :src="step.icon"
                                  width="24"
                                  style="
                                    vertical-align: middle;
                                    margin-right: 5px;
                                  " />
                                <span
                                  class="font-weight-bold"
                                  style="vertical-align: middle"
                                  >{{ step.instructions }}
                                </span>

                                <v-badge
                                  v-if="step.showCount"
                                  style="
                                    vertical-align: middle;
                                    float: right;
                                    margin-top: 3px;
                                  "
                                  :content="step.count"
                                  :color="i === 0 ? 'blue' : 'red'"
                                  inline>
                                </v-badge>
                                <v-chip
                                  v-if="step.type === BuildOrderType.Tech"
                                  style="
                                    float: right;
                                    margin-top: 2px;
                                    margin-right: 3px;
                                  "
                                  size="x-small"
                                  append-icon="mdi-home-sound-out"
                                  variant="text"
                                  ><span class="font-weight-bold"
                                    >TECH</span
                                  ></v-chip
                                >
                                <v-chip
                                  v-if="step.type === BuildOrderType.BuildHero"
                                  style="
                                    float: right;
                                    margin-top: 2px;
                                    margin-right: 3px;
                                  "
                                  size="x-small"
                                  append-icon="mdi-crown"
                                  color="#ffd700"
                                  variant="text"
                                  ><span class="font-weight-bold"
                                    >HERO</span
                                  ></v-chip
                                >
                                <v-chip
                                  v-if="step.expansion"
                                  style="
                                    float: right;
                                    margin-top: 2px;
                                    margin-right: 3px;
                                  "
                                  size="x-small"
                                  append-icon="mdi-castle"
                                  variant="text"
                                  ><span class="font-weight-bold"
                                    >EXPANSION</span
                                  ></v-chip
                                >
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-col>
                    </v-row>
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

<style>
.summary-build-order {
  table {
    border-spacing: 0 3px !important;
    tbody {
      tr {
        td:first-of-type {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
        td:last-of-type {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        td.Buy {
          background-color: rgba(60, 138, 43, 0.5);
        }

        td.Learn {
          background-color: rgba(43, 138, 114, 0.5);
        }

        td.Tech {
          &:first-of-type {
            border-left: 1px solid goldenrod;
            border-top: 1px solid goldenrod;
            border-bottom: 1px solid goldenrod;
          }
          &:last-of-type {
            border-right: 1px solid goldenrod;
            border-top: 1px solid goldenrod;
            border-bottom: 1px solid goldenrod;
          }
          background-color: rgba(166, 158, 95, 0.66);
        }

        td.Research,
        td.Upgrade {
          background-color: rgba(114, 43, 138, 0.5);
        }

        td.BuildUnit,
        td.Hire {
          background-color: rgb(84, 75, 75);
        }

        td.BuildBuilding {
          background-color: rgb(72, 57, 57);

          &.expansion {
            &:first-of-type {
              border-left: 1px solid goldenrod;
              border-top: 1px solid goldenrod;
              border-bottom: 1px solid goldenrod;
            }
            &:last-of-type {
              border-right: 1px solid goldenrod;
              border-top: 1px solid goldenrod;
              border-bottom: 1px solid goldenrod;
            }
          }
        }

        td.BuildHero {
          background-color: rgba(29, 91, 131, 0.77);

          &:first-of-type {
            border-left: 1px solid goldenrod;
            border-top: 1px solid goldenrod;
            border-bottom: 1px solid goldenrod;
          }
          &:last-of-type {
            border-right: 1px solid goldenrod;
            border-top: 1px solid goldenrod;
            border-bottom: 1px solid goldenrod;
          }
        }

        td.CancelUnit,
        td.CancelBuilding,
        td.CancelHero,
        td.Unsummon {
          background-color: rgba(183, 52, 63, 0.5);
        }
      }
    }
  }
}
</style>
