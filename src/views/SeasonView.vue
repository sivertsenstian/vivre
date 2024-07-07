<script setup lang="ts">
import ResultChart from "@/components/ResultChart.vue";
import { useSettingsStore } from "@/stores/settings";
import { useStatsStore } from "@/stores/stats";
import { Race, raceIcon } from "@/stores/races";

const settings = useSettingsStore();
const stats = useStatsStore();

const start = moment([2024, 5, 25]);
const end = moment(start).add(15, "weeks");

const today = moment();
const days = today.diff(start, "days");

import hu_banner from "@/assets/take_a_look_at_banner_michael.png";
import r_banner from "@/assets/take_a_look_at_banner_random.png";
import ud_banner from "@/assets/take_a_look_at_banner_undead.png";
import ne_banner from "@/assets/take_a_look_at_banner_nightelf.png";
import oc_banner from "@/assets/take_a_look_at_banner_orc.png";
import moment from "moment/moment";

const raceBanner: any = {
  [Race.Human]: hu_banner,
  [Race.Orc]: oc_banner,
  [Race.Undead]: ud_banner,
  [Race.NightElf]: ne_banner,
  [Race.Random]: r_banner,
};

const races = [Race.Human, Race.Orc, Race.NightElf, Race.Undead, Race.Random];

console.log({ season: stats.player });
</script>

<template>
  <main v-if="stats.player">
    <v-container fluid style="opacity: 0.9; height: 100vh; overflow: auto">
      <v-row>
        <v-col cols="8">
          <v-sheet class="pa-5" elevation="5">
            <v-col cols="12">
              <v-row>
                <v-col>
                  <div class="text-h4 text-center">
                    Season: 19 - Duration: {{ start.format("DD.MM.YY") }} to
                    {{ end.format("DD.MM.YY") }}
                  </div>
                  <hr /> </v-col
              ></v-row>
              <v-row>
                <v-col cols="6" class="text-center">
                  <div class="text-h5">
                    Total number of games:
                    {{ Math.ceil(stats.player.season.summary.total) }}
                  </div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="text-h5">
                    {{ Math.ceil(stats.player.season.summary.total / days) }}
                    game(s) per day on average
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  class="text-center"
                  v-if="stats.player.season.summary.suspiciousGames"
                >
                  <div class="text-h5">
                    Number of games under 4 minutes:
                    <span
                      :class="{
                        'text-green':
                          stats.player.season.summary.suspiciousGames < 10,
                        'text-red':
                          stats.player.season.summary.suspiciousGames >= 10,
                      }"
                    >
                      {{ stats.player.season.summary.suspiciousGames }}
                    </span>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" v-if="stats.player.season.summary.total">
                  <span class="title">Season Total</span>
                  <ResultChart :result="stats.player.season.summary" />
                </v-col>
                <v-col cols="12" class="text-center" v-else>
                  <span class="text-h6"
                    >No games played yet this season - There is no time like the
                    present!</span
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-sheet>
        </v-col>
        <v-col cols="4">
          <v-sheet class="pa-5" elevation="5">
            <v-col cols="12">
              <div class="text-h6 text-black text-center">
                <v-card elevation="0">
                  <v-autocomplete
                    :items="stats.searchResults"
                    :loading="stats.searching"
                    @input="(e: any) => stats.getBattleTag(e.target.value)"
                    clearable
                    v-model="settings.data.battleTag as any"
                    class="mx-auto"
                    density="comfortable"
                    placeholder="Search W3C for player..."
                    prepend-inner-icon="mdi-magnify"
                    variant="solo"
                    item-title="battleTag"
                    item-value="battleTag"
                    auto-select-first
                  />
                </v-card>
              </div>
            </v-col>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row v-for="race in races">
        <v-col cols="2" v-if="stats.player.season[race].total">
          <v-sheet class="pa-5" :elevation="5">
            <div class="text-h6 text-black text-center">
              <v-card elevation="0">
                <v-card-item>
                  <v-card-title>
                    <span
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <img
                        style="vertical-align: middle"
                        width="135px"
                        :src="raceBanner[race]"
                      />
                      <span
                        style="
                          opacity: 0.87;
                          vertical-align: middle;
                          position: relative;
                          right: 103px;
                          bottom: 55px;
                          width: 0;
                        "
                      >
                        <img
                          style="vertical-align: middle"
                          width="75px"
                          :src="raceIcon[race]"
                        />
                      </span>
                      <span
                        v-if="stats.player.season?.[race]?.mmr.current > 100"
                        class="text-h5 text-white"
                        style="
                          opacity: 0.87;
                          vertical-align: middle;
                          position: relative;
                          right: 92px;
                          bottom: 0px;
                          width: 0;
                        "
                        >{{ stats.player.season?.[race]?.mmr.current }}</span
                      >
                      <span
                        class="text-white"
                        style="
                          opacity: 0.87;
                          font-size: 16px !important;
                          vertical-align: middle;
                          position: relative;
                          right: 85px;
                          bottom: -25px;
                          width: 0;
                        "
                        >MMR</span
                      >
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="pa-0 pt-2">
                        <span class="ml-2 text-h6">
                          <span
                            :class="{
                              'text-green':
                                stats.player?.season?.[race].mmr.diff > 0,
                              'text-red':
                                stats.player?.season?.[race].mmr.diff < 0,
                            }"
                          >
                            <span
                              v-if="stats.player?.season?.[race].mmr.diff > 0"
                              >+</span
                            >
                            {{ stats.player?.season?.[race].mmr.diff }}
                          </span>
                          This Season
                        </span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card-item>
              </v-card>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="5" v-if="stats.player.season[race].total">
          <v-sheet class="pa-3" :elevation="5">
            <v-row>
              <v-col cols="12">
                <v-list lines="one" style="overflow: hidden">
                  <v-list-item :prepend-avatar="raceIcon[Race.Human]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Human]"
                    />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Orc]"
                    />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.NightElf]"
                    />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Undead]"
                    />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Random]"
                    />
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>

        <v-col cols="5" v-if="stats.player.season[race].total">
          <v-sheet class="pa-4" :elevation="5">
            <v-row>
              <v-col cols="12">
                <div class="text-h6">Performance</div>
                <ResultChart :result="stats.player.season[race]" />
                <hr />
              </v-col>
              <v-col cols="12">
                <div
                  v-if="stats.player.season[race].total"
                  style="max-height: 151px; overflow: hidden"
                >
                  <template
                    v-for="(result, i) in stats.player.season[race].performance"
                  >
                    <v-chip
                      v-if="result"
                      size="small"
                      variant="tonal"
                      color="green"
                      label
                      class="rounded-0"
                      title="Win"
                    >
                      <v-icon icon="mdi-shield-sword-outline" />
                    </v-chip>
                    <v-chip
                      v-else
                      variant="tonal"
                      size="small"
                      color="red"
                      label
                      class="rounded-0"
                      title="Loss"
                    >
                      <v-icon icon="mdi-shield-sword-outline" />
                    </v-chip>
                  </template>
                </div>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<style>
.v-stepper-item {
  opacity: 1;
}

.loss .v-stepper-item__avatar {
  background-color: rgb(var(--v-theme-error)) !important;
  border-color: rgb(var(--v-theme-error)) !important;
}

.win .v-stepper-item__avatar {
  background-color: rgb(var(--v-theme-success)) !important;
  border-color: rgb(var(--v-theme-success)) !important;
}
.disable-animation * {
  animation: none !important;
}
</style>
