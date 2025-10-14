<script setup lang="ts">
import { computed, ref } from "vue";
import makrura from "@/assets/makrura.png";
import trophy from "@/assets/events/trophy.jpg";
import confetti from "@/assets/events/confetti.png";
import w3cicon from "@/assets/w3c.png";
import w3ciconDark from "@/assets/w3c_dark.png";
import Banner from "@/components/Banner.vue";
import { useHappyStore } from "@/stores/happy";
import moment from "moment";
import _range from "lodash/range";
import _fill from "lodash/fill";
import _map from "lodash/map";
import _isEmpty from "lodash/isEmpty";
import _maxBy from "lodash/maxBy";
import _toPairs from "lodash/toPairs";
import _minBy from "lodash/minBy";
import _round from "lodash/round";
import ConfettiExplosion from "vue-confetti-explosion";

const events = useHappyStore();
const start = moment("10.07.2024", "DD.MM.YYYY").startOf("day");
const end = moment("21.08.2024", "DD.MM.YYYY").startOf("day");
const today = moment().add(1, "day").startOf("day");
const days = today.diff(start, "days");

// Chart stuff
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  LineController,
} from "chart.js";
import "chartjs-adapter-moment";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  getloss,
  getplayer,
  getwins,
  iswin,
} from "@/utilities/matchcalculator";
import { Race, raceIcon } from "@/stores/races";
import _groupBy from "lodash/groupBy";
import ResultChart from "@/components/ResultChart.vue";
import { useTheme } from "vuetify";

ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  ChartDataLabels,
);
const options = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      type: "time",
      time: {
        unit: "day",
      },
    },
    mmrAxis: {
      suggestedMin: 2700,
      suggestedMax: 3000,
      stacked: false,
      beginAtZero: false,
      grid: { display: false },
    },
    gamesAxis: {
      suggestedMax: 20,
      stacked: true,
      beginAtZero: true,
      grid: { display: false },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          if (context.dataset.yAxisID === "mmrAxis") {
            return `${context.formattedValue} MMR`;
          }

          if (context.dataset.yAxisID === "gamesAxis") {
            return `${context.formattedValue} - games ${context.dataset.label} on this day`;
          }

          return context.formttedValue;
        },
      },
    },
  },
} as any;

const finished = computed(() =>
  events.matches.filter(
    (m: any) =>
      moment(m.endTime).isAfter(start) && moment(m.endTime).isBefore(end),
  ),
);

const wins = computed(() => {
  return finished.value.filter((m) =>
    events.accounts.some((a) => getwins(a, m)),
  );
});

const losses = computed(() => {
  return finished.value.filter((m) =>
    events.accounts.some((a) => getloss(a, m)),
  );
});

const win = computed(() => {
  const wins: any[] = finished.value.filter((m) => getwins("Cacxa26#2948", m));
  return _maxBy(wins, (m) => m.teams[0].players[0].mmrGain);
});

const donater = computed(() => {
  const wins: any[] = finished.value.filter((m) => getwins("Cacxa26#2948", m));

  const players = _groupBy(wins, (m) => m.teams[1].players[0].battleTag);

  const result = _map(players, (games, opponent) => {
    const gained = games.reduce((s, m) => s + m.teams[0].players[0].mmrGain, 0);
    return { opponent, gained, games };
  });

  return _maxBy(result, (r) => r.gained);
});

const streak = computed(() => {
  const games: any[] = finished.value.filter(
    (m) => getwins("Cacxa26#2948", m) || getloss("Cacxa26#2948", m),
  );
  let mmr1 = 0;
  let mmr2 = 0;
  let v1 = 0;
  let v2 = 0;

  for (let i = 0; i < games.length; i++) {
    if (iswin(games[i], "Cacxa26#2948")) {
      v2++;
      mmr2 += games[i].teams[0].players[0].mmrGain;
    } else {
      v1 = v1 > v2 ? v1 : v2;
      mmr1 = v1 > v2 ? mmr1 : mmr2;
      v2 = 0;
      mmr2 = 0;
    }
  }

  return {
    games: v1,
    mmr: mmr1,
  };
});

const bestday = computed(() => {
  const r = events.data["Cacxa26#2948"].season[Race.Undead].matches
    .filter(
      (m: any) =>
        moment(m.endTime).isAfter(start) && moment(m.endTime).isBefore(end),
    )
    .reverse()
    ?.reduce((r: any, m: any) => {
      const d = moment(m.endTime).format("DD.MM.YYYY");
      const p = getplayer("Cacxa26#2948")(m);
      r[d] = (r[d] ?? 0) + p.players[0].mmrGain;
      return r;
    }, {});

  return _maxBy(_toPairs(r));
});

const open = (path: string) => window.open(path, "_blank");

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

// MMR
const scores = computed(() => {
  const r = events.accounts.reduce(
    (s, a) => {
      const h =
        _maxBy(
          finished.value.map((m: any) => getplayer(a)(m)),
          (p: any) => p?.players?.[0]?.currentMmr ?? 0,
        ) ?? {};
      const l =
        _minBy(
          finished.value.map((m: any) => getplayer(a)(m)),
          (p: any) => p?.players?.[0]?.currentMmr ?? 9999,
        ) ?? {};

      s.lowest =
        s.lowest.currentMmr < l.players[0].currentMmr
          ? s.lowest
          : { ...l.players[0], match: l.match };

      s.highest =
        s.highest.currentMmr > h.players[0].currentMmr
          ? s.highest
          : { ...h.players[0], match: h.match };

      s.goal =
        _isEmpty(s.goal) && h.players[0].currentMmr >= 3000
          ? { ...h.players[0], match: h.match }
          : {};

      return s;
    },
    { lowest: {} as any, highest: {} as any, goal: {} as any },
  );

  return r as any;
});

// Race
const raceTab = ref<"all" | "pro">("all");

// Goal
const explode = ref(true);
setInterval(() => {
  explode.value = !explode.value;
}, 2000);
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-progress-linear indeterminate v-if="events.loaded < 3" />
    <v-container fluid style="opacity: 0.9" v-if="events.loaded >= 3">
      <v-row>
        <v-col cols="12">
          <v-sheet class="pa-5" elevation="5">
            <v-row>
              <v-col cols="12" class="text-center">
                <span
                  class="text-h2"
                  style="color: goldenrod; font-family: Britannic"
                  >Congratulations Happy!</span
                >
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-card
                  :elevation="20"
                  style="border: 3px solid goldenrod"
                  rounded="xl"
                  class="pa-5 text-center">
                  <img
                    :src="confetti"
                    width="100%"
                    height="100%"
                    style="
                      position: absolute;
                      left: 0;
                      top: 0;
                      object-fit: cover;
                      object-position: center center;
                      opacity: 0.7;
                    " />
                  <v-card-title
                    class="text-h2"
                    style="color: goldenrod; font-family: Britannic">
                    He did it!
                    <hr style="color: goldenrod" class="mt-2" />
                  </v-card-title>
                  <v-card-item>
                    <ConfettiExplosion
                      :duration="2000"
                      :particelCount="400"
                      :stageHeight="1000"
                      v-if="explode" />
                    <ConfettiExplosion
                      :duration="2000"
                      :particelCount="400"
                      :stageHeight="1000"
                      v-if="!explode"
                      style="float: right" />
                    <img :src="trophy" width="300px" class="rounded-xl" />
                    <div
                      style="
                        height: 0;
                        display: block;
                        position: relative;
                        left: 20px;
                        bottom: 135px;
                        scale: 0.7;
                      ">
                      <Banner
                        :race="events.data[events.highest].race"
                        :current="scores.highest.currentMmr"
                        :label="scores.highest.battleTag" />
                    </div>
                  </v-card-item>
                  <span
                    class="text-h3"
                    style="
                      height: 0;
                      display: block;
                      color: goldenrod;
                      font-family: Britannic !important;
                      position: relative;
                      bottom: 30px;
                      z-index: 9999;
                    "
                    >{{
                      moment(scores.goal?.match?.endTime ?? new Date()).format(
                        "DD.MM.YYYY HH:mm:ss",
                      )
                    }}</span
                  >
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-center">
                <span
                  class="text-h2"
                  style="color: goldenrod; font-family: Britannic"
                  >Happy reached his goal of 3000 MMR!</span
                >
                <v-col cols="12" md="12" class="text-center">
                  <div class="text-h5 mt-5">
                    Some stats since his unban on
                    {{ start.format("dddd, MMMM Do") }} where he started with
                    {{
                      getplayer("Cacxa26#2948")(
                        events.data["Cacxa26#2948"].season[Race.Undead].matches
                          .filter(
                            (m: any) =>
                              moment(m.endTime).isAfter(start) &&
                              moment(m.endTime).isBefore(end),
                          )
                          .reverse()[0],
                      )?.players[0].oldMmr
                    }}
                    MMR until he reached his goal
                  </div>
                </v-col>
              </v-col>
              <v-col cols="12" style="height: 300px">
                <Bar
                  :data="{
                    labels: _range(0, end.diff(start, 'days'))
                      .map((n) => {
                        return moment(end)
                          .subtract(n + 1, 'days')
                          .startOf('day');
                      })
                      .reverse(),
                    datasets: [
                      {
                        type: 'line' as any,
                        yAxisID: 'mmrAxis',
                        backgroundColor: 'lime',
                        borderColor: 'green',
                        data: events.data['Cacxa26#2948'].season[
                          Race.Undead
                        ].matches
                          .filter(
                            (m: any) =>
                              moment(m.endTime).isAfter(start) &&
                              moment(m.endTime).isBefore(end),
                          )
                          .reverse()
                          ?.reduce(
                            (r: number[], m: any) => {
                              const startDay = start.dayOfYear();
                              const matchDay = moment(m.endTime).dayOfYear();
                              const actual = matchDay - startDay; // index placement in current array

                              const p = getplayer('Cacxa26#2948')(m);
                              const mmr = p.players[0].currentMmr;

                              const result = r.map((v, i) => {
                                if (i >= actual) {
                                  return mmr;
                                }
                                return v;
                              });

                              return result;
                            },
                            _fill(
                              _range(end.dayOfYear(), start.dayOfYear()),
                              0,
                            ),
                          ),
                        datalabels: {
                          display: false,
                        },
                      },
                      {
                        label: 'won',
                        yAxisID: 'gamesAxis',
                        backgroundColor: '#66BB6A',
                        data: events.data['Cacxa26#2948'].season[
                          Race.Undead
                        ].matches
                          .filter(
                            (m: any) =>
                              moment(m.endTime).isAfter(start) &&
                              moment(m.endTime).isBefore(end),
                          )
                          .filter((m: any) => getwins('Cacxa26#2948', m))
                          ?.reduce(
                            (r: number[], m: any) => {
                              const startDay = start.dayOfYear();
                              const matchDay = moment(m.endTime).dayOfYear();
                              const actual = matchDay - startDay; // index placement in current array

                              const result = r.map((v, i) => {
                                if (i === actual) {
                                  return v + 1;
                                }
                                return v;
                              });

                              return result;
                            },
                            _fill(
                              _range(end.dayOfYear(), start.dayOfYear()),
                              0,
                            ),
                          )
                          .map((v: number) => v),
                        datalabels: {
                          display: false,
                        },
                      },
                      {
                        label: 'lost',
                        yAxisID: 'gamesAxis',
                        backgroundColor: '#EF5350',
                        data: events.data['Cacxa26#2948'].season[
                          Race.Undead
                        ].matches
                          .filter(
                            (m: any) =>
                              moment(m.endTime).isAfter(start) &&
                              moment(m.endTime).isBefore(end),
                          )
                          .filter((m: any) => getloss('Cacxa26#2948', m))
                          ?.reduce(
                            (r: number[], m: any) => {
                              const startDay = start.dayOfYear();
                              const matchDay = moment(m.endTime).dayOfYear();
                              const actual = matchDay - startDay; // index placement in current array

                              const result = r.map((v, i) => {
                                if (i === actual) {
                                  return v + 1;
                                }
                                return v;
                              });

                              return result;
                            },
                            _fill(
                              _range(end.dayOfYear(), start.dayOfYear()),
                              0,
                            ),
                          )
                          .map((v: number) => v),
                        datalabels: {
                          clip: false,
                          clamp: false,
                          anchor: 'end',
                          align: 'end',
                          offset: -7,
                          color: 'goldenrod',
                          formatter: function (value, context) {
                            const all = context.chart.data.datasets
                              .filter((d: any) => d.yAxisID === 'gamesAxis')
                              .map((d: any) => d.data)
                              .reduce(
                                (s: number[], d: number[]) =>
                                  s.map((v, i) => v + d[i]),
                                _fill(
                                  _range(
                                    0,
                                    context.chart.data.datasets[0].data.length,
                                  ),
                                  0,
                                ),
                              );

                            const r = _round(
                              ((all[context.dataIndex] -
                                Number(
                                  context.dataset.data[context.dataIndex],
                                )) /
                                all[context.dataIndex]) *
                                100,
                              1,
                            );

                            return r > 0 && r < 100 ? r + '%' : '';
                          },
                        },
                      },
                    ],
                  }"
                  :options="options" />
                <span class="unbanned">UNBANNED</span>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-center" style="font-size: 20px">
                He got
                <span style="color: goldenrod; font-weight: bolder">{{
                  scores.highest.currentMmr
                }}</span>
                MMR on
                <span style="color: goldenrod">{{
                  scores.highest.battleTag
                }}</span>
                on
                <strong>{{
                  moment(scores.goal?.match?.endTime ?? new Date()).format(
                    "DD.MM.YYYY HH:mm:ss",
                  )
                }}</strong
                >, he reached his goal battling
                <span class="text-green-lighten-2">{{
                  scores.goal?.match?.teams[1].players[0].battleTag
                }}</span>
                on {{ scores.goal?.match?.mapName }}
                where he got
                <span class="text-green font-weight-bold"
                  >+{{ scores.goal?.match?.teams[0].players[0].mmrGain }}</span
                >
                MMR
                <v-btn
                  @click="
                    () =>
                      open(
                        `https://www.w3champions.com/match/${scores.goal?.match?.id}`,
                      )
                  "
                  title="go to match"
                  size="x-small"
                  color="orange"
                  icon="mdi-link"
                  variant="text" />
              </v-col>

              <v-col cols="6" class="text-center text-h5">
                He played <strong>{{ finished.length }}</strong> games in total
                to reach his goal. With
                <span class="text-green font-weight-bold">{{
                  wins.length
                }}</span>
                wins and
                <span class="text-red font-weight-bold">{{
                  losses.length
                }}</span>
                losses
              </v-col>
              <v-col cols="6" class="text-center text-h5">
                <section>
                  On
                  <span style="color: goldenrod">{{
                    scores.highest.battleTag
                  }}</span>
                  he played
                  <strong>{{
                    finished.filter(
                      (m: any) =>
                        getwins(scores.highest.battleTag, m) ||
                        getloss(scores.highest.battleTag, m),
                    ).length
                  }}</strong>
                  games,
                  <span class="text-green font-weight-bold">{{
                    finished.filter((m: any) =>
                      getwins(scores.highest.battleTag, m),
                    ).length
                  }}</span>
                  wins and
                  <span class="text-red font-weight-bold">{{
                    finished.filter((m: any) =>
                      getloss(scores.highest.battleTag, m),
                    ).length
                  }}</span>
                  losses.
                </section>
                <section>
                  <span class="text-grey">
                    Spending
                    {{
                      _round(
                        finished
                          .filter(
                            (m: any) =>
                              getwins(scores.highest.battleTag, m) ||
                              getloss(scores.highest.battleTag, m),
                          )
                          .reduce((s, m) => {
                            return (
                              s +
                              moment
                                .duration(moment(m.endTime).diff(m.startTime))
                                .asHours()
                            );
                          }, 0),
                      )
                    }}
                    hours in-game to achieve this!
                  </span>
                </section>
              </v-col>
              <v-col cols="12" class="text-center text-h5"
                >His longest WIN streak was
                <span style="color: goldenrod; font-weight: bolder">{{
                  streak.games
                }}</span>
                games! Giving him a total of
                <strong class="text-green">{{ streak.mmr }}</strong> MMR!
              </v-col>
              <v-col cols="12" class="text-center text-h5"
                >His BEST day was
                <strong>{{ bestday?.[0] }}</strong>
                Where he gained a total of
                <strong class="text-green">{{ bestday?.[1] }}</strong> MMR!
              </v-col>

              <v-col cols="6" v-if="win" class="text-center">
                <div class="font-weight-bold text-green">
                  BIGGEST WIN
                  <v-btn
                    @click="
                      () => open(`https://www.w3champions.com/match/${win.id}`)
                    "
                    title="go to match"
                    size="x-small"
                    color="orange"
                    icon="mdi-link"
                    variant="text" />
                </div>
                <div class="title mb-2">
                  {{ moment(win.endTime).format("dddd, MMMM Do, HH:mm:ss") }}
                </div>
                <img
                  style="vertical-align: middle"
                  width="75px"
                  :src="raceIcon[win.teams[1].players[0].race]" />
                <div class="title">
                  <a
                    :href="`https://www.w3champions.com/player/${encodeURIComponent(
                      win.teams[1].players[0].battleTag,
                    )}`"
                    target="_blank">
                    <strong> {{ win.teams[1].players[0].battleTag }}</strong>
                  </a>
                </div>
                <div class="title text-green">
                  GAINED {{ win.teams[0].players[0].mmrGain }} MMR
                </div>
                <div class="text-grey">
                  on {{ win.teams[0].players[0].name }}
                </div>
              </v-col>

              <v-col cols="6" v-if="donater" class="text-center">
                <div class="font-weight-bold text-green">MMR DONATOR</div>
                <div class="title mb-2">
                  {{ donater.games.length }} games won
                </div>
                <img
                  style="vertical-align: middle"
                  width="75px"
                  :src="raceIcon[donater.games[0].teams[1].players[0].race]" />
                <div class="title">
                  <a
                    :href="`https://www.w3champions.com/player/${encodeURIComponent(
                      donater.opponent,
                    )}`"
                    target="_blank">
                    <strong> {{ donater.opponent }}</strong>
                  </a>
                </div>

                <div class="title text-green">
                  GAINED {{ donater.gained }} MMR
                </div>
                <div class="text-grey">
                  on {{ win.teams[0].players[0].name }}
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="10" class="text-center mx-auto">
                <div class="text-h5 mb-5">
                  Summary for games on all accounts for the entire run
                </div>
                <ResultChart percentage :result="events.games.after" />
              </v-col>
              <v-col cols="8" class="mx-auto">
                <v-tabs
                  align-tabs="center"
                  fixed-tabs
                  v-model="raceTab"
                  slider-color="#daa520"
                  class="mb-2">
                  <v-tab
                    class="text-none"
                    text="Race stats vs everyone"
                    value="all"></v-tab>
                  <v-tab
                    class="text-none"
                    text="vs. pro players (>2500 MMR)"
                    value="pro"></v-tab>
                </v-tabs>

                <v-window v-model="raceTab">
                  <v-window-item value="all">
                    <v-list lines="one" style="overflow: hidden">
                      <v-list-item :prepend-avatar="raceIcon[Race.Human]">
                        <ResultChart
                          percentage
                          :result="events.race[Race.Human]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                        <ResultChart
                          percentage
                          :result="events.race[Race.Orc]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                        <ResultChart
                          percentage
                          :result="events.race[Race.NightElf]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                        <ResultChart
                          percentage
                          :result="events.race[Race.Undead]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                        <ResultChart
                          percentage
                          :result="events.race[Race.Random]" />
                      </v-list-item>
                    </v-list>
                  </v-window-item>

                  <v-window-item value="pro">
                    <v-list lines="one" style="overflow: hidden">
                      <v-list-item :prepend-avatar="raceIcon[Race.Human]">
                        <ResultChart
                          percentage
                          :result="events.race.pro[Race.Human]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                        <ResultChart
                          percentage
                          :result="events.race.pro[Race.Orc]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                        <ResultChart
                          percentage
                          :result="events.race.pro[Race.NightElf]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                        <ResultChart
                          percentage
                          :result="events.race.pro[Race.Undead]" />
                      </v-list-item>
                      <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                        <ResultChart
                          percentage
                          :result="events.race.pro[Race.Random]" />
                      </v-list-item>
                    </v-list>
                  </v-window-item>
                </v-window>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-sheet class="pa-8" elevation="5">
            <v-row>
              <v-col cols="12" md="6" class="text-center">
                <v-row>
                  <v-col cols="12">
                    <span style="vertical-align: bottom">
                      Made possible by the amazing work done by
                    </span>
                    <span style="vertical-align: text-bottom">
                      <img
                        @click="open('https://www.w3champions.com')"
                        class="ml-1"
                        height="25px"
                        style="vertical-align: middle; cursor: pointer"
                        :src="isDark ? w3ciconDark : w3cicon" />
                    </span>
                  </v-col>
                  <v-col cols="12">
                    <a href="https://www.twitch.tv/saulapeman" target="_blank">
                      It was covered
                      <strong>LIVE</strong> by mr saul apeman</a
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <span style="vertical-align: middle"
                  >Proudly sponsored by MAKRURA
                </span>
                <img
                  title="MAKRURA for you!"
                  @click="
                    () => open('https://www.youtube.com/watch?v=NiHjhgbOHH8')
                  "
                  class="ml-3 makrura"
                  style="vertical-align: middle"
                  :src="makrura" />
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<style scoped>
.elementToFadeInAndOut {
  -webkit-animation: fadeinout 2s linear infinite;
  animation: fadeinout 2s linear infinite;
  opacity: 0;
}

@-webkit-keyframes fadeinout {
  50% {
    opacity: 1;
  }
}

@keyframes fadeinout {
  50% {
    opacity: 1;
  }
}

.text-gold {
  vertical-align: middle;
  font-size: 30px;
  color: goldenrod;
}

.unbanned {
  font-weight: bolder;
  color: red;
  position: relative;
  height: 0;
  left: 70px;
  bottom: 7px;
}

.makrura {
  transition: border-color 0.4s ease-in-out;
  cursor: pointer;
  border: 2px solid transparent;
}

.makrura:hover {
  opacity: 0.9;
  border: 2px solid goldenrod;
}
</style>
