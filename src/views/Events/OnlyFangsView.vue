<script setup lang="ts">
import logo from "@/assets/events/onlyfangs_banner.jpg";
import banner_tyler1 from "@assets/events/tyler1.jpg";
import banner_ahmpy from "@assets/events/ahmpy.jpg";
import banner_soda from "@assets/events/sodapoppin.jpg";
import banner_guzu from "@assets/events/guzu.jpg";
import banner_dendi from "@assets/events/dendi.jpg";
import banner_geranimo from "@assets/events/geranimo.jpg";
import banner_sunglitters from "@assets/events/sunglitters.jpg";
import banner_annie from "@assets/events/annie.jpg";

import VersusChallenger from "@/components/events/onlyfangs/OnlyFangsVersusChallenger.vue";
import _isNil from "lodash/isNil";
import VersusBanner from "@/components/events/onlyfangs/OnlyFangsVersusBanner.vue";
import { computed } from "vue";
import _fromPairs from "lodash/fromPairs";
import _sortBy from "lodash/sortBy";
import type { IStatistics } from "@/utilities/types.ts";
import { useOnlyFangsStore } from "@/stores/onlyfangs.ts";
import { raceIcon, raceName } from "@/stores/races.ts";
import VueCountdown from "@chenfengyuan/vue-countdown";

const store = useOnlyFangsStore();

const onlyFangsBanner: any = {
  "Tyler1#11151": banner_tyler1,
  "Ahmp#1107": banner_ahmpy,
  "Skippy1337#1171": banner_soda,
  "Guzu#21761": banner_guzu,
  "Dendi#22658": banner_dendi,
  "Geranimo#11740": banner_geranimo,
  "sunglitters#21798": banner_sunglitters,
  "AnnieFuchsia#2169": banner_annie,
};

const modeLabel = (mode: string) => {
  if (mode === "points") {
    return "Points";
  } else if (mode === "mmr") {
    return "MMR";
  } else if (mode === "weeklyActivity") {
    return "Activity this week";
  } else if (mode === "monthlyActivity") {
    return "Activity this month";
  } else if (mode === "seasonActivity") {
    return "Activity this season";
  }
};

const getPoints = (mode: string, v: IStatistics) => {
  if (_isNil(v)) {
    return 0;
  }

  if (mode === "points") {
    return v.season[v.race].totalPoints;
  } else if (mode === "mmr") {
    return v.season[v.race].mmr.current;
  } else if (mode === "weeklyActivity") {
    return v.week.total;
  } else if (mode === "monthlyActivity") {
    return v.month.total;
  } else if (mode === "seasonActivity") {
    return v.season[v.race].total;
  }
};

const rank = computed(() => {
  let points: any[] = [];
  let rank: Record<string, number> = {};

  if (store.ladder.length) {
    for (const challenger of store.ladder.filter((v) => !_isNil(v))) {
      points.push({
        id: challenger,
        points: getPoints(store.mode, store.challengers[challenger]),
      });
    }

    return _fromPairs(
      _sortBy(points, "points")
        .reverse()
        .map((p, i) => [p.id, i]),
    );
  }

  return rank;
});

const ladder = computed(() =>
  [...store.ladder].sort((a, b) => rank.value[a] - rank.value[b]),
);
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet class="pa-6" elevation="10">
        <v-row>
          <v-col cols="12" class="text-center ma-0 pa-0">
            <v-img
              :src="logo"
              style="border: 1px solid darkgoldenrod"
              rounded="pill"
              alt="ONLYFANGS W3C LADDER"
              class="mx-auto"
              max-width="1200px" />
            <div class="text-sm-h4 text-h6 font-weight-bold mt-2">
              W3C LADDER RACE!
            </div>
            <div>
              <a
                href="https://liquipedia.net/warcraft/OnlyFangs_Invitational"
                target="_blank"
                ><span class="vertical-align:middle"
                  ><v-icon
                    icon="mdi-link"
                    class="mr-1"
                    style="color: goldenrod"
                    size="x-small" /></span
                >Link to OnlyFangs Invitational Tournament</a
              >
            </div>
          </v-col>
          <v-col cols="12" class="text-center">
            <div class="text-md-h4 h5 font-weight-bold">
              <span>
                <vue-countdown
                  :time="store.timeRemaining"
                  v-slot="{ days, hours, minutes, seconds }">
                  {{ days }} day(s), {{ hours }} hour(s),
                  {{ minutes }} minute(s), {{ seconds }} second(s) until the
                  tournament is live!
                </vue-countdown>
              </span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="7">
            <v-row>
              <v-col cols="12" md="6">
                <div class="text-h6">Rank Ladder By</div>
                <hr color="darkgoldenrod" />
              </v-col>
              <v-col cols="12" md="12">
                <v-radio-group inline v-model="store.mode">
                  <v-radio
                    v-for="mode in store.modes"
                    :label="modeLabel(mode)"
                    :value="mode"
                    density="comfortable" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="5">
            <v-row>
              <v-col cols="12" md="7">
                <div class="text-h6 text-no-wrap">
                  Want to create your own ladder?
                </div>
                <hr color="darkgoldenrod" />
              </v-col>
              <v-col cols="12" md="12" class="text-center">
                You can create your own personal and shareable ladder ranking
                and compare your w3c progress to others<a href="/#/challengers"
                  >here</a
                >!
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center">
            <span style="vertical-align: middle; font-weight: bold">
              Players are compared and ranked by the selected criteria
              (currently
              <i
                ><strong>{{ modeLabel(store.mode) }}</strong></i
              >). They can also earn
              <span style="color: goldenrod; font-weight: bold">points</span>
              and
              <span style="color: darkgoldenrod; font-weight: bold"
                >achievements</span
              >
              in the current w3c ladder season based on their games played!
            </span>
            <p style="color: goldenrod">
              The page updates <i>automatically</i> - so no need to refresh!
            </p>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet class="pa-4 pb-10" :elevation="5">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
            v-for="(challenger, i) in ladder">
            <versus-banner
              v-if="
                !_isNil(challenger) &&
                !_isNil(store.challengers[challenger]?.battleTag)
              "
              :laddering="store.laddering[challenger]"
              :streaming="store.streaming[challenger]"
              :banner="onlyFangsBanner[challenger]"
              :challenger="challenger"
              :player="store.challengers[challenger]"
              :season-start="store.start"
              :highlight="store.mode"
              :rank="i" />
            <versus-challenger
              v-else
              :battle-tag="challenger"
              :banner="onlyFangsBanner[challenger]"
              :streaming="store.streaming[challenger]"
              :loading="
                !_isNil(challenger) &&
                _isNil(store.challengers[challenger]?.battleTag) &&
                challenger.includes('#')
              "
              v-model="store.ladder[i]" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="10" offset="1" class="my-5">
            <hr color="darkgoldenrod" />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col cols="0" sm="1" md="2" lg="3" xl="3" />
          <v-col cols="12" sm="10" md="8" lg="6" xl="6">
            <v-table hover fixed-header>
              <thead>
                <tr>
                  <th class="text-center font-weight-bold">#</th>
                  <th class="text-left font-weight-bold">Player</th>
                  <th class="text-left font-weight-bold">Race</th>
                  <th class="text-center font-weight-bold">Wins</th>
                  <th class="text-center font-weight-bold">Losses</th>
                  <th class="text-center font-weight-bold">Total</th>
                  <th class="text-center font-weight-bold">Winrate</th>
                  <th class="text-center font-weight-bold">MMR</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(challenger, i) in ladder">
                  <template
                    v-if="
                      !_isNil(challenger) &&
                      !_isNil(store.challengers[challenger]?.battleTag)
                    ">
                    <td class="text-center">
                      <strong>{{ i + 1 }}.</strong>
                    </td>
                    <td class="text-left">{{ challenger }}</td>
                    <td class="text-left">
                      <div style="white-space: nowrap">
                        <img
                          style="vertical-align: middle"
                          width="25px"
                          :src="raceIcon[store.challengers[challenger].race]" />
                        {{ raceName[store.challengers[challenger].race] }}
                      </div>
                    </td>
                    <td class="text-center text-green font-weight-bold">
                      {{
                        store.challengers[challenger].season[
                          store.challengers[challenger].race
                        ].wins
                      }}
                    </td>
                    <td class="text-center text-red font-weight-bold">
                      {{
                        store.challengers[challenger].season[
                          store.challengers[challenger].race
                        ].loss
                      }}
                    </td>
                    <td class="text-center font-weight-bold">
                      {{
                        store.challengers[challenger].season[
                          store.challengers[challenger].race
                        ].total
                      }}
                    </td>
                    <td class="text-center font-weight-bold">
                      {{
                        Math.round(
                          (store.challengers[challenger].season[
                            store.challengers[challenger].race
                          ].wins /
                            Math.max(
                              1,
                              store.challengers[challenger].season[
                                store.challengers[challenger].race
                              ].total,
                            )) *
                            100,
                        )
                      }}%
                    </td>
                    <td class="text-center font-weight-bold">
                      {{
                        store.challengers[challenger].season[
                          store.challengers[challenger].race
                        ].mmr.current
                      }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
