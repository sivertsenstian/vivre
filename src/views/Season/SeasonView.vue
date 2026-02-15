<script setup lang="ts">
import season_explain_dark from "@/assets/season_help_dark.png";
import season_explain from "@/assets/season_help.png";

import moment from "moment";
import PlayerSearch from "@/components/PlayerSearch.vue";
import { useSettingsStore } from "@/stores/settings";
import { useLiveStore } from "@/stores/live.ts";
import {
  current_season,
  days_since_start,
  duration,
  races,
  ranks,
  start_color,
} from "@/utilities/constants.ts";
import { useSeasonStore } from "@/stores/season";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
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
import _isEmpty from "lodash/isEmpty";
import _groupBy from "lodash/groupBy";
import PlayerW3cLink from "@/components/PlayerW3cLink.vue";
import _sortBy from "lodash/sortBy";
import { useTheme } from "vuetify";
import OngoingMatch from "@/components/live/OngoingMatch.vue";

const settings = useSettingsStore();
const season = useSeasonStore();
const live = useLiveStore();

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
onMounted(() => {
  season.subscribe();
  live.subscribe();
});

onUnmounted(() => {
  season.unsubscribe();
  live.unsubscribe();
});

const player = computed(() => getplayer(settings.battleTag));
const opponent = computed(() => getopponent(settings.battleTag));

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

const opponents = computed(() => {
  return _take(
    _sortBy(
      _reduce(
        _groupBy(
          season.player?.season.summary.matches,
          (m) => opponent.value(m).players[0].battleTag,
        ),
        (s: any[], d, o: string) => {
          if (d.length >= 5) {
            const wins = d.filter((m) =>
              getwins(settings.battleTag, m),
            )?.length;
            const losses = d.filter((m) =>
              getloss(settings.battleTag, m),
            )?.length;
            const total = wins + losses;
            const winrate = (wins / total) * 100;
            return [...s, { battleTag: o, total, winrate, wins, losses }];
          }
          return s;
        },
        [],
      ),
      "total",
    ).reverse(),
    6,
  );
});

const getMedianTime = (matches: any[]) => {
  const d = _sortBy(matches, "durationInSeconds").map(
    (v) => v.durationInSeconds,
  );

  // even
  if (matches.length <= 2) {
    return moment
      .duration(d.reduce((r, v) => r + v, 0) / d.length, "seconds")
      .minutes();
  } else if (matches.length % 2 == 0) {
    const a = Math.round(d[matches.length / 2]);
    const b = Math.round(d[matches.length / 2 + 1]);

    return moment.duration(a + b / 2, "seconds").minutes();
  } // odd
  else {
    return moment
      .duration(d[Math.round(matches.length / 2)], "seconds")
      .minutes();
  }
};

const raceColor: any = {
  [Race.Human]: "#e8b453",
  [Race.NightElf]: "#6a5693",
  [Race.Undead]: "#5198ba",
  [Race.Orc]: "#7b1414",
  [Race.Random]: "#59524A",
};

const data = computed(() => {
  return {
    datasets: _reduce(
      season.player?.season,
      (s: any[], v, k: string) => {
        if (v.matches.length && k !== "summary") {
          return [
            ...s,
            {
              label: raceName[k],
              borderColor: raceColor[k],
              backgroundColor: raceColor[k],
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
  elements: {
    line: {
      tension: 0.3,
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

const tab = ref("overview");
const router = useRouter();
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
              <v-col cols="12" lg="4">
                <player-search />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="pt-0 pb-3">
                <v-tabs model-value="tab" :color="start_color">
                  <v-tab value="overview" @click="() => router.push('/season')"
                    >Overview</v-tab
                  >
                  <v-tab
                    value="games"
                    @click="
                      () => router.push(`/season/${season.actual_season}/games`)
                    "
                    >Games</v-tab
                  >
                </v-tabs>
              </v-col>
              <v-col cols>
                <v-progress-linear
                  :height="2"
                  class="season-progress mt-8"
                  :model-value="(days_since_start / duration) * 100"
                  :color="start_color"
                  :title="`The current season (${current_season}) is ${Math.round((days_since_start / duration) * 100)}% done - ${duration - days_since_start} day(s) left`">
                </v-progress-linear>
                <span class="season-progress-label"
                  >{{ duration - days_since_start }} day(s) left of the current
                  season</span
                >
              </v-col>
            </v-row>
            <v-row v-if="!settings.battleTag">
              <v-col cols="12">
                <v-img
                  :src="isDark ? season_explain_dark : season_explain"
                  width="100%"
                  cover />
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12" lg="4">
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-row>
                      <v-col cols="6">
                        <h2 class="font-weight-bold">Solo Ranked</h2>
                      </v-col>
                      <v-col cols="6" class="d-inline-flex justify-end">
                        <v-btn-group
                          density="comfortable"
                          class="mr-2"
                          style="margin-top: 2px">
                          <v-btn
                            @click="
                              () => {
                                const current = season.actual_season;
                                const next = season.season_rankings.find(
                                  (v) => v.highest.season < current,
                                );

                                if (next) {
                                  season.season_offset =
                                    current_season - next.highest.season;
                                }
                              }
                            "
                            variant="plain"
                            icon="mdi-chevron-left"
                            size="small" />
                          <v-btn
                            @click="
                              () => {
                                const current = season.actual_season;
                                const next = [...season.season_rankings]
                                  .reverse()
                                  .find((v) => v.highest.season > current);

                                if (next) {
                                  season.season_offset =
                                    current_season - next.highest.season;
                                }
                              }
                            "
                            variant="plain"
                            icon="mdi-chevron-right"
                            size="small"
                            :disabled="
                              season.actual_season === current_season
                            " />
                        </v-btn-group>
                        <h3 style="margin-top: 7px">
                          <span
                            :class="{
                              'font-weight-bold': true,
                              'text-grey':
                                season.actual_season !== current_season,
                            }"
                            >Season {{ season.actual_season }}</span
                          >
                        </h3>
                      </v-col>
                    </v-row>
                    <hr />
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="
                      !season.initializing &&
                      season.actual_season_ranking?.highest
                    ">
                    <v-row>
                      <v-col cols="12">
                        <span class="font-weight-bold"
                          >Active Season Rank
                        </span></v-col
                      >
                    </v-row>
                    <v-row class="my-0">
                      <v-col cols="3" class="text-center">
                        <v-icon
                          :title="`${ranks?.[season.actual_season_ranking?.highest?.league]?.name} ${season.actual_season_ranking?.highest?.division > 0 ? season.actual_season_ranking?.highest?.division : ''}`"
                          style="font-size: 60px"
                          size="x-large"
                          :icon="
                            ranks?.[
                              season.actual_season_ranking?.highest?.league
                            ]?.icon
                          "
                          :color="
                            ranks?.[
                              season.actual_season_ranking?.highest?.league
                            ]?.color
                          " />
                      </v-col>
                      <v-col
                        class="my-auto"
                        style="position: relative; right: 35px">
                        <v-col cols="12" class="py-0 font-weight-bold"
                          >Highest MMR:
                          {{
                            season.player?.season?.[
                              season.actual_season_ranking?.highest
                                ?.race as Race
                            ]?.mmr?.max ?? "-"
                          }}</v-col
                        >
                        <v-col cols="12" class="py-0 text-yellow-lighten-1">
                          {{
                            `${ranks?.[season.actual_season_ranking?.highest?.league]?.name} ${season.actual_season_ranking?.highest?.division > 0 ? season.actual_season_ranking?.highest?.division : ""}`
                          }}
                        </v-col>
                        <v-col cols="12" class="py-0 text-grey">
                          Rank #{{
                            season.actual_season_ranking?.highest?.rank
                          }}
                        </v-col>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-grey text-center">RACE</th>
                              <th class="text-grey text-center">MMR</th>
                              <th class="text-grey text-center">GAMES</th>
                              <th class="text-grey text-left">WIN RATE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="text-center">
                                <v-icon
                                  :style="{
                                    visibility: !_isEmpty(
                                      season.actual_season_ranking.others,
                                    )
                                      ? 'visible'
                                      : 'hidden',
                                  }"
                                  @click="
                                    season.actual_season_ranking.additional =
                                      !season.actual_season_ranking.additional
                                  "
                                  size="x-small"
                                  :icon="
                                    season.actual_season_ranking?.additional
                                      ? 'mdi-minus'
                                      : 'mdi-plus'
                                  "
                                  color="grey" />
                                <race-icon
                                  :race="
                                    season.actual_season_ranking?.highest?.race
                                  " />
                              </td>
                              <td class="text-center">
                                {{ season.actual_season_ranking.highest?.mmr }}
                              </td>
                              <td class="text-center">
                                {{
                                  season.actual_season_ranking.highest?.wins +
                                  season.actual_season_ranking.highest?.losses
                                }}
                              </td>
                              <td>
                                <span
                                  >{{
                                    Number(
                                      season.actual_season_ranking?.highest
                                        ?.winrate * 100,
                                    ).toFixed(1)
                                  }}%</span
                                >
                                <span class="text-green ml-2"
                                  >{{
                                    season.actual_season_ranking?.highest?.wins
                                  }}W</span
                                >
                                <span class="text-red ml-2"
                                  >{{
                                    season.actual_season_ranking?.highest
                                      ?.losses
                                  }}L</span
                                >
                              </td>
                            </tr>
                            <tr
                              v-if="season.actual_season_ranking.additional"
                              v-for="data in season.actual_season_ranking
                                .others">
                              <td class="text-center">
                                <span class="ml-3"
                                  ><race-icon :race="data.race"
                                /></span>
                              </td>
                              <td class="text-center">{{ data?.mmr }}</td>
                              <td class="text-center">
                                {{ data?.wins + data?.losses }}
                              </td>
                              <td>
                                <span
                                  >{{
                                    Number(data?.winrate * 100).toFixed(1)
                                  }}%</span
                                >
                                <span class="text-green ml-2"
                                  >{{ data?.wins }}W</span
                                >
                                <span class="text-red ml-2"
                                  >{{ data?.losses }}L</span
                                >
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" v-else>
                    <v-progress-linear indeterminate />
                  </v-col>
                  <v-col cols="12" v-if="season.season_rankings.length">
                    <v-row>
                      <v-col cols="12">
                        <span class="font-weight-bold"
                          >Other Season Ranks
                        </span></v-col
                      >
                    </v-row>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th
                            class="text-grey text-left"
                            style="min-width: 50px">
                            SEASON
                          </th>
                          <th class="text-grey text-left">RACE</th>
                          <th class="text-grey text-left">RANK</th>
                          <th class="text-grey text-left">MMR</th>
                          <th class="text-grey text-left">WIN RATE</th>
                        </tr>
                      </thead>
                      <tbody v-for="rank in season.season_rankings">
                        <tr>
                          <td class="text-no-wrap">
                            <v-icon
                              :style="{
                                visibility: !_isEmpty(rank.others)
                                  ? 'visible'
                                  : 'hidden',
                              }"
                              @click="rank.additional = !rank.additional"
                              size="x-small"
                              :icon="
                                rank?.additional ? 'mdi-minus' : 'mdi-plus'
                              "
                              color="grey" />
                            <v-icon
                              :title="`${ranks?.[rank?.highest?.league]?.name} ${rank?.highest?.division > 0 ? rank.highest?.division : ''}`"
                              class="mx-1"
                              style="vertical-align: middle"
                              size="small"
                              :icon="ranks?.[rank?.highest?.league]?.icon"
                              :color="ranks?.[rank?.highest?.league]?.color" />
                            <span>S{{ rank?.highest?.season }}</span>
                          </td>
                          <td><race-icon :race="rank?.highest?.race" /></td>
                          <td>
                            <span class="text-grey" style="margin-right: 1px"
                              >#</span
                            >{{ rank?.highest?.rank }}
                          </td>
                          <td>{{ rank?.highest?.mmr }}</td>
                          <td>
                            <span
                              >{{
                                Number(rank?.highest?.winrate * 100).toFixed(1)
                              }}%</span
                            >
                            <span class="text-green ml-2"
                              >{{ rank?.highest?.wins }}W</span
                            >
                            <span class="text-red ml-2"
                              >{{ rank?.highest?.losses }}L</span
                            >
                          </td>
                        </tr>
                        <tr v-if="rank.additional" v-for="data in rank.others">
                          <td class="text-center">
                            <v-icon
                              :title="`${ranks?.[data?.league]?.name} ${data?.division > 0 ? data?.division : ''}`"
                              style="vertical-align: middle"
                              size="small"
                              :icon="ranks?.[data?.league]?.icon"
                              :color="ranks?.[data?.league]?.color" />
                          </td>
                          <td><race-icon :race="data?.race" /></td>
                          <td>
                            <span class="text-grey" style="margin-right: 1px"
                              >#</span
                            >{{ data?.rank }}
                          </td>
                          <td>{{ data?.mmr }}</td>
                          <td>
                            <span
                              >{{
                                Number(data?.winrate * 100).toFixed(1)
                              }}%</span
                            >
                            <span class="text-green ml-2"
                              >{{ data?.wins }}W</span
                            >
                            <span class="text-red ml-2"
                              >{{ data?.losses }}L</span
                            >
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
                <v-row v-if="opponents.length">
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Top Opponents</h2>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th class="text-grey text-left">PLAYER</th>
                          <th class="text-grey text-right">GAMES</th>
                          <th class="text-grey text-left">WIN RATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="player in opponents">
                          <td>
                            <player-w3c-link :battle-tag="player.battleTag" />
                          </td>
                          <td class="text-right">{{ player.total }}</td>
                          <td>
                            <span
                              >{{ Number(player.winrate).toFixed(1) }}%</span
                            >
                            <span class="text-green ml-2"
                              >{{ player.wins }}W</span
                            >
                            <span class="text-red ml-2"
                              >{{ player.losses }}L</span
                            >
                          </td>
                        </tr>
                      </tbody>
                    </v-table></v-col
                  >
                </v-row>
              </v-col>
              <v-col
                cols="12"
                lg="8"
                v-if="!season.player?.season.summary.total"
                class="text-center mt-7">
                <h2 class="font-weight-bold">No activity this season...</h2>
              </v-col>
              <v-col cols="12" lg="8" v-else>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">
                      Recent Games
                      <ongoing-match :game="live.ongoing" />
                    </h2>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-table fixed-header density="compact">
                      <thead>
                        <tr>
                          <th
                            class="text-grey text-left text-no-wrap"
                            style="min-width: 280px">
                            MAP / MODE / DURATION
                          </th>
                          <th class="text-grey text-center">DATE</th>
                          <th
                            class="text-grey text-center text-no-wrap"
                            title="RATING Δ">
                            Δ
                          </th>
                          <th class="text-grey text-left">PLAYER</th>
                          <th
                            class="text-grey text-right"
                            title="PLAYER RATING" />
                          <th
                            class="text-grey text-center"
                            style="width: 15px"></th>
                          <th
                            class="text-grey text-left"
                            title="OPPONENT RATING" />
                          <th class="text-grey text-right">OPPONENT</th>
                        </tr>
                      </thead>
                      <tbody v-if="season.player?.season.summary.matches">
                        <tr
                          v-for="match in _take(
                            season.player?.season.summary.matches,
                            5,
                          )"
                          :key="match.id">
                          <td class="text-no-wrap">
                            <v-row class="my-0">
                              <v-col class="mt-1 py-0" cols="4">
                                <map-preview :name="match.mapName" />
                              </v-col>
                              <v-col class="my-auto px-0">
                                <v-col cols="12" class="pa-0">
                                  <map-link :name="match.mapName" />
                                </v-col>
                                <v-col cols="12" class="pa-0 pl-1 text-grey">
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
                          <td class="text-right">
                            <div class="text-grey text-no-wrap">
                              {{ moment(match.endTime).fromNow() }}
                            </div>
                            <a
                              :href="`#/season/${match.id}/summary`"
                              class="text-no-wrap"
                              style="font-size: 13px">
                              View summary
                            </a>
                          </td>
                          <td class="text-center text-no-wrap">
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
                                style="margin-top: 2px"
                                size="sm"
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
                          <td class="text-right px-1">
                            <span
                              class="text-grey"
                              :title="`${player(match)?.players?.[0]?.mmrGain > 0 ? '+' : ''}${player(match)?.players?.[0]?.mmrGain} mmr`"
                              >{{
                                player(match)?.players?.[0]?.currentMmr ?? "-"
                              }}</span
                            >
                          </td>
                          <td class="text-center pa-0">vs</td>
                          <td class="text-left px-1">
                            <span
                              class="text-grey"
                              :title="`${opponent(match)?.players?.[0]?.mmrGain > 0 ? '+' : ''}${opponent(match)?.players?.[0]?.mmrGain} mmr`"
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
                      <tfoot>
                        <tr>
                          <td colspan="8" class="text-center pt-3">
                            <v-btn
                              color="secondary"
                              variant="tonal"
                              @click="
                                () =>
                                  router.push(
                                    `/season/${season.actual_season}/games`,
                                  )
                              "
                              >Show more games</v-btn
                            >
                          </td>
                        </tr>
                      </tfoot>
                    </v-table>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Rating History</h2>
                    <hr />
                  </v-col>
                  <v-col cols="12" style="min-height: 400px">
                    <Line :data="data" :options="options" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Races - Solo Ranked</h2>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-table fixed-header density="compact">
                      <thead>
                        <tr>
                          <th class="text-grey text-left">RACE</th>
                          <th class="text-grey text-center">WIN RATE</th>
                          <th class="text-grey text-center">PICK RATE</th>
                          <th class="text-grey text-center">
                            DURATION (MEDIAN)
                          </th>
                          <th class="text-grey text-center">GAMES COUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="race in races.filter(
                            (r) => (season.player?.season[r].total ?? 0) > 0,
                          )">
                          <td class="text-no-wrap">
                            <race-icon :race="race" />
                            <span class="d-none d-lg-inline-block">{{
                              raceName[race]
                            }}</span>
                          </td>
                          <td class="text-center">
                            <span
                              :class="{
                                'text-green':
                                  (season.player?.season[race].percentage ??
                                    0) >= 0.75,
                                'text-yellow':
                                  (season.player?.season[race].percentage ??
                                    0) >= 0.5 &&
                                  (season.player?.season[race].percentage ??
                                    0) < 0.75,
                                'text-orange':
                                  (season.player?.season[race].percentage ??
                                    0) >= 0.25 &&
                                  (season.player?.season[race].percentage ??
                                    0) < 0.5,
                                'text-red':
                                  (season.player?.season[race].percentage ??
                                    0) < 0.25,
                              }">
                              {{
                                Number(
                                  (season.player?.season[race].percentage ??
                                    0) * 100,
                                ).toFixed(1)
                              }}%
                            </span>
                          </td>
                          <td class="text-center">
                            {{
                              Number(
                                ((season.player?.season[race].total ?? 0) /
                                  (season.player?.season.summary.total ?? 1)) *
                                  100,
                              ).toFixed(1)
                            }}%
                          </td>
                          <td class="text-center">
                            {{
                              getMedianTime(season.player?.season[race].matches)
                            }}
                            min
                          </td>
                          <td class="text-center">
                            {{ season.player?.season[race].total }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">VS Races - Solo Ranked</h2>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-table fixed-header density="compact">
                      <thead>
                        <tr>
                          <th class="text-grey text-left">RACE</th>
                          <th class="text-grey text-center">WIN RATE</th>
                          <th class="text-grey text-center">
                            DURATION (MEDIAN)
                          </th>
                          <th class="text-grey text-center">GAMES COUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="race in races.filter(
                            (r) =>
                              (season.player?.season.summary.race[r].total ??
                                0) > 0,
                          )">
                          <td class="text-no-wrap">
                            <race-icon :race="race" />
                            <span class="d-none d-lg-inline-block">{{
                              raceName[race]
                            }}</span>
                          </td>
                          <td class="text-center">
                            <span
                              :class="{
                                'text-green':
                                  (season.player?.season.summary.race[race]
                                    .percentage ?? 0) >= 75,
                                'text-yellow':
                                  (season.player?.season.summary.race[race]
                                    .percentage ?? 0) >= 50 &&
                                  (season.player?.season.summary.race[race]
                                    .percentage ?? 0) < 75,
                                'text-orange':
                                  (season.player?.season.summary.race[race]
                                    .percentage ?? 0) >= 25 &&
                                  (season.player?.season.summary.race[race]
                                    .percentage ?? 0) < 50,
                                'text-red':
                                  (season.player?.season.summary.race[race]
                                    .percentage ?? 0) < 25,
                              }">
                              {{
                                Number(
                                  season.player?.season.summary.race[race]
                                    .percentage ?? 0,
                                ).toFixed(1)
                              }}%
                            </span>
                          </td>
                          <td class="text-center">
                            {{
                              getMedianTime(
                                season.player?.season.summary.race[race]
                                  .matches,
                              )
                            }}
                            min
                          </td>
                          <td class="text-center">
                            {{ season.player?.season.summary.race[race].total }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Maps - Solo Ranked</h2>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-table fixed-header density="compact">
                      <thead>
                        <tr>
                          <th
                            class="text-grey text-left"
                            style="min-width: 300px">
                            MAP
                          </th>
                          <th class="text-grey text-center">WIN RATE</th>
                          <th class="text-grey text-center">
                            DURATION (MEDIAN)
                          </th>
                          <th class="text-grey text-center">GAMES COUNT</th>
                          <th class="text-grey text-center"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="map in season.maps">
                          <td>
                            <v-row class="my-0">
                              <v-col cols="3" class="mt-1 py-0">
                                <map-preview :name="map" />
                              </v-col>
                              <v-col class="my-auto">
                                <v-col cols="12" class="py-0">
                                  <map-link :name="map" />
                                </v-col>
                              </v-col>
                            </v-row>
                          </td>
                          <td class="text-center">
                            <span
                              v-if="
                                season.player?.season.summary.maps?.[map]
                                  ?.matches.length
                              "
                              :class="{
                                'text-green':
                                  (season.player?.season.summary.maps[map]
                                    ?.percentage ?? 0) >= 75,
                                'text-yellow':
                                  (season.player?.season.summary.maps[map]
                                    ?.percentage ?? 0) >= 50 &&
                                  (season.player?.season.summary.maps[map]
                                    ?.percentage ?? 0) < 75,
                                'text-orange':
                                  (season.player?.season.summary.maps[map]
                                    ?.percentage ?? 0) >= 25 &&
                                  (season.player?.season.summary.maps[map]
                                    ?.percentage ?? 0) < 50,
                                'text-red':
                                  (season.player?.season.summary.maps[map]
                                    ?.percentage ?? 0) < 25,
                              }">
                              {{
                                Number(
                                  season.player?.season.summary.maps[map]
                                    ?.percentage ?? 0,
                                ).toFixed(1)
                              }}%
                            </span>
                            <span class="text-grey" v-else>-</span>
                          </td>
                          <td class="text-center">
                            <span
                              v-if="
                                season.player?.season.summary.maps?.[map]
                                  ?.matches.length
                              ">
                              {{
                                getMedianTime(
                                  season.player?.season.summary.maps?.[map]
                                    ?.matches ?? [],
                                )
                              }}
                              min
                            </span>
                            <span class="text-grey" v-else>-</span>
                          </td>
                          <td class="text-center">
                            <span
                              v-if="
                                season.player?.season.summary.maps?.[map]
                                  ?.matches.length
                              ">
                              {{
                                season.player?.season.summary.maps?.[map]
                                  ?.total ?? 0
                              }}
                            </span>
                            <span class="text-grey" v-else>-</span>
                          </td>
                          <td class="text-center">
                            <v-icon
                              title="Most likely not vetoed - this map has been played this season"
                              icon="mdi-thumb-up"
                              color="green"
                              v-if="
                                season.player?.season.summary.maps?.[map]
                                  ?.total ?? 0
                              " />
                            <v-icon
                              title="Most likely vetoed - this map has not been played this season"
                              icon="mdi-thumb-down"
                              color="red"
                              v-else />
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">Matchups - Solo Ranked</h2>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-table fixed-header density="compact">
                      <thead>
                        <tr>
                          <th class="text-grey text-left">RACE</th>
                          <th class="text-grey text-left">OPPONENT RACE</th>
                          <th class="text-grey text-center">WIN RATE</th>
                          <th class="text-grey text-center">
                            DURATION (MEDIAN)
                          </th>
                          <th class="text-grey text-center">GAMES COUNT</th>
                        </tr>
                      </thead>
                      <tbody
                        class="separated"
                        v-for="race in races.filter(
                          (r) => (season.player?.season[r].total ?? 0) > 0,
                        )">
                        <tr
                          v-for="(data, opponentRace) in _reduce(
                            season.player?.season[race].race,
                            (s, v, k) => {
                              if (v.total > 0) {
                                return { ...s, [k]: v };
                              }
                              return s;
                            },
                            {} as any,
                          )">
                          <td class="text-no-wrap">
                            <race-icon :race="race" />
                            <span class="d-none d-lg-inline-block">{{
                              raceName[race]
                            }}</span>
                          </td>
                          <td>
                            <race-icon :race="opponentRace" />
                            <span class="d-none d-lg-inline-block">
                              {{ raceName[opponentRace] }}
                            </span>
                          </td>
                          <td class="text-center">
                            <span
                              :class="{
                                'text-green': (data.percentage ?? 0) >= 75,
                                'text-yellow':
                                  (data.percentage ?? 0) >= 50 &&
                                  (data.percentage ?? 0) < 75,
                                'text-orange':
                                  (data.percentage ?? 0) >= 25 &&
                                  (data.percentage ?? 0) < 50,
                                'text-red': (data.percentage ?? 0) < 25,
                              }">
                              {{ Number(data.percentage ?? 0).toFixed(1) }}%
                            </span>
                          </td>
                          <td class="text-center">
                            {{ getMedianTime(data.matches) }}
                            min
                          </td>
                          <td class="text-center">
                            {{ data.total }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
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
