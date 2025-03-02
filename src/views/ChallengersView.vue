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
              in the current w3c ladder season - add new
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
                  store.ladder.splice(i, 1);
                }
              "
              :challenger="challenger"
              :player="store.challengers[challenger]"
              :season-start="store.start"
              :rank="i + 1" />
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
      </v-sheet>
    </v-container>
  </main>
</template>
