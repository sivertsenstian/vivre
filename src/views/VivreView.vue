<script setup lang="ts">
import live_explain_dark from "@/assets/live_help_dark.png";
import live_explain from "@/assets/live_help.png";
import { computed, onMounted, onUnmounted, ref } from "vue";
import NumberAnimation from "vue-number-animation";
import moment from "moment";
import _round from "lodash/round";
import _capitalize from "lodash/capitalize";
import _fromPairs from "lodash/fromPairs";
import ConfettiExplosion from "vue-confetti-explosion";
import ResultChart from "@/components/ResultChart.vue";
import WeeklyGoalChart from "@/components/WeeklyGoalChart.vue";
import WeeklyResultChart from "@/components/WeeklyResultChart.vue";
import Performance from "@/components/Performance.vue";
import VersusBanner from "@/components/versus/VersusBanner.vue";
import PlayerSearch from "@/components/PlayerSearch.vue";
import PlayerRace from "@/components/PlayerRace.vue";
import { useSettingsStore } from "@/stores/settings";
import { useLiveStore } from "@/stores/live";
import { useSeasonStore } from "@/stores/season";
import { Race, raceIcon } from "@/stores/races";

const settings = useSettingsStore();
const live = useLiveStore();
const season = useSeasonStore();

import hu_banner from "@/assets/take_a_look_at_banner_michael.png";
import r_banner from "@/assets/take_a_look_at_banner_random.png";
import ud_banner from "@/assets/take_a_look_at_banner_undead.png";
import ne_banner from "@/assets/take_a_look_at_banner_nightelf.png";
import oc_banner from "@/assets/take_a_look_at_banner_orc.png";
import VersusChallenger from "@/components/versus/VersusChallenger.vue";
import { useTheme } from "vuetify";
import _isNil from "lodash/isNil";
import type { IRaceStatistics, IStatistics } from "@/utilities/types.ts";
import _sortBy from "lodash/sortBy";
import MapLink from "@/components/MapLink.vue";
import {
  current_season,
  duration,
  days_since_start,
  start,
  start_color,
  end_color,
} from "@/utilities/constants";
import w3ciconDark from "@/assets/w3c_dark.png";
import OngoingMatch from "@/components/live/OngoingMatch.vue";

const raceBanner: any = {
  [Race.Human]: hu_banner,
  [Race.Orc]: oc_banner,
  [Race.Undead]: ud_banner,
  [Race.NightElf]: ne_banner,
  [Race.Random]: r_banner,
};

const ranks = [
  { name: "Grandmaster", icon: "mdi-trophy-award", color: "#FFD700" },
  { name: "Master", icon: "mdi-trophy", color: "#CB3A1F" },
  { name: "Adept", icon: "mdi-trophy-outline", color: "#EB42EF" },
  { name: "Diamond", icon: "mdi-diamond", color: "#b9f2ff" },
  { name: "Platinum", icon: "mdi-gold", color: "#e5e4e2" },
  { name: "Gold", icon: "mdi-gold", color: "#FFD700" },
  { name: "Silver", icon: "mdi-gold", color: "#C0C0C0" },
  { name: "Bronze", icon: "mdi-gold", color: "#CD7F32" },
  { name: "Grass", icon: "mdi-grass", color: "#136d15" },
];

const openw3cprofile = (battleTag: string) =>
  window.open(
    `https://www.w3champions.com/player/${encodeURIComponent(battleTag)}`,
    "_blank",
  );

const numberOfGames = (target: number, avg: number) =>
  Math.abs(Math.ceil(target / avg));

const data = computed<Partial<IRaceStatistics>>(() => {
  let d: Partial<IRaceStatistics> = { wins: 0, loss: 0, total: 0 };
  if (!_isNil(season.player)) {
    if (settings.data.mode === "week") {
      d = season.player.week;
    } else if (settings.data.mode === "month") {
      d = season.player.month;
    } else if (settings.data.mode === "season") {
      d = season.player.season[season.player.race];
    }

    if (d.mmr?.current === 0) {
      d.mmr = season.player.season[season.player.race]?.mmr ?? {};
    }
  }

  return d;
});

const getPoints = (v: IStatistics) => {
  if (_isNil(v)) {
    return 0;
  }
  return v.season?.[v.race]?.totalPoints ?? 0;
};

const rank = computed(() => {
  let points: any[] = [];
  let rank: Record<string, number> = {};

  if (!_isNil(season.player?.battleTag)) {
    points.push({
      id: season.player.battleTag,
      points: getPoints(season.player),
    });
    for (const challenger of settings.data.challengers.filter(
      (v) => !_isNil(v),
    )) {
      points.push({
        id: challenger,
        points: getPoints(live.challengers[challenger]),
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

const goal = computed(() => {
  let total = 0;

  const setGoalPerDay = settings.data.goal;

  if (!_isNil(season.player)) {
    if (settings.data.mode === "week") {
      total = settings.data.goal * 7;
    } else if (settings.data.mode === "month") {
      total = setGoalPerDay * moment().daysInMonth();
    } else if (settings.data.mode === "season") {
      total = duration * setGoalPerDay;
    }
  }
  return {
    total: Math.ceil(total),
    perDay: setGoalPerDay,
    perDayOfWeek: Math.ceil(total / 7),
  };
});

const challengers = computed(() => {
  return [season.player?.battleTag, ...settings.data.challengers].sort(
    (a, b) => (rank.value?.[a ?? ""] ?? 0) - (rank.value[b ?? ""] ?? 0),
  );
});

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

onMounted(() => {
  live.subscribe();
  season.subscribe();
});

onUnmounted(() => {
  live.unsubscribe();
  season.unsubscribe();
});
</script>

<template>
  <main v-if="season.player" style="height: 100vh; overflow-y: auto">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="8">
          <v-col cols="12">
            <v-sheet class="pa-8" elevation="5" v-if="settings.data.battleTag">
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
                        season.player.day.total > 0 &&
                        season.player.day.total === goal.perDay
                      " />
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <v-progress-linear
                      :class="{
                        'disable-animation': true,
                        'text-white': season.player.day.total >= goal.perDay,
                        'text-gray': season.player.day.total < goal.perDay,
                      }"
                      striped
                      style="border: 1px solid gray"
                      :color="
                        season.player.day.total >= goal.perDay
                          ? end_color
                          : start_color
                      "
                      :model-value="season.player.day.total"
                      :max="goal.perDay"
                      :height="50">
                      <template v-slot:default="{ value }">
                        <span class="text-gray text-h6"
                          >{{
                            _round(
                              (season.player.day.total / goal.perDay) * 100,
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
                    v-if="season.player.day.total < goal.perDay">
                    <div class="text-h6">
                      Only
                      {{ goal.perDay - season.player.day.total }}
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
                  <div style="float: right">
                    <ongoing-match :game="live.ongoing" />
                  </div>
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
                <v-col cols="12" v-if="season.player.day.total">
                  <span class="title"
                    >Today ({{ season.player.day.total }}):</span
                  >
                  <ResultChart :result="season.player.day" />
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

            <v-sheet class="pa-8" elevation="5" v-else>
              <v-row>
                <v-col cols="12">
                  <v-img
                    :src="isDark ? live_explain_dark : live_explain"
                    width="100%"
                    cover />
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

              <v-row v-if="season.player.battleTag">
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
                <v-col
                  cols="12"
                  md="4"
                  v-for="(challenger, i) in challengers.filter(
                    (c) =>
                      !_isNil(c) &&
                      (!_isNil(live.challengers[c]?.battleTag) ||
                        c === season.player?.battleTag),
                  )">
                  <versus-banner
                    v-if="challenger === season.player.battleTag"
                    :player="season.player"
                    :season-start="start"
                    :rank="rank[season.player.battleTag]" />
                  <versus-banner
                    v-else
                    :on-remove="
                      () => {
                        settings.data.challengers =
                          settings.data.challengers.map((c) =>
                            c === challenger ? null : c,
                          );
                      }
                    "
                    :challenger="challenger"
                    :player="live.challengers[challenger!]"
                    :season-start="start"
                    :rank="rank[challenger!]" />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  v-for="(challenger, i) in settings.data.challengers.filter(
                    (c) => _isNil(c) || _isNil(live.challengers[c]?.battleTag),
                  )">
                  <versus-challenger
                    :loading="
                      !_isNil(challenger) &&
                      _isNil(live.challengers[challenger]?.battleTag)
                    "
                    v-model="
                      settings.data.challengers[
                        settings.data.challengers.findIndex(_isNil)
                      ]
                    " />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-col>
        <v-col cols="12" md="4" class="order-md-last order-first">
          <v-col cols="12">
            <v-sheet class="pa-4" :elevation="5">
              <div class="text-h6 text-center">
                <v-card elevation="0">
                  <v-row>
                    <v-col cols="9">
                      <player-search />
                    </v-col>
                    <v-col cols="3">
                      <player-race />
                    </v-col>
                  </v-row>
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
                          :src="raceBanner[season.player.race]" />
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
                            :src="raceIcon[season.player.race]" />
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
                            :from="
                              data.mmr.current + season.player.day.mmr.diff
                            "
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
                                'text-green': season.player?.day?.mmr.diff > 0,
                                'text-red': season.player?.day?.mmr.diff < 0,
                              }">
                              <span v-if="season.player?.day?.mmr.diff > 0"
                                >+</span
                              >
                              {{ season.player?.day?.mmr.diff }}
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
                        <v-col cols="12" class="mt-1 pb-0 mb-0">
                          <div style="font-size: 16px" class="mb-3">
                            Highest this season:
                            <strong style="font-size: 18px">
                              {{
                                season.player?.season?.[season.player.race]?.mmr
                                  .max
                              }}
                              MMR</strong
                            >
                          </div>
                          <div
                            v-if="live.ranking?.[season.player.race]?.rank"
                            class="fade-in"
                            style="vertical-align: middle; font-weight: bold">
                            <v-icon
                              class="mx-1"
                              style="vertical-align: middle"
                              size="x-large"
                              :icon="
                                ranks?.[
                                  live.ranking?.[season.player.race]?.league
                                ]?.icon
                              "
                              :color="
                                ranks?.[
                                  live.ranking?.[season.player.race]?.league
                                ]?.color
                              " />
                            <span
                              :style="{
                                'vertical-align': 'middle',
                                color:
                                  ranks?.[
                                    live.ranking?.[season.player.race]?.league
                                  ]?.color,
                              }"
                              class="mx-1 mt-1 d-inline-block"
                              >{{
                                ranks?.[
                                  live.ranking?.[season.player.race]?.league
                                ]?.name
                              }}
                              <span
                                v-if="
                                  live.ranking?.[season.player.race]?.division >
                                  0
                                ">
                                {{
                                  live.ranking?.[season.player.race]?.division
                                }}
                              </span>
                            </span>
                            <span
                              style="vertical-align: middle; color: #eee"
                              class="mt-1 d-inline-block">
                              #{{
                                live.ranking?.[season.player.race]?.rank
                              }}</span
                            >
                          </div>
                        </v-col>
                        <v-col
                          class="fade-in"
                          cols="12"
                          v-if="live.ranking?.[season.player.race]?.level">
                          <v-row>
                            <v-col cols="12" class="py-0" style="height: 40px">
                              <v-progress-linear
                                class="level-progress mt-2"
                                height="25"
                                :max="1"
                                :min="0"
                                buffer-color="#FFD700"
                                buffer-opacity="1"
                                :buffer-value="
                                  live.ranking?.[season.player.race]
                                    ?.levelProgressRecent ?? 0
                                "
                                :model-value="
                                  live.ranking?.[season.player.race]
                                    ?.levelProgress ?? 0
                                " />
                              <span class="level-label" style="height: 0"
                                >Level
                                {{
                                  live.ranking?.[season.player.race]
                                    ?.levelLabel ?? 0
                                }}</span
                              >
                              <div
                                style="
                                  position: relative;
                                  bottom: 40px;
                                  left: 130px;
                                  height: 0;
                                "
                                v-if="
                                  live.ranking?.[season.player.race]
                                    ?.levelProgressRecent >
                                  live.ranking?.[season.player.race]
                                    ?.levelProgress
                                ">
                                <ConfettiExplosion
                                  :colors="[
                                    'goldenrod',
                                    'darkgoldenrod',
                                    'silver',
                                    'gold',
                                  ]" />
                              </div>
                              <div
                                v-if="
                                  live.ranking?.[season.player.race]
                                    ?.levelProgressRecent >
                                  live.ranking?.[season.player.race]
                                    ?.levelProgress
                                "
                                class="gained"
                                style="
                                  position: relative;
                                  bottom: 40px;
                                  left: 0px;
                                  height: 0;
                                ">
                                <h1 class="my-0 font-weight-bold">
                                  {{
                                    (
                                      live.ranking[season.player.race]
                                        .levelProgressRecent *
                                        100 -
                                      live.ranking[season.player.race]
                                        .levelProgress *
                                        100
                                    ).toFixed(1)
                                  }}% XP
                                </h1>
                                <h4 class="ml-4 my-0 font-weight-bold">
                                  EARNED
                                </h4>
                              </div>
                            </v-col>
                            <v-col
                              cols="12"
                              class="12 d-flex justify-center my-0 py-0">
                              <div class="text-grey mr-4">
                                Progress
                                {{
                                  (
                                    live.ranking?.[season.player.race]
                                      ?.levelProgressRecent * 100
                                  ).toFixed(1)
                                }}%
                              </div>
                              <div
                                style="color: gold"
                                v-if="
                                  live.ranking?.[season.player.race]
                                    ?.levelProgressRecent >
                                  live.ranking?.[season.player.race]
                                    ?.levelProgress
                                ">
                                +{{
                                  (
                                    (live.ranking?.[season.player.race]
                                      ?.levelProgressRecent -
                                      live.ranking?.[season.player.race]
                                        ?.levelProgress) *
                                    100
                                  ).toFixed(1)
                                }}% from last game
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pa-0 ma-0">
                          <v-btn
                            title="Open W3Champions Profile Page"
                            color="transparent"
                            block
                            variant="flat"
                            @click="
                              () => openw3cprofile(settings.data.battleTag)
                            "
                            ><img :src="w3ciconDark" height="22px"
                          /></v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card-item>
                </v-card>
              </div>
            </v-sheet>
            <v-progress-linear
              class="season-progress"
              :model-value="(days_since_start / duration) * 100"
              :color="start_color"
              :title="`The current season (${current_season}) is ${Math.round((days_since_start / duration) * 100)}% done - ${duration - days_since_start} day(s) left`">
            </v-progress-linear>
            <span class="season-progress-label"
              >{{ duration - days_since_start }} day(s) left of the current
              season</span
            >
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
                    :today="season.player.day.total" />
                </v-col>
                <v-col cols="12">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th></th>
                        <th style="width: 60%" class="text-center" />
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(map, name) in data.maps">
                        <td class="font-weight-bold">
                          <map-link :name="name" />
                        </td>
                        <td class="text-center text-green">
                          <ResultChart :result="map" />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
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
:root {
  --level-start-color: rgb(192 110 72);
  --level-end-color: rgb(247 203 94);
}

.season-progress-label {
  bottom: 21px;
  left: 2px;
  display: block;
  height: 0;
  position: relative;
  font-size: 11px;
  color: var(--level-start-color);
  filter: brightness(2);
}

.season-progress {
  transition: border-color 1.5s ease-in-out;
  &:hover {
    border: 1px solid var(--level-start-color);
  }
}

.level-progress {
  border: 1px solid transparent;
  background-color: transparent;
  border-radius: 3px;

  .v-progress-linear__determinate {
    background-image: linear-gradient(
        to right,
        var(--level-start-color),
        var(--level-end-color)
      ),
      url("@/assets/player-level-background.jpg");
    background-size: cover;
    background-position: center;
  }

  .v-progress-linear__buffer {
    box-shadow: 0px 0px 15px 10px var(--level-end-color) !important;
    filter: brightness(1.5);
    animation: pulse 3s infinite ease-in-out;
    opacity: 0.9;
  }
}

.gained {
  color: gold;

  opacity: 0;
  animation: fade 5s ease-in-out;
  animation-iteration-count: 1;
  text-shadow:
    0 0 20px #fff,
    0 0 30px gold,
    0 0 40px gold,
    0 0 50px gold,
    0 0 60px gold,
    0 0 70px gold,
    0 0 80px gold;
}

.level-label {
  font-size: 14px;
  font-weight: bold;
  position: relative;
  left: 0px;
  bottom: 22px;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 0.8;
  }
}

@keyframes fade {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
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

.fade-in {
  animation: fade-in 0.5s;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 100;
  }
}
</style>
