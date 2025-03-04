<script setup lang="ts">
import ResultChart from "@/components/ResultChart.vue";
import { useSettingsStore } from "@/stores/settings";
import { useSeasonStore } from "@/stores/season";
import { Race, raceIcon } from "@/stores/races";

const settings = useSettingsStore();
const store = useSeasonStore();

const start = moment("04.03.25", "DD.MM.YYYY");
const end = moment(start).add(15, "weeks");

const today = moment();
const days = today.diff(start, "days");

import moment from "moment/moment";
import Performance from "@/components/Performance.vue";
import Banner from "@/components/Banner.vue";

const races = [Race.Human, Race.Orc, Race.NightElf, Race.Undead, Race.Random];
</script>

<template>
  <main v-if="store.player" style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-row>
        <v-col cols="6">
          <v-sheet class="pa-5" elevation="5" style="min-height: 356px">
            <v-col cols="12">
              <v-row>
                <v-col>
                  <div class="text-h4 text-center">
                    Season: {{ store.latest }} //
                    {{ start.format("DD.MM.YY") }} to
                    {{ end.format("DD.MM.YY") }}
                  </div>
                  <hr /> </v-col
              ></v-row>
              <v-row>
                <v-col cols="6" class="text-center">
                  <div class="text-h5">
                    Total number of games:
                    {{ Math.ceil(store.player.season.summary.total) }}
                  </div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="text-h5">
                    {{
                      Math.ceil(
                        store.player.season.summary.total / Math.max(days, 1),
                      )
                    }}
                    game(s) per day on average
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  v-if="store.player.season.summary.total"
                  class="text-center">
                  <span class="text-h5">Season Total</span>
                  <ResultChart :result="store.player.season.summary" />
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
                  v-if="store.player.season.summary.suspiciousGames">
                  <div class="text-h5">
                    {{ store.player.season.summary.suspiciousGames.total }}
                    games decided in under 2 minutes:
                    <span class="text-green">
                      {{ store.player.season.summary.suspiciousGames.wins }}
                      win(s)
                    </span>
                    <span> / </span>
                    <span class="text-red">
                      {{ store.player.season.summary.suspiciousGames.loss }}
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
                      :items="store.searchResults"
                      :loading="store.searching"
                      @input="(e: any) => store.getBattleTag(e.target.value)"
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
              <v-row v-if="store.highscore.loading">
                <v-progress-linear indeterminate />
              </v-row>
            </v-fade-transition>
            <v-fade-transition>
              <v-row
                style="overflow: visible"
                v-if="store.highscore && !store.highscore.loading"
                transition="fade-transition">
                <v-col v-for="score in store.highscore">
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
        <v-col cols="2" v-if="store.player.season[race].total">
          <v-sheet class="pa-5" :elevation="5">
            <Banner
              :race="race"
              :current="store.player.season?.[race]?.mmr.current"
              :diff="store.player.season?.[race]?.mmr.diff"
              :label="'This Season'" />
          </v-sheet>
        </v-col>
        <v-col cols="5" v-if="store.player.season[race].total">
          <v-sheet class="pa-3" :elevation="5">
            <v-row>
              <v-col cols="12">
                <v-list lines="one" style="overflow: hidden">
                  <v-list-item :prepend-avatar="raceIcon[Race.Human]">
                    <ResultChart
                      :result="store.player.season?.[race].race[Race.Human]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                    <ResultChart
                      :result="store.player.season?.[race].race[Race.Orc]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                    <ResultChart
                      :result="
                        store.player.season?.[race].race[Race.NightElf]
                      " />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                    <ResultChart
                      :result="store.player.season?.[race].race[Race.Undead]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                    <ResultChart
                      :result="store.player.season?.[race].race[Race.Random]" />
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>

        <v-col cols="5" v-if="store.player.season[race].total">
          <v-sheet class="pa-4" :elevation="5">
            <v-row>
              <v-col cols="12">
                <div class="text-h6">Performance</div>
                <ResultChart :result="store.player.season[race]" />
                <hr />
              </v-col>
              <v-col cols="12">
                <Performance
                  :visible="store.player.season[race].total > 0"
                  :performance="store.player.season[race].performance"
                  :today="-1" />
              </v-col>
              <v-col cols="12">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="font-weight-bold">Map</th>
                      <th class="text-center font-weight-bold">Wins</th>
                      <th class="text-center font-weight-bold">Losses</th>
                      <th class="text-center font-weight-bold">Total</th>
                      <th class="text-center font-weight-bold">%</th>
                      <th class="text-center" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="map in store.maps">
                      <td class="font-weight-bold">{{ map }}</td>
                      <td class="text-center text-green">
                        <span>{{
                          store.player.season[race].maps[map]?.wins ?? "-"
                        }}</span>
                      </td>
                      <td class="text-center text-red">
                        <span>{{
                          store.player.season[race].maps[map]?.loss ?? "-"
                        }}</span>
                      </td>
                      <td class="text-center" style="color: goldenrod">
                        <span
                          >{{
                            store.player.season[race].maps[map]?.total ?? "-"
                          }}
                        </span>
                      </td>
                      <td class="text-center text-grey">
                        <span v-if="store.player.season[race].maps[map]?.total">
                          {{
                            Math.round(
                              (store.player.season[race].maps[map]?.wins /
                                store.player.season[race].maps[map]?.total) *
                                100,
                            )
                          }}%
                        </span>
                        <span v-else>-</span>
                      </td>
                      <td class="text-center">
                        <v-icon
                          icon="mdi-thumb-up"
                          color="green"
                          v-if="store.player.season[race].maps[map]?.total" />
                        <v-icon icon="mdi-thumb-down" color="red" v-else />
                      </td>
                    </tr>
                  </tbody>
                </v-table>
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
