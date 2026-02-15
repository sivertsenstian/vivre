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
  start_color,
} from "@/utilities/constants.ts";
import { useSeasonStore } from "@/stores/season";
import { computed, onMounted, onUnmounted, ref } from "vue";
import _take from "lodash/take";
import { getopponent, getplayer } from "@/utilities/matchcalculator.ts";
import RaceIcon from "@/components/RaceIcon.vue";
import MapLink from "@/components/MapLink.vue";
import MapPreview from "@/components/MapPreview.vue";
import { raceNameWithRandom as raceName } from "@/stores/races.ts";
import PlayerW3cLink from "@/components/PlayerW3cLink.vue";
import _sortBy from "lodash/sortBy";
import { useTheme } from "vuetify";
import OngoingMatch from "@/components/live/OngoingMatch.vue";
import { useRoute, useRouter } from "vue-router";
import _skip from "lodash/drop";

const page = ref(1);
const tab = ref("games");
const route = useRoute();
const router = useRouter();

const settings = useSettingsStore();
const season = useSeasonStore();
const live = useLiveStore();

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

onMounted(() => {
  season.season_offset =
    current_season - Number(route.params.season ?? current_season);
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
                <v-tabs v-model="tab" :color="start_color">
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
              <v-col
                cols="12"
                v-if="!season.player?.season.summary.total"
                class="text-center mt-7">
                <h2 class="font-weight-bold">No activity this season...</h2>
              </v-col>
              <v-col cols="12" v-else>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <h2 class="font-weight-bold">
                      All Games ({{ season.player?.season.summary.total }})
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
                            _skip(
                              season.player?.season.summary.matches,
                              (page - 1) * 100,
                            ),
                            100,
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
                          <td colspan="8">
                            <v-pagination
                              v-model="page"
                              :length="
                                Math.ceil(
                                  season.player?.season.summary.matches.length /
                                    100,
                                )
                              "></v-pagination>
                          </td>
                        </tr>
                      </tfoot>
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
