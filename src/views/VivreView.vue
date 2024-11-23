<script setup lang="ts">
import { computed, ref } from "vue";
import NumberAnimation from "vue-number-animation";
import moment, { type Moment } from "moment";
import _round from "lodash/round";
import _capitalize from "lodash/capitalize";
import _fromPairs from "lodash/fromPairs";
import _has from "lodash/has";
import ConfettiExplosion from "vue-confetti-explosion";
import ResultChart from "@/components/ResultChart.vue";
import WeeklyGoalChart from "@/components/WeeklyGoalChart.vue";
import WeeklyResultChart from "@/components/WeeklyResultChart.vue";
import Performance from "@/components/Performance.vue";
import VersusBanner from "@/components/versus/VersusBanner.vue";
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
import VersusChallenger from "@/components/versus/VersusChallenger.vue";
import _isNil from "lodash/isNil";
import type { IRaceStatistics, IStatistics } from "@/utilities/types.ts";
import _sortBy from "lodash/sortBy";

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

const data = computed<Partial<IRaceStatistics>>(() => {
  if (!_isNil(stats.player)) {
    if (settings.data.mode === "week") {
      return stats.player.week;
    } else if (settings.data.mode === "month") {
      return stats.player.month;
    } else if (settings.data.mode === "season") {
      return stats.player.season.summary;
    }
  }
  return { wins: 0, loss: 0, total: 0 };
});

const getPoints = (v: IStatistics) => {
  if (_isNil(v)) {
    return 0;
  }

  if (settings.data.mode === "week") {
    return v.week.totalPoints;
  } else if (settings.data.mode === "month") {
    return v.month.totalPoints;
  } else if (settings.data.mode === "season") {
    return v.season.summary.totalPoints;
  }

  return 0;
};

const rank = computed(() => {
  let points: any[] = [];
  let rank: Record<string, number> = {};

  if (!_isNil(stats.player?.battleTag)) {
    points.push({
      id: stats.player.battleTag,
      points: getPoints(stats.player),
    });
    for (const challenger of settings.data.challengers.filter(
      (v) => !_isNil(v),
    )) {
      points.push({
        id: challenger,
        points: getPoints(stats.challengers[challenger]),
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

const getNumberOfWeeksInMonth = (momentDate: Moment) => {
  const monthStartWeekNumber = momentDate.startOf("month").week();

  const distinctWeeks = {
    [monthStartWeekNumber]: true,
  };

  let startOfMonth = momentDate.clone().startOf("month");
  let endOfMonth = momentDate.clone().endOf("month");

  //  this is an 'inclusive' range -> iterates through all days of a month
  for (
    let day = startOfMonth.clone();
    !day.isAfter(endOfMonth);
    day.add(1, "days")
  ) {
    distinctWeeks[day.week()] = true;
  }

  return Object.keys(distinctWeeks).length;
};

const goal = computed(() => {
  let total = 0;
  let perDay = 0;

  const setGoalPerDay = settings.data.goal;

  if (!_isNil(stats.player)) {
    if (settings.data.mode === "week") {
      total = settings.data.goal * 7;
    } else if (settings.data.mode === "month") {
      total = setGoalPerDay * moment().daysInMonth();
    } else if (settings.data.mode === "season") {
      total = settings.duration * setGoalPerDay;
    }
  }
  return {
    total: Math.ceil(total),
    perDay: setGoalPerDay,
    perDayOfWeek: Math.ceil(total / 7),
  };
});
</script>

<template>
  <main v-if="stats.player" style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-row>
        <v-col cols="12" md="8">
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

          <v-col cols="12" v-if="!stats?.ongoing?.active">
            <v-sheet class="pa-8" elevation="5">
              <v-row>
                <v-col cols="12" md="6">
                  <v-col cols="12" class="text-center">
                    <div class="text-md-h5 text-h6">
                      Daily fill ({{ goal.perDay }} per day)
                    </div>
                    <ConfettiExplosion
                      :particelCount="300"
                      :stageWidth="2000"
                      :stageHeight="2000"
                      v-if="
                        settings.data.goal > 0 &&
                        stats.player.day.total > 0 &&
                        stats.player.day.total === goal.perDay
                      " />
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-progress-linear
                      :class="{
                        'disable-animation': true,
                        'text-white': stats.player.day.total >= goal.perDay,
                        'text-gray': stats.player.day.total < goal.perDay,
                      }"
                      striped
                      style="border: 1px solid gray"
                      :color="
                        stats.player.day.total >= goal.perDay
                          ? 'success'
                          : 'warning'
                      "
                      :model-value="stats.player.day.total"
                      :max="goal.perDay"
                      :height="50">
                      <template v-slot:default="{ value }">
                        <span class="text-gray text-h6"
                          >{{
                            _round((stats.player.day.total / goal.perDay) * 100)
                          }}
                          %</span
                        >
                      </template>
                    </v-progress-linear>
                  </v-col>
                  <v-col
                    cols="12"
                    class="text-center mt-5"
                    v-if="stats.player.day.total < goal.perDay">
                    <div class="text-h6">
                      Only
                      {{ goal.perDay - stats.player.day.total }}
                      game(s) left today - Go ladder!
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <WeeklyResultChart
                      :weekly="data"
                      :goal="goal.perDayOfWeek" />
                  </v-col>
                </v-col>
                <v-col cols="12" md="5">
                  <WeeklyGoalChart
                    :played="Number(data.total)"
                    :mode="settings.data.mode"
                    :goal="goal.total" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" v-if="data.total">
                  <span class="title"
                    >This {{ _capitalize(settings.data.mode) }} ({{
                      data.total
                    }}):</span
                  >
                  <ResultChart :result="data" />
                </v-col>
                <v-col cols="12" class="text-center" v-else>
                  <span class="text-h6"
                    >No games played yet this
                    {{ _capitalize(settings.data.mode) }} - There is no time
                    like the present!</span
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
                <v-col cols="12" v-if="settings.data.mmr && data.mmr">
                  <div class="text-h6">
                    {{ _capitalize(settings.data.mode) }}ly MMR Breakdown
                  </div>
                  <hr />
                  <v-row class="mt-2">
                    <v-col cols="12">
                      <section>
                        Calculated by taking average mmr gained over this
                        {{ settings.data.mode }}s
                        {{ data.mmr.averages.count }} game(s) played ({{
                          data.mmr.averages.win
                        }}
                        gained, {{ data.mmr.averages.loss }} lost).
                      </section>
                      <section>
                        This means that you are currently
                        {{
                          Math.sign(data.mmr.averages.gain) > 0
                            ? "gaining"
                            : "losing"
                        }}
                        <strong
                          >{{ Math.abs(data.mmr.averages.gain) }}MMR</strong
                        >
                        per game (on average)
                      </section>
                      <v-sheet
                        v-if="data.mmr.averages.gain > 0"
                        class="mt-1 text-green">
                        <section class="font-weight-bold">
                          On your current path it will take you
                          {{ numberOfGames(100, data.mmr.averages.gain) }}
                          games to increase your MMR by 100 points
                        </section>
                        <section
                          class="mt-1 font-weight-bold"
                          v-if="
                            settings.data?.mmr &&
                            settings.data.mmr > data.mmr.current
                          ">
                          And it will take you
                          {{
                            numberOfGames(
                              settings.data.mmr - data.mmr.current,
                              data.mmr.averages.gain,
                            )
                          }}
                          games to reach your current MMR goal of
                          {{ settings.data.mmr }} MMR.
                        </section>
                      </v-sheet>
                      <div
                        v-if="data.mmr.averages.gain < 0"
                        class="mt-1 text-red text-subtitle">
                        <section>
                          On your current path - you will have decreased your
                          MMR by 100 points after
                          {{ numberOfGames(100, data.mmr.averages.gain) }}
                          games.
                        </section>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>

          <v-col cols="12" v-if="settings.data.battleTag">
            <v-sheet class="pa-4" :elevation="5">
              <v-row>
                <v-col cols="12" md="3">
                  <div class="text-h6">Settings</div>
                  <hr color="darkgoldenrod" />
                </v-col>
                <v-col cols="12" md="9" />
                <v-col cols="12" md="4">
                  <v-text-field
                    variant="underlined"
                    hide-details
                    density="compact"
                    label="Your Ladder Goal: Daily Number Of Games"
                    v-model.trim="settings.data.goal"
                    clearable />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    variant="underlined"
                    hide-details
                    density="compact"
                    label="Your Ladder Goal: MMR"
                    v-model.trim="settings.data.mmr"
                    clearable />
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <v-radio-group inline v-model="settings.data.mode">
                    <v-radio
                      v-for="mode in settings.modes"
                      :label="_capitalize(mode)"
                      :value="mode"
                      density="comfortable" />
                  </v-radio-group>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" class="text-center">
                  <span style="vertical-align: middle; font-weight: bold">
                    Earn
                    <span style="color: goldenrod; font-weight: bold"
                      >points</span
                    >
                    and
                    <span style="color: darkgoldenrod; font-weight: bold"
                      >achievements</span
                    >
                    by playing ladder and add
                    <i class="font-weight-bold">challengers</i> to compare
                    yourself with your friends!
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <versus-banner
                    :player="stats.player"
                    :season-end="settings.end"
                    :rank="rank[stats.player.battleTag]" />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  v-for="(challenger, i) in settings.data.challengers">
                  <versus-banner
                    v-if="
                      !_isNil(challenger) &&
                      !_isNil(stats.challengers[challenger]?.battleTag)
                    "
                    :on-remove="
                      () => {
                        settings.data.challengers[i] = null;
                      }
                    "
                    :challenger="challenger"
                    :player="stats.challengers[challenger]"
                    :season-end="settings.end"
                    :rank="rank[challenger]" />
                  <versus-challenger
                    v-else
                    :loading="
                      !_isNil(challenger) &&
                      _isNil(stats.challengers[challenger]?.battleTag)
                    "
                    v-model="settings.data.challengers[i]" />
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
                          v-if="
                            !_isNil(data.mmr?.current) && data.mmr.current > 100
                          "
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
                            :from="data.mmr.current + stats.player.day.mmr.diff"
                            :to="data.mmr.current"
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
                                'text-green': (data?.mmr?.diff ?? 0) > 0,
                                'text-red': (data?.mmr?.diff ?? 0) < 0,
                              }">
                              <span v-if="(data?.mmr?.diff ?? 0) > 0">+</span
                              >{{ data?.mmr?.diff }}
                            </span>
                            This {{ settings.data.mode }}</span
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
                      <ResultChart :result="data.race?.[Race.Human]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                      <ResultChart :result="data.race?.[Race.Orc]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                      <ResultChart :result="data.race?.[Race.NightElf]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                      <ResultChart :result="data.race?.[Race.Undead]" />
                    </v-list-item>
                    <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                      <ResultChart :result="data.race?.[Race.Random]" />
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
                    :visible="Number(data.total) > 0"
                    :performance="data.performance ?? []"
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
