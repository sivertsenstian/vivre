<script setup lang="ts">
import { ref } from "vue";
import NumberAnimation from "vue-number-animation";
import moment from "moment";
import _round from "lodash/round";
import _has from "lodash/has";
import ConfettiExplosion from "vue-confetti-explosion";
import ResultChart from "@/components/ResultChart.vue";
import WeeklyGoalChart from "@/components/WeeklyGoalChart.vue";
import WeeklyResultChart from "@/components/WeeklyResultChart.vue";
import Performance from "@/components/Performance.vue";
import { useSettingsStore } from "@/stores/settings";
import { useStatsStore } from "@/stores/stats";
import { Race, creeproutes, raceIcon, heroIcon } from "@/stores/races";

const settings = useSettingsStore();
const stats = useStatsStore();

import hu_banner from "@/assets/take_a_look_at_banner_michael.png";
import r_banner from "@/assets/take_a_look_at_banner_random.png";
import ud_banner from "@/assets/take_a_look_at_banner_undead.png";
import ne_banner from "@/assets/take_a_look_at_banner_nightelf.png";
import oc_banner from "@/assets/take_a_look_at_banner_orc.png";
import GNLPlayerBanner from "@/components/gnl/GNLPlayerBanner.vue";
import { calculateLadderPoints } from "@/stores/gnl.ts";

const raceBanner: any = {
  [Race.Human]: hu_banner,
  [Race.Orc]: oc_banner,
  [Race.Undead]: ud_banner,
  [Race.NightElf]: ne_banner,
  [Race.Random]: r_banner,
};

const numberOfGames = (target: number, avg: number) =>
  Math.abs(Math.ceil(target / avg));

let duration = ref(
  moment.utc(moment().diff(stats?.ongoing?.start)).format("mm:ss"),
);
setInterval(() => {
  duration.value = moment
    .utc(moment().diff(stats?.ongoing?.start))
    .format("mm:ss");
}, 1000);
</script>

<template>
  <main v-if="stats.player" style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-row>
        <v-col cols="12" md="8">
          <v-col cols="12" v-if="!stats?.ongoing?.active">
            <v-sheet class="pa-8" elevation="5">
              <v-row>
                <v-col cols="12" md="6">
                  <v-col cols="12" class="text-center">
                    <div class="text-md-h5 text-h6">
                      Daily fill ({{ Math.ceil(settings.data.goal / 7) }} per
                      day)
                    </div>
                    <ConfettiExplosion
                      :particelCount="300"
                      :stageWidth="2000"
                      :stageHeight="2000"
                      v-if="
                        settings.data.goal > 0 &&
                        stats.player.day.total > 0 &&
                        stats.player.day.total ===
                          Math.ceil(settings.data.goal / 7)
                      " />
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-progress-linear
                      :class="{
                        'disable-animation': true,
                        'text-white':
                          stats.player.day.total >=
                          Math.ceil(settings.data.goal / 7),
                        'text-gray':
                          stats.player.day.total <
                          Math.ceil(settings.data.goal / 7),
                      }"
                      striped
                      style="border: 1px solid gray"
                      :color="
                        stats.player.day.total >=
                        Math.ceil(settings.data.goal / 7)
                          ? 'success'
                          : 'warning'
                      "
                      :model-value="stats.player.day.total"
                      :max="Math.ceil(settings.data.goal / 7)"
                      :height="50">
                      <template v-slot:default="{ value }">
                        <span class="text-gray text-h6"
                          >{{
                            _round(
                              (stats.player.day.total /
                                Math.ceil(settings.data.goal / 7)) *
                                100,
                            )
                          }}
                          %</span
                        >
                      </template>
                    </v-progress-linear>
                  </v-col>
                  <v-col
                    cols="12"
                    class="text-center mt-5"
                    v-if="
                      stats.player.day.total < Math.ceil(settings.data.goal / 7)
                    ">
                    <div class="text-h6">
                      Only
                      {{
                        Math.ceil(settings.data.goal / 7) -
                        stats.player.day.total
                      }}
                      game(s) left - Go ladder!
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <WeeklyResultChart
                      :weekly="stats.weekly"
                      :goal="Math.ceil(settings.data.goal / 7)" />
                  </v-col>
                </v-col>
                <v-col cols="12" md="5">
                  <WeeklyGoalChart
                    :played="Number(stats.player.week.total)"
                    :goal="Number(settings.data.goal)" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" v-if="stats.player.week.total">
                  <span class="title"
                    >This Week ({{ stats.player.week.total }}):</span
                  >
                  <ResultChart :result="stats.player.week" />
                </v-col>
                <v-col cols="12" class="text-center" v-else>
                  <span class="text-h6"
                    >No games played yet this week - There is no time like the
                    present!</span
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" v-if="stats.player.day.total">
                  <span class="title"
                    >Today ({{ stats.player.day.total }}):</span
                  >
                  <ResultChart :result="stats.player.day" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" v-if="stats.player.week.total">
                  <div class="text-h6">Weekly MMR Breakdown</div>
                  <hr />
                  <v-row class="mt-2">
                    <v-col cols="12">
                      <section>
                        Calculated by taking average mmr gained over this weeks
                        {{ stats.player.week.mmr.averages.count }} games played
                        ({{ stats.player.week.mmr.averages.win }} gained,
                        {{ stats.player.week.mmr.averages.loss }} lost).
                      </section>
                      <section>
                        This means that you are currently
                        {{
                          Math.sign(stats.player.week.mmr.averages.gain) > 0
                            ? "gaining"
                            : "losing"
                        }}
                        <strong
                          >{{
                            Math.abs(stats.player.week.mmr.averages.gain)
                          }}MMR</strong
                        >
                        per game (on average)
                      </section>
                      <v-sheet
                        v-if="stats.player.week.mmr.averages.gain > 0"
                        class="mt-1 text-green">
                        <section class="font-weight-bold">
                          On your current path it will take you
                          {{
                            numberOfGames(
                              100,
                              stats.player.week.mmr.averages.gain,
                            )
                          }}
                          games to increase your MMR by 100 points
                        </section>
                        <section
                          class="mt-1 font-weight-bold"
                          v-if="
                            settings.data?.mmr &&
                            settings.data.mmr > stats.player.week.mmr.current
                          ">
                          And it will take you
                          {{
                            numberOfGames(
                              settings.data.mmr - stats.player.week.mmr.current,
                              stats.player.week.mmr.averages.gain,
                            )
                          }}
                          games to reach your current MMR goal of
                          {{ settings.data.mmr }} MMR.
                        </section>
                      </v-sheet>
                      <div
                        v-if="stats.player.week.mmr.averages.gain < 0"
                        class="mt-1 text-red text-subtitle">
                        <section>
                          On your current path - you will have decreased your
                          MMR by 100 points after
                          {{
                            numberOfGames(
                              100,
                              stats.player.week.mmr.averages.gain,
                            )
                          }}
                          games.
                        </section>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col cols="12">
            <v-sheet class="pa-4" :elevation="5">
              <v-row>
                <v-col cols="12" md="8" class="text-center"> Here? </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <GNLPlayerBanner
                    :player="{
                      ...stats.player,
                      data: stats.player.month,
                      achievements: stats.player.month.achievements,
                      achievementPoints: stats.player.month.achievementPoints,
                      points: stats.player.month.points,
                      totalPoints: stats.player.month.totalPoints,
                    }"
                    :dates="{
                      start: moment().utc().startOf('month'),
                      end: moment.utc().endOf('month'),
                      today: moment().utc(true).endOf('day'),
                      daysSinceStart: Math.abs(
                        moment()
                          .utc(true)
                          .endOf('day')
                          .diff(moment().utc().startOf('month'), 'days'),
                      ),
                      durationInDays: Math.abs(
                        moment
                          .utc()
                          .endOf('month')
                          .diff(moment.utc().startOf('month'), 'days'),
                      ),
                    }"
                    :team-points="100"
                    :rank="0" />
                </v-col>

                <v-col cols="4"> ADD Challenger </v-col>
                <v-col cols="4"> ADD Challenger </v-col>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col cols="12" v-if="stats?.ongoing?.active">
            <v-sheet class="pa-4" :elevation="5">
              <v-row>
                <v-col cols="12" md="8" class="text-center">
                  <v-col cols="12">
                    <span class="text-h6 font-weight-bold"
                      >Playing on '{{ stats.ongoing?.map }}' :
                      {{ duration }}</span
                    >
                  </v-col>
                  <v-col cols="12">
                    <span class="text-h5" style="vertical-align: text-top"
                      >Vs.
                    </span>
                    <img
                      class="mx-6"
                      style="vertical-align: middle"
                      width="100px"
                      :src="raceIcon[stats.ongoing.opponent.race]" />
                    <span class="text-h5" style="vertical-align: text-top">
                      {{ stats.ongoing.opponent?.name }} ({{
                        stats.ongoing.opponent?.oldMmr
                      }})</span
                    >
                  </v-col>
                  <v-col cols="12" md="10" class="mx-auto">
                    <ResultChart :result="stats.ongoing.history" />
                  </v-col>
                </v-col>

                <v-col cols="12" md="4">
                  <v-col
                    cols="12"
                    :class="{
                      'text-right': stats.ongoing.history.last.length,
                      'text-center': !stats.ongoing.history.last.length,
                    }">
                    <div>
                      <span
                        class="text-caption font-weight-bold"
                        v-if="stats.ongoing.history.last.length"
                        >Last {{ stats.ongoing.history.last.length }}:
                      </span>
                      <span class="text-caption font-weight-bold" v-else>
                        First Game This Season vs Opponent!
                      </span>
                      <template v-for="result in stats.ongoing.history.last">
                        <v-chip
                          v-if="result"
                          size="x-small"
                          variant="tonal"
                          color="green"
                          label
                          class="rounded-0">
                          <v-icon icon="mdi-shield-sword-outline" />
                        </v-chip>
                        <v-chip
                          v-else
                          size="x-small"
                          variant="tonal"
                          color="red"
                          label
                          class="rounded-0">
                          <v-icon icon="mdi-shield-sword-outline" />
                        </v-chip>
                      </template>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    class="text-center"
                    v-if="
                      _has(creeproutes, [
                        stats.ongoing.player?.race,
                        stats.ongoing.opponent?.race,
                        stats.ongoing.map,
                      ])
                    ">
                    <span class="caption">Suggested Creep Route</span>
                    <img
                      :src="
                        creeproutes[stats.ongoing?.player?.race][
                          stats.ongoing?.opponent?.race
                        ][stats.ongoing?.map].img
                      "
                      width="100%" />
                  </v-col>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="8">
                  <v-row v-if="stats.ongoing.history.heroes.length">
                    <v-col cols="12">
                      <div class="text-h5">
                        Heroes used in recent games vs
                        <img
                          style="vertical-align: middle"
                          width="50"
                          :src="raceIcon[stats.ongoing.player.race]" />
                        <hr />
                      </div>
                    </v-col>
                  </v-row>
                  <v-row
                    v-for="([heroes, n], i) in stats.ongoing.history.heroes">
                    <div class="text-h5 ml-5" style="align-self: center">
                      #{{ i + 1 }}
                    </div>
                    <v-col cols="2" v-for="hero in heroes?.split(',')">
                      <img width="70" :src="heroIcon[hero]" :alt="hero" />
                    </v-col>
                    <div class="text-h5 ml-5" style="align-self: center">
                      // {{ n }} time(s)
                    </div>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  class="d-flex align-center text-center"
                  v-if="
                    stats.ongoing.history.games.winDuration > 0 &&
                    stats.ongoing.history.games.lossDuration > 0
                  ">
                  <v-row>
                    <v-col cols="12">
                      <section>
                        Avg. duration per win:
                        <span class="font-weight-bold"
                          >{{ stats.ongoing.history.games.winDuration }}
                        </span>
                        minute(s)
                      </section>
                      <section>
                        Avg. duration per loss:
                        <span class="font-weight-bold">{{
                          stats.ongoing.history.games.lossDuration
                        }}</span>
                        minute(s)
                      </section>
                      <section class="mt-4">
                        <div
                          v-if="stats.ongoing.history.games.isLamer"
                          class="text-red font-weight-bold text-h5">
                          MIGHT BE A LAMER
                        </div>
                        <div v-else class="text-green font-weight-bold">
                          MOST LIKELY NOT A LAMER
                        </div>
                      </section>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-col>
        <v-col cols="12" md="4" class="order-md-last order-first">
          <v-col cols="12">
            <v-sheet class="pa-5" :elevation="5">
              <div class="text-h6 text-center">
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
                  <v-card-item>
                    <v-card-title>
                      <span
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        ">
                        <img
                          style="vertical-align: middle"
                          width="135px"
                          :src="raceBanner[stats.player.race]" />
                        <span
                          style="
                            opacity: 0.87;
                            vertical-align: middle;
                            position: relative;
                            right: 103px;
                            bottom: 55px;
                            width: 0;
                          ">
                          <img
                            style="vertical-align: middle"
                            width="75px"
                            :src="raceIcon[stats.player.race]" />
                        </span>
                        <span
                          v-if="stats.player.week.mmr.current > 100"
                          class="text-h5 text-white"
                          style="
                            opacity: 0.87;
                            vertical-align: middle;
                            position: relative;
                            right: 92px;
                            bottom: 0px;
                            width: 0;
                          ">
                          <NumberAnimation
                            :from="
                              stats.player.week.mmr.current +
                              stats.player.day.mmr.diff
                            "
                            :to="stats.player.week.mmr.current"
                            :format="_round"
                            :duration="1"
                            autoplay
                            easing="linear" />
                          {{
                        }}</span>
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
                        <v-col cols="12" md="6" class="pa-0">
                          <span class="ml-2 text-h6">
                            <span
                              :class="{
                                'text-green': stats.player?.day?.mmr.diff > 0,
                                'text-red': stats.player?.day?.mmr.diff < 0,
                              }">
                              <span v-if="stats.player?.day?.mmr.diff > 0"
                                >+</span
                              >
                              {{ stats.player?.day?.mmr.diff }}
                            </span>
                            Today
                          </span>
                        </v-col>
                        <v-col cols="12" md="6" class="pa-0">
                          <span class="ml-2 text-h6">
                            <span
                              :class="{
                                'text-green': stats.player?.week?.mmr.diff > 0,
                                'text-red': stats.player?.week?.mmr.diff < 0,
                              }">
                              <span v-if="stats.player?.week?.mmr.diff > 0"
                                >+</span
                              >{{ stats.player?.week?.mmr.diff }}
                            </span>
                            This week</span
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card-item>
                </v-card>
              </div>
            </v-sheet>
          </v-col>

          <v-col cols="12">
            <v-sheet class="pa-3" :elevation="5">
              <v-row>
                <v-col cols="12">
                  <v-list lines="one" style="overflow: hidden">
                    <v-list-item :prepend-avatar="raceIcon[Race.Human]">
                      <ResultChart
                        :result="stats.player.week.race[Race.Human]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                      <ResultChart :result="stats.player.week.race[Race.Orc]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                      <ResultChart
                        :result="stats.player.week.race[Race.NightElf]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                      <ResultChart
                        :result="stats.player.week.race[Race.Undead]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                      <ResultChart
                        :result="stats.player.week.race[Race.Random]" />
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
                  <Performance
                    :visible="stats.player.week.total > 0"
                    :performance="stats.player.week.performance"
                    :today="stats.player.day.total" />
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
