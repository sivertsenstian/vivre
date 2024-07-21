<script setup lang="ts">
import { computed, ref } from "vue";
import makrura from "@/assets/makrura.png";
import w3cicon from "@/assets/w3c.png";
import w3ciconDark from "@/assets/w3c_dark.png";
import Banner from "@/components/Banner.vue";
import { useEventsStore } from "@/stores/events";
import moment from "moment";
import _range from "lodash/range";
import _fill from "lodash/fill";
import _map from "lodash/map";
import _maxBy from "lodash/maxBy";
import _minBy from "lodash/minBy";
import _round from "lodash/round";
import ConfettiExplosion from "vue-confetti-explosion";

const events = useEventsStore();
const start = moment("10.07.2024", "DD.MM.YYYY").startOf("day");
const today = moment().add(1, "day").startOf("day");
const days = today.diff(start, "days");

// Chart stuff
import { Bar, Line } from "vue-chartjs";
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
import _take from "lodash/take";
import _takeWhile from "lodash/takeWhile";
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

const numberOfGames = (target: number, avg: number) =>
  Math.abs(Math.ceil(target / avg));

const win = computed(() => {
  const wins: any[] = events.accounts.reduce(
    (s: any[], a: string) => [
      ...s,
      ...events.matches.filter((m) => getwins(a, m)),
    ],
    [],
  );
  return _maxBy(wins, (m) => m.teams[0].players[0].mmrGain);
});

const loss = computed(() => {
  const losses: any[] = events.accounts.reduce(
    (s: any[], a: string) => [
      ...s,
      ...events.matches.filter((m) => getloss(a, m)),
    ],
    [],
  );

  return _minBy(losses, (m) => m.teams[1].players[0].mmrGain);
});

const stealer = computed(() => {
  const loss: any[] = events.accounts.reduce(
    (s: any[], a: string) => [
      ...s,
      ...events.matches.filter((m) => getloss(a, m)),
    ],
    [],
  );

  const players = _groupBy(loss, (m) => m.teams[0].players[0].battleTag);

  const result = _map(players, (games, opponent) => {
    const lost = games.reduce((s, m) => s + m.teams[1].players[0].mmrGain, 0);
    return { opponent, lost, games };
  });

  return _minBy(result, (r) => r.lost);
});

const donater = computed(() => {
  const wins: any[] = events.accounts.reduce(
    (s: any[], a: string) => [
      ...s,
      ...events.matches.filter((m) => getwins(a, m)),
    ],
    [],
  );

  const players = _groupBy(wins, (m) => m.teams[1].players[0].battleTag);

  const result = _map(players, (games, opponent) => {
    const gained = games.reduce((s, m) => s + m.teams[0].players[0].mmrGain, 0);
    return { opponent, gained, games };
  });

  return _maxBy(result, (r) => r.gained);
});

const hitmen = computed(() => {
  const loss: any[] = events.accounts
    .reduce(
      (s: any[], a: string) => [
        ...s,
        ...events.matches.filter((m) => getloss(a, m)),
      ],
      [],
    )
    .sort((a: any, b: any) => moment(b.endTime).diff(moment(a.endTime)));

  return _take(loss, 5);
});

let duration = ref(
  moment.utc(moment().diff(events?.ongoing?.start)).format("mm:ss"),
);
setInterval(() => {
  duration.value = moment
    .utc(moment().diff(events?.ongoing?.start))
    .format("mm:ss");
}, 1000);

const open = (path: string) => window.open(path, "_blank");

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const daysToGoal = computed(() => {
  if (events.loaded >= 3) {
    const d = Math.ceil(
      numberOfGames(3000 - events.prediction.current, events.prediction.gain) /
        (events.prediction.count / days),
    );

    return { days: d, date: moment().add(d, "days").startOf("day") };
  }

  return { days: 0, date: null };
});

// Counter
const dayz = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

setInterval(() => {
  if (daysToGoal.value.date) {
    const currentDate = moment();
    const p = (daysToGoal.value.date as any) - (currentDate as any);
    seconds.value = parseInt((p / 1000) as any);
    minutes.value = parseInt((seconds.value / 60) as any);
    hours.value = parseInt((minutes.value / 60) as any);
    dayz.value = parseInt((hours.value / 24) as any);
  }
}, 1000);
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-progress-linear indeterminate v-if="events.loaded < 3" />
    <v-container fluid style="opacity: 0.9" v-if="events.loaded >= 3">
      <v-row>
        <v-col cols="12">
          <v-sheet class="pa-5" elevation="5">
            <v-row>
              <v-col cols="12">
                <div class="text-h4">
                  <span class="text-gold">Happy's Road To 3000 MMR</span> -
                  <v-progress-circular
                    class="mr-2 elementToFadeInAndOut"
                    :model-value="100"
                    :rotate="360"
                    :size="25"
                    :width="12.5"
                    :color="events.ongoing.active ? 'green' : 'red'"
                  >
                  </v-progress-circular>
                  <span
                    v-if="!events.ongoing.active"
                    class="text-red text-h5"
                    style="vertical-align: middle"
                    >taking a breather...</span
                  >
                  <span v-else class="text-h5 text-green"
                    >currently playing on '{{
                      events.ongoing.player.battleTag
                    }}'
                    <ConfettiExplosion
                      :particelCount="300"
                      :stageWidth="2000"
                      :stageHeight="2000"
                    />
                  </span>
                </div>
                <hr />
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="6" class="d-flex align-center">
                    <section>
                      <span
                        class="text-h4 mr-1"
                        style="vertical-align: middle"
                        >{{ events.matches.length }}</span
                      >
                      <span
                        class="text-subtitle-1"
                        style="vertical-align: middle"
                      >
                        Games played since ban was lifted on
                        {{ start.format("dddd, MMMM Do") }}
                      </span>
                    </section>
                  </v-col>
                  <v-col cols="6" v-if="seconds >= 0">
                    <v-col cols="12" class="d-flex">
                      <v-card class="ml-auto mr-2" width="150px" weight="120px">
                        <v-card-text>
                          <p
                            class="text-h2 text--primary text-center font-weight-regular"
                          >
                            {{ dayz % 365 }}
                          </p>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn block variant="text" color="green-accent-4">
                            DAYS
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                      <v-card class="mx-2" width="150px" weight="120px">
                        <v-card-text>
                          <p
                            class="text-h2 text--primary text-center font-weight-regular"
                          >
                            {{ hours % 24 }}
                          </p>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn block variant="text" color="green-accent-4">
                            HOURS
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                      <v-card class="mx-2" width="150px" weight="120px">
                        <v-card-text>
                          <p
                            class="text-h2 text--primary text-center font-weight-regular"
                          >
                            {{ minutes % 60 }}
                          </p>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn block variant="text" color="green-accent-4">
                            MINUTES
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                      <v-card class="mr-auto ml-2" width="150px" weight="120px">
                        <v-card-text>
                          <p
                            class="text-h2 text--primary text-center font-weight-regular"
                          >
                            {{ seconds % 60 }}
                          </p>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn block variant="text" color="green-accent-4">
                            SECONDS
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6" class="text-center">
                    <v-card elevation="0">
                      <v-list>
                        <v-list-subheader class="justify-space-around"
                          >Recent games
                        </v-list-subheader>
                      </v-list>
                      <v-list-item v-for="game in _take(events.matches, 5)">
                        <v-list-item-title
                          class="ml-2"
                          v-if="iswin(game, ...events.accounts)"
                        >
                          <span class="mr-5">
                            {{ moment(game.endTime).fromNow() }}:</span
                          >
                          <img
                            style="vertical-align: middle"
                            width="30px"
                            :src="raceIcon[game.teams[0].players[0].race]"
                          />
                          <a
                            class="text-green-lighten-1"
                            :href="`https://www.w3champions.com/player/${encodeURIComponent(
                              game.teams[0].players[0].battleTag,
                            )}`"
                            target="_blank"
                          >
                            <strong>
                              {{ game.teams[0].players[0].name }}
                            </strong>
                          </a>

                          vs.

                          <img
                            style="vertical-align: middle"
                            width="30px"
                            :src="raceIcon[game.teams[1].players[0].race]"
                          />
                          <a
                            class="text-red-lighten-1"
                            :href="`https://www.w3champions.com/player/${encodeURIComponent(
                              game.teams[1].players[0].battleTag,
                            )}`"
                            target="_blank"
                          >
                            <strong>
                              {{ game.teams[1].players[0].name }}
                            </strong>
                          </a>

                          <span class="text-green">
                            +{{
                              Math.ceil(game.teams[0].players[0].mmrGain)
                            }}
                            MMR {{
                          }}</span>
                          <v-btn
                            @click="
                              () =>
                                open(
                                  `https://www.w3champions.com/match/${game.id}`,
                                )
                            "
                            title="go to match"
                            size="x-small"
                            color="orange"
                            icon="mdi-link"
                            variant="text"
                          />
                        </v-list-item-title>
                        <v-list-item-title class="ml-2" v-else>
                          <span class="mr-5">
                            {{ moment(game.endTime).fromNow() }}:</span
                          >
                          <img
                            style="vertical-align: middle"
                            width="30px"
                            :src="raceIcon[game.teams[1].players[0].race]"
                          />
                          <a
                            class="text-red-lighten-1"
                            :href="`https://www.w3champions.com/player/${encodeURIComponent(
                              game.teams[1].players[0].battleTag,
                            )}`"
                            target="_blank"
                          >
                            <strong>
                              {{ game.teams[1].players[0].name }}
                            </strong>
                          </a>

                          vs.

                          <img
                            style="vertical-align: middle"
                            width="30px"
                            :src="raceIcon[game.teams[0].players[0].race]"
                          />
                          <a
                            class="text-green-lighten-1"
                            :href="`https://www.w3champions.com/player/${encodeURIComponent(
                              game.teams[0].players[0].battleTag,
                            )}`"
                            target="_blank"
                          >
                            <strong>
                              {{ game.teams[0].players[0].name }}
                            </strong>
                          </a>

                          <span class="text-red ml-2">
                            {{ Math.ceil(game.teams[1].players[0].mmrGain) }}
                            MMR {{
                          }}</span>
                          <v-btn
                            @click="
                              () =>
                                open(
                                  `https://www.w3champions.com/match/${game.id}`,
                                )
                            "
                            title="go to match"
                            size="x-small"
                            color="orange"
                            icon="mdi-link"
                            variant="text"
                          />
                        </v-list-item-title>
                      </v-list-item>
                    </v-card>
                  </v-col>

                  <v-fade-transition>
                    <v-col cols="6" v-if="events.ongoing.active">
                      <v-sheet :elevation="0">
                        <v-row>
                          <v-col cols="12" class="text-center">
                            <v-col cols="12">
                              <span class="text-h6 font-weight-bold"
                                >Now playing a game on '{{
                                  events.ongoing?.map
                                }}' : {{ duration }}</span
                              >
                              <v-btn
                                @click="
                                  () =>
                                    open(
                                      `https://www.w3champions.com/match/${events.ongoing.id}`,
                                    )
                                "
                                title="go to match"
                                size="x-small"
                                color="orange"
                                icon="mdi-link"
                                variant="text"
                              />
                            </v-col>
                            <v-col cols="12">
                              <span
                                class="text-h5"
                                style="vertical-align: text-top"
                                >Vs.
                              </span>
                              <img
                                class="mx-2"
                                style="vertical-align: middle"
                                width="70px"
                                :src="raceIcon[events.ongoing.opponent.race]"
                              />
                              <span
                                class="text-h5"
                                style="vertical-align: text-top"
                              >
                                {{ events.ongoing.opponent?.name }} ({{
                                  events.ongoing.opponent?.oldMmr
                                }})</span
                              >
                            </v-col>
                          </v-col>

                          <v-col cols="12" class="text-center">
                            <div>
                              <span
                                class="text-caption font-weight-bold"
                                v-if="events.ongoing.history.last.length"
                                >Last
                                {{ events.ongoing.history.last.length }} game(s)
                                vs opponent:
                              </span>
                              <span
                                class="text-caption font-weight-bold"
                                v-else
                              >
                                First Game This Season vs Opponent!
                              </span>
                              <template
                                v-for="(result, i) in events.ongoing.history
                                  .last"
                              >
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
                            <div
                              class="text-caption text-green font-weight-bold mt-3 text-right"
                            >
                              Gained {{ events.ongoing.history.mmr.gain }} MMR
                            </div>
                            <div
                              class="text-caption text-red font-weight-bold text-right"
                            >
                              Lost {{ events.ongoing.history.mmr.loss }} MMR
                            </div>
                          </v-col>
                        </v-row>
                      </v-sheet>
                    </v-col>
                  </v-fade-transition>
                </v-row>

                <section>
                  <div class="text-h5 mt-5">Prediction</div>
                  <hr />
                  <v-row>
                    <v-col cols="12" v-if="events.prediction.count">
                      <section>
                        Calculated by taking average mmr gained over all
                        {{ events.prediction.count }} games played since ban ({{
                          events.prediction.winCount
                        }}
                        wins, {{ events.prediction.lossCount }} losses,
                        {{ events.prediction.win }}mmr gained,
                        {{ events.prediction.loss }}
                        mmr lost), for the currently highest account:
                        <strong style="color: goldenrod">{{
                          events.highest
                        }}</strong>
                      </section>
                      <section>
                        This means that he is currently
                        {{
                          Math.sign(events.prediction.gain) > 0
                            ? "gaining"
                            : "losing"
                        }}
                        <strong
                          >{{ Math.abs(events.prediction.gain) }}MMR</strong
                        >
                        per game (on average)
                      </section>
                      <v-sheet
                        v-if="events.prediction.gain > 0"
                        class="mt-1 text-green"
                      >
                        <section class="mt-1 font-weight-bold">
                          And it will take him
                          {{
                            numberOfGames(
                              3000 - events.prediction.current,
                              events.prediction.gain,
                            )
                          }}
                          games to reach 3000 MMR.
                        </section>
                        <section>
                          He is currently playing
                          <strong>
                            {{ Math.ceil(events.prediction.count / days) }}
                          </strong>
                          games per day (on average) So he only needs another
                          <strong>{{ daysToGoal.days }}</strong>
                          days if he keeps this up!
                        </section>
                      </v-sheet>
                      <div
                        v-if="events.prediction.gain < 0"
                        class="mt-1 text-red text-subtitle"
                      >
                        <section>
                          Will not make it with the current trend! MMR will
                          decrease by 100 points after
                          {{ numberOfGames(100, events.prediction.gain) }}
                          games if this continues!
                        </section>
                      </div>
                    </v-col>
                  </v-row>
                </section>
              </v-col>

              <v-col cols="12" class="text-center">
                <span class="text-h6"
                  >Remaining points to reach 3000 MMR Goal</span
                >
                <v-progress-linear
                  color="green"
                  :model-value="
                    (Math.max(
                      ...events.accounts.map(
                        (a) => events.data[a].season.summary.mmr.current,
                      ),
                    ) /
                      3000) *
                    100
                  "
                  height="30"
                >
                  <template v-slot:default="{ value }">
                    <strong>
                      {{
                        Math.max(
                          ...events.accounts.map(
                            (a) => events.data[a].season.summary.mmr.current,
                          ),
                        )
                      }}
                      / 3000 {{ Math.ceil(value) }}%</strong
                    >
                  </template>
                </v-progress-linear>
              </v-col>

              <v-col cols="4" v-for="(account, i) in events.accounts">
                <Banner
                  :race="events.data[account].race"
                  :current="events.data[account].season.summary.mmr.current"
                  :label="account"
                  :highlight="account === events.highest"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="4"
                style="height: 300px"
                v-for="account in events.accounts"
              >
                <Bar
                  :data="{
                    labels: _range(0, days)
                      .map((n) => {
                        return moment().subtract(n, 'days').startOf('day');
                      })
                      .reverse(),
                    datasets: [
                      {
                        type: 'line' as any,
                        yAxisID: 'mmrAxis',
                        backgroundColor: 'lime',
                        borderColor: 'green',
                        data: events.data[account].season[Race.Undead].matches
                          .filter((m: any) => moment(m.endTime).isAfter(start))
                          .reverse()
                          ?.reduce(
                            (r: number[], m: any) => {
                              const d = moment(m.endTime).dayOfYear();
                              const day = days - (today.dayOfYear() - d);
                              const p = getplayer(account)(m);
                              const mmr = p.players[0].currentMmr;

                              for (let i = day; i < r.length; i++) {
                                r[i] = mmr;
                              }

                              return r;
                            },
                            _fill(
                              _range(
                                today.dayOfYear() - days,
                                today.dayOfYear(),
                              ),
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
                        data: events.data[account].season[Race.Undead].matches
                          .filter((m: any) => moment(m.endTime).isAfter(start))
                          .filter((m: any) => getwins(account, m))
                          ?.reduce(
                            (r: number[], m: any) => {
                              const d = moment(m.endTime).dayOfYear();
                              const day = days - (today.dayOfYear() - d);

                              r[day]++;
                              return r;
                            },
                            _fill(
                              _range(
                                today.dayOfYear() - days,
                                today.dayOfYear(),
                              ),
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
                        data: events.data[account].season[Race.Undead].matches
                          .filter((m: any) => moment(m.endTime).isAfter(start))
                          .filter((m: any) => getloss(account, m))
                          ?.reduce(
                            (r: number[], m: any) => {
                              const d = moment(m.endTime).dayOfYear();
                              const day = days - (today.dayOfYear() - d);

                              r[day]++;
                              return r;
                            },
                            _fill(
                              _range(
                                today.dayOfYear() - days,
                                today.dayOfYear(),
                              ),
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
                                _range(
                                  context.chart.data.datasets[0].data.length,
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

                            const s = r > 0 && r < 100 ? String(r) + '%' : '';
                            return s;
                          },
                        },
                      },
                    ],
                  }"
                  :options="options"
                />
                <span class="unbanned">UNBANNED</span>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3" v-if="win" class="text-center">
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
                    variant="text"
                  />
                </div>
                <div class="title mb-2">
                  {{ moment(win.endTime).format("dddd, MMMM Do, HH:mm:ss") }}
                </div>
                <img
                  style="vertical-align: middle"
                  width="50px"
                  :src="raceIcon[win.teams[1].players[0].race]"
                />
                <div class="title">
                  <a
                    :href="`https://www.w3champions.com/player/${encodeURIComponent(
                      win.teams[1].players[0].battleTag,
                    )}`"
                    target="_blank"
                  >
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

              <v-col cols="3" v-if="loss" class="text-center">
                <div class="font-weight-bold text-red">
                  BIGGEST LOSS
                  <v-btn
                    @click="
                      () => open(`https://www.w3champions.com/match/${loss.id}`)
                    "
                    title="go to match"
                    size="x-small"
                    color="orange"
                    icon="mdi-link"
                    variant="text"
                  />
                </div>
                <div class="title mb-2">
                  {{ moment(loss.endTime).format("dddd, MMMM Do, HH:mm:ss") }}
                </div>
                <img
                  style="vertical-align: middle"
                  width="50px"
                  :src="raceIcon[loss.teams[0].players[0].race]"
                />
                <div class="title">
                  <a
                    :href="`https://www.w3champions.com/player/${encodeURIComponent(
                      loss.teams[0].players[0].battleTag,
                    )}`"
                    target="_blank"
                  >
                    <strong> {{ loss.teams[0].players[0].battleTag }}</strong>
                  </a>
                </div>
                <div class="title text-red">
                  LOST {{ Math.abs(loss.teams[1].players[0].mmrGain) }} MMR
                </div>
                <div class="text-grey">
                  on {{ loss.teams[1].players[0].name }}
                </div>
              </v-col>

              <v-col cols="3" v-if="donater" class="text-center">
                <div class="font-weight-bold text-green">MMR DONATOR</div>
                <div class="title mb-2">
                  {{ donater.games.length }} games won
                </div>
                <img
                  style="vertical-align: middle"
                  width="50px"
                  :src="raceIcon[donater.games[0].teams[1].players[0].race]"
                />
                <div class="title">
                  <a
                    :href="`https://www.w3champions.com/player/${encodeURIComponent(
                      donater.opponent,
                    )}`"
                    target="_blank"
                  >
                    <strong> {{ donater.opponent }}</strong>
                  </a>
                </div>

                <div class="title text-green">
                  GAINED {{ donater.gained }} MMR
                </div>
              </v-col>

              <v-col cols="3" v-if="stealer" class="text-center">
                <div class="font-weight-bold text-red">MMR STEALER</div>
                <div class="title mb-2">
                  {{ stealer.games.length }} games lost
                </div>
                <img
                  style="vertical-align: middle"
                  width="50px"
                  :src="raceIcon[stealer.games[0].teams[0].players[0].race]"
                />
                <div class="title">
                  <a
                    :href="`https://www.w3champions.com/player/${encodeURIComponent(
                      stealer.opponent,
                    )}`"
                    target="_blank"
                  >
                    <strong> {{ stealer.opponent }}</strong>
                  </a>
                </div>
                <div class="title text-red">
                  LOST {{ Math.abs(stealer.lost) }} MMR
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="7">
                <v-card elevation="0">
                  <v-list>
                    <v-list-subheader>Recent HITMEN</v-list-subheader>
                  </v-list>
                  <v-list-item v-for="game in hitmen">
                    <template v-slot:prepend>
                      <img
                        style="vertical-align: middle"
                        width="40px"
                        :src="raceIcon[game.teams[0].players[0].race]"
                      />
                    </template>

                    <v-list-item-title class="ml-2">
                      <a
                        :href="`https://www.w3champions.com/player/${encodeURIComponent(
                          game.teams[0].players[0].battleTag,
                        )}`"
                        target="_blank"
                      >
                        <strong>
                          {{ game.teams[0].players[0].battleTag }}
                        </strong>
                      </a>
                      <span>
                        //
                        {{
                          moment(game.endTime).format("dddd, MMMM Do, HH:mm:ss")
                        }}</span
                      >
                      <span class="text-red ml-2"
                        >Lost
                        {{ Math.ceil(game.teams[1].players[0].mmrGain) }}
                        MMR</span
                      >
                      <span class="text-grey ml-2"
                        >on {{ game.teams[1].players[0].name }}</span
                      >
                      <v-btn
                        @click="
                          () =>
                            open(`https://www.w3champions.com/match/${game.id}`)
                        "
                        title="go to match"
                        size="x-small"
                        color="orange"
                        icon="mdi-link"
                        variant="text"
                      />
                    </v-list-item-title>
                  </v-list-item>
                </v-card>
              </v-col>
              <v-col cols="5">
                <v-list lines="one" style="overflow: hidden">
                  <v-list>
                    <v-list-subheader
                      >Race stats for all accounts</v-list-subheader
                    >
                  </v-list>
                  <v-list-item :prepend-avatar="raceIcon[Race.Human]">
                    <ResultChart :result="events.race[Race.Human]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Orc]">
                    <ResultChart :result="events.race[Race.Orc]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.NightElf]">
                    <ResultChart :result="events.race[Race.NightElf]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Undead]">
                    <ResultChart :result="events.race[Race.Undead]" />
                  </v-list-item>
                  <v-list-item :prepend-avatar="raceIcon[Race.Random]">
                    <ResultChart :result="events.race[Race.Random]" />
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-sheet class="pa-8" elevation="5">
            <v-row>
              <v-col cols="6" class="text-left">
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
                        :src="isDark ? w3ciconDark : w3cicon"
                      />
                    </span>
                  </v-col>
                  <v-col cols="12">
                    <a href="https://www.twitch.tv/saulapeman" target="_blank">
                      CLICK HERE - And follow this EXCITING journey
                      <strong>LIVE</strong> with mr saul apeman</a
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="text-right">
                <span style="vertical-align: middle"
                  >Proudly sponsored by MAKRURA
                </span>
                <img
                  class="ml-3"
                  style="vertical-align: middle"
                  :src="makrura"
                />
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
</style>
