<script setup lang="ts">
import logo from "@/assets/challengers/banner.jpg";
import VersusChallenger from "@/components/versus/VersusChallenger.vue";
import _isNil from "lodash/isNil";
import VersusBanner from "@/components/versus/VersusBanner.vue";
import { useChallengersStore } from "@/stores/challengers.ts";
import { computed } from "vue";
import _fromPairs from "lodash/fromPairs";
import _sortBy from "lodash/sortBy";
import type { IStatistics } from "@/utilities/types.ts";
import { useSettingsStore } from "@/stores/settings.ts";
import { useRouter } from "vue-router";
import { raceIcon, raceName } from "@/stores/races.ts";

const router = useRouter();

const store = useChallengersStore();
const settings = useSettingsStore();

const copy = (text: string) => {
  navigator.clipboard.writeText(
    `${window.location.origin}/#/challengers?data=${text}`,
  );
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
    return v.season.summary.totalPoints;
  } else if (mode === "mmr") {
    return v.season.summary.mmr.current;
  } else if (mode === "weeklyActivity") {
    return v.week.total;
  } else if (mode === "monthlyActivity") {
    return v.month.total;
  } else if (mode === "seasonActivity") {
    return v.season.summary.total;
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
            <img :src="logo" alt="APE SCIENCE - WC3 RESEARCH FACILITY" />
            <div class="text-h4 font-weight-bold">W3C CHALLENGERS LADDER</div>
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
              <v-col cols="12" md="8">
                <div class="text-h6">Save and share your ladder!</div>
                <hr color="darkgoldenrod" />
              </v-col>
              <v-col cols="12" md="4" />
              <v-col cols="12" md="6" class="text-right">
                <v-snackbar
                  :timeout="2000"
                  color="primary"
                  :rounded="false"
                  variant="tonal"
                  class="text-center">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      block
                      :rounded="false"
                      variant="tonal"
                      color="primary"
                      @click="
                        () => {
                          router.replace({
                            ...router.currentRoute.value,
                            query: undefined,
                          });
                          settings.data.ladder = store.link;
                        }
                      "
                      >Save this ladder</v-btn
                    >
                  </template>
                  This ladder is now set as your <strong>default</strong>
                </v-snackbar>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <v-snackbar
                  :timeout="2000"
                  color="secondary"
                  :rounded="false"
                  variant="tonal"
                  class="text-center">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      block
                      :rounded="false"
                      variant="tonal"
                      color="secondary"
                      @click="
                        () => {
                          copy(store.link);
                        }
                      "
                      >Create shareable link</v-btn
                    >
                  </template>
                  Link to ladder was <strong>copied</strong>!
                </v-snackbar>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center">
            <span style="vertical-align: middle; font-weight: bold">
              Compare players by earned
              <span style="color: goldenrod; font-weight: bold">points</span>
              and
              <span style="color: darkgoldenrod; font-weight: bold"
                >achievements</span
              >
              in the current w3c ladder season - add new or remove existing
              <i class="font-weight-bold">challengers</i> to compare and create
              your own ladder!
            </span>
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
              :on-remove="
                () => {
                  const idx = store.ladder.indexOf(challenger);
                  store.ladder.splice(idx, 1);
                }
              "
              :challenger="challenger"
              :player="store.challengers[challenger]"
              :season-start="store.start"
              :highlight="store.mode"
              :rank="i" />
            <versus-challenger
              v-else
              :loading="
                !_isNil(challenger) &&
                _isNil(store.challengers[challenger]?.battleTag)
              "
              v-model="store.ladder[i]" />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3" xl="2">
            <versus-challenger
              :loading="
                !_isNil(store.ladder[store.ladder.length]) &&
                _isNil(
                  store.challengers[store.ladder[store.ladder.length]]
                    ?.battleTag,
                )
              "
              v-model="store.ladder[store.ladder.length]" />
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
                      {{ store.challengers[challenger].season.summary.wins }}
                    </td>
                    <td class="text-center text-red font-weight-bold">
                      {{ store.challengers[challenger].season.summary.loss }}
                    </td>
                    <td class="text-center font-weight-bold">
                      {{ store.challengers[challenger].season.summary.total }}
                    </td>
                    <td class="text-center font-weight-bold">
                      {{
                        Math.round(
                          (store.challengers[challenger].season.summary.wins /
                            store.challengers[challenger].season.summary
                              .total) *
                            100,
                        )
                      }}%
                    </td>
                    <td class="text-center font-weight-bold">
                      {{
                        store.challengers[challenger].season.summary.mmr.current
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
