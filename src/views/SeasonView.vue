<script setup lang="ts">
import ResultChart from "@/components/ResultChart.vue";
import { useSettingsStore } from "@/stores/settings";
import { useStatsStore } from "@/stores/stats";
import { Race, raceIcon } from "@/stores/races";

const settings = useSettingsStore();
const stats = useStatsStore();

const start = moment("07.10.24", "DD.MM.YYYY");
const end = moment(start).add(15, "weeks");

const today = moment();
const days = today.diff(start, "days");

import moment from "moment/moment";
import Performance from "@/components/Performance.vue";
import Banner from "@/components/Banner.vue";

const races = [Race.Human, Race.Orc, Race.NightElf, Race.Undead, Race.Random];
</script>

<template>
  <main v-if="stats.player" style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-row>
        <v-col cols="6">
          <v-sheet class="pa-5" elevation="5" style="min-height: 356px">
            <v-col cols="12">
              <v-row>
                <v-col>
                  <div class="text-h4 text-center">
                    Season: {{ stats.latest }} //
                    {{ start.format("DD.MM.YY") }} to
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
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  v-if="stats.player.season.summary.total"
                  class="text-center">
                  <span class="text-h5">Season Total</span>
                  <ResultChart :result="stats.player.season.summary" />
                </v-col>
                <v-col cols="12" class="text-center" v-else>
                  <span class="text-h6"
                    >No games played yet this season - There is no time like the
                    present!</span
                  >
                </v-col>
              </v-row>
              <v-row class="mt-10">
                <v-col
                  cols="12"
                  class="text-center"
                  v-if="stats.player.season.summary.suspiciousGames">
                  <div class="text-h5">
                    {{ stats.player.season.summary.suspiciousGames.total }}
                    games decided in under 2 minutes:
                    <span class="text-green">
                      {{ stats.player.season.summary.suspiciousGames.wins }}
                      win(s)
                    </span>
                    <span> / </span>
                    <span class="text-red">
                      {{ stats.player.season.summary.suspiciousGames.loss }}
                      loss(es)
                    </span>
                    <span> </span>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-sheet>
        </v-col>

        <v-col cols="6">
          <v-sheet class="pa-5" elevation="5">
            <v-row>
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
                      auto-select-first />
                  </v-card>
                </div>
              </v-col>
            </v-row>
            <v-fade-transition>
              <v-row v-if="stats.highscore.loading">
                <v-progress-linear indeterminate />
              </v-row>
            </v-fade-transition>
            <v-fade-transition>
              <v-row
                style="overflow: visible"
                v-if="stats.highscore && !stats.highscore.loading"
                transition="fade-transition">
                <v-col v-for="score in stats.highscore">
                  <Banner
                    :race="score.race"
                    :current="score.mmr"
                    :diff="score.diff"
                    :label="`Season ${score.season}`" />
                </v-col>
              </v-row>
            </v-fade-transition>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row v-for="race in races">
        <v-col cols="2" v-if="stats.player.season[race].total">
          <v-sheet class="pa-5" :elevation="5">
            <Banner
              :race="race"
              :current="stats.player.season?.[race]?.mmr.current"
              :diff="stats.player.season?.[race]?.mmr.diff"
              :label="'This Season'" />
          </v-sheet>
        </v-col>
        <v-col cols="5" v-if="stats.player.season[race].total">
          <v-sheet class="pa-3" :elevation="5">
            <v-row>
              <v-col cols="12">
                <v-list lines="one" style="overflow: hidden">
                  <v-list-item :prepend-avatar="raceIcon[Race.Human]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Human]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Orc]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                    <ResultChart
                      :result="
                        stats.player.season?.[race].race[Race.NightElf]
                      " />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Undead]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                    <ResultChart
                      :result="stats.player.season?.[race].race[Race.Random]" />
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
                <Performance
                  :visible="stats.player.season[race].total > 0"
                  :performance="stats.player.season[race].performance"
                  :today="-1" />
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
