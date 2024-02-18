<script setup lang="ts">
import ResultChart from '@/components/ResultChart.vue'
import WeeklyGoalChart from '@/components/WeeklyGoalChart.vue'
import { useSettingsStore } from '@/stores/settings'
import { useStatsStore, Race } from '@/stores/stats'

import human from '@/assets/race/human.png'
import orc from '@/assets/race/orc.png'
import nightelf from '@/assets/race/nightelf.png'
import undead from '@/assets/race/undead.png'
import random from '@/assets/race/random.png'
import _take from 'lodash/take'

const settings = useSettingsStore()
const stats = useStatsStore()

const raceIcon: any = {
  [Race.Human]: human,
  [Race.Orc]: orc,
  [Race.Undead]: undead,
  [Race.NightElf]: nightelf,
  [Race.Random]: random
}
</script>

<template>
  <main>
    <v-container fluid style="opacity: 0.9">
      <v-row>
        <v-col cols="8">
          <v-col cols="12">
            <v-sheet class="pa-8" elevation="5">
              <v-row>
                <v-col cols="6">
                  <v-col cols="12" class="text-center">
                    <div class="text-h5">Daily fill</div>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-progress-linear
                      class="disable-animation"
                      :striped="stats.player.day.total < Math.ceil(settings.data.goal / 7)"
                      style="border: 1px solid black"
                      :color="
                        stats.player.day.total >= Math.ceil(settings.data.goal / 7)
                          ? 'success'
                          : 'warning'
                      "
                      :model-value="stats.player.day.total"
                      :max="Math.ceil(settings.data.goal / 7)"
                      :height="50"
                    >
                      <template v-slot:default="{ value }">
                        <span
                          >{{
                            (stats.player.day.total / Math.ceil(settings.data.goal / 7)) * 100
                          }}%</span
                        >
                      </template>
                    </v-progress-linear>
                  </v-col>
                  <v-col
                    cols="12"
                    class="text-center mt-5"
                    v-if="stats.player.day.total < Math.ceil(settings.data.goal / 7)"
                  >
                    <div class="text-h6">
                      Only {{ Math.ceil(settings.data.goal / 7) - stats.player.day.total }} game(s)
                      left - Go ladder!
                    </div>
                  </v-col>
                </v-col>
                <v-col cols="6">
                  <WeeklyGoalChart
                    class="mx-auto"
                    :played="Number(stats.player.week.total)"
                    :goal="Number(settings.data.goal)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ResultChart :result="stats.player.week" />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col cols="12" v-if="stats.ongoing.active">
            <v-sheet class="pa-4" :elevation="5">
              <v-row>
                <v-col cols="8" class="text-center">
                  <v-col cols="12"
                    ><span class="text-h6 font-weight-bold"
                      >Playing on '{{ stats.ongoing?.map }}'</span
                    ></v-col
                  >
                  <v-col cols="12">
                    <span class="text-h4" style="vertical-align: text-top">Vs. </span>
                    <img
                      class="mx-6"
                      style="vertical-align: middle"
                      :src="raceIcon[stats.ongoing.opponent.race]"
                    />
                    <span class="text-h4" style="vertical-align: text-top">
                      {{ stats.ongoing.opponent?.name }} ({{
                        stats.ongoing.opponent?.oldMmr
                      }})</span
                    >
                  </v-col>
                  <v-col cols="10" class="mx-auto">
                    <ResultChart :result="stats.ongoing.history" />
                  </v-col>
                </v-col>

                <v-col cols="4">
                  <v-col cols="12" class="text-right">
                    <div v-if="stats.player.week.total">
                      <span class="text-caption font-weight-bold">Last 5: </span>
                      <template v-for="result in _take(stats.ongoing?.history.performance, 5)">
                        <v-chip
                          v-if="result"
                          size="x-small"
                          variant="tonal"
                          color="green"
                          label
                          class="rounded-0"
                        >
                          <v-icon icon="mdi-shield-sword-outline" />
                        </v-chip>
                        <v-chip
                          v-else
                          size="x-small"
                          variant="tonal"
                          color="red"
                          label
                          class="rounded-0"
                        >
                          <v-icon icon="mdi-shield-sword-outline" />
                        </v-chip>
                      </template>
                    </div>
                  </v-col>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-col>
        <v-col cols="4">
          <v-col cols="12">
            <v-sheet class="pa-5" :elevation="5">
              <v-text-field label="Battle Tag" v-model="settings.data.battleTag" clearable />
              <div class="text-h6 text-black text-center">
                MMR: {{ stats.player.mmr }}
                <span class="ml-2 text-black">
                  <span
                    :class="{
                      'text-green': stats.player?.day?.mmr.diff > 0,
                      'text-red': stats.player?.day?.mmr.diff < 0
                    }"
                  >
                    <span v-if="stats.player?.day?.mmr.diff > 0">+</span>
                    {{ stats.player?.day?.mmr.diff }}
                  </span>
                  today
                </span>
                <span class="ml-2 text-black">
                  <span
                    :class="{
                      'text-green': stats.player?.week?.mmr.diff > 0,
                      'text-red': stats.player?.week?.mmr.diff < 0
                    }"
                  >
                    <span v-if="stats.player?.week?.mmr.diff > 0">+</span
                    >{{ stats.player?.week?.mmr.diff }}
                  </span>
                  this week</span
                >
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12">
            <v-sheet class="pa-3" :elevation="5">
              <v-row>
                <v-col cols="12">
                  <v-list lines="one" style="overflow: hidden">
                    <v-list-item :prepend-avatar="human">
                      <ResultChart :result="stats.player.week.race[Race.Human]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="orc">
                      <ResultChart :result="stats.player.week.race[Race.Orc]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="nightelf">
                      <ResultChart :result="stats.player.week.race[Race.NightElf]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="undead">
                      <ResultChart :result="stats.player.week.race[Race.Undead]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="random">
                      <ResultChart :result="stats.player.week.race[Race.Random]" />
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col cols="12">
            <v-sheet class="pa-4" :elevation="5">
              <v-row>
                <v-col cols="12">
                  <div class="text-h6">Performance</div>
                  <hr />
                </v-col>
                <v-col cols="12">
                  <div v-if="stats.player.week.total">
                    <template v-for="result in stats.player.performance">
                      <v-chip
                        v-if="result"
                        size="small"
                        variant="tonal"
                        color="green"
                        label
                        class="rounded-0"
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
                      >
                        <v-icon icon="mdi-shield-sword-outline" />
                      </v-chip>
                    </template>
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
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
