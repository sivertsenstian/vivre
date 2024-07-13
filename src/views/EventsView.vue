<script setup lang="ts">
import { computed, type Ref, ref } from "vue";
import makrura from "@/assets/makrura.png";
import Banner from "@/components/Banner.vue";
import { useEventsStore } from "@/stores/events";
import moment from "moment";
import _range from "lodash/range";
import _fill from "lodash/fill";
import _map from "lodash/map";
import _maxBy from "lodash/maxBy";
import _minBy from "lodash/minBy";
import ConfettiExplosion from "vue-confetti-explosion";

const events = useEventsStore();
const start = moment([2024, 6, 9]);
const today = moment();
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
import { getloss, getplayer, getwins } from "@/utilities/matchcalculator";
import { Race, raceIcon } from "@/stores/races";
import _groupBy from "lodash/groupBy";

ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
);
const options = {
  animation: false,
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      type: "time",
      time: { unit: "day" },
    },
    mmrAxis: {
      stacked: false,
      beginAtZero: false,
      grid: { display: false },
    },
    gamesAxis: { stacked: false, beginAtZero: true, grid: { display: false } },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          if (context.dataset.yAxisID === "mmrAxis") {
            return `${context.formattedValue} MMR`;
          }

          if (context.dataset.yAxisID === "gamesAxis") {
            return `${context.formattedValue} Games Played On This Day`;
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

let duration = ref(
  moment.utc(moment().diff(events?.ongoing?.start)).format("mm:ss"),
);
setInterval(() => {
  duration.value = moment
    .utc(moment().diff(events?.ongoing?.start))
    .format("mm:ss");
}, 1000);
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container
      fluid
      style="opacity: 0.9"
      v-if="events.accounts?.every((account) => events.data?.[account])"
    >
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
                <section>
                  <span class="text-h4" style="vertical-align: middle">{{
                    events.matches.length
                  }}</span>
                  Games played since ban on {{ start.format("DD. MMMM") }} -
                  across all accounts
                </section>
                <section>
                  <div class="text-h5 mt-5">Prediction</div>
                  <hr />
                  <v-row>
                    <v-col cols="12">
                      <section>
                        Calculated by taking average mmr gained over this weeks
                        {{
                          events.data[events.highest].week.mmr.averages.count
                        }}
                        games played ({{
                          events.data[events.highest].week.mmr.averages.win
                        }}
                        gained,
                        {{ events.data[events.highest].week.mmr.averages.loss }}
                        lost), for the currently highest account
                        <strong style="color: goldenrod">{{
                          events.highest
                        }}</strong>
                      </section>
                      <section>
                        This means that he is currently
                        {{
                          Math.sign(
                            events.data[events.highest].week.mmr.averages.gain,
                          ) > 0
                            ? "gaining"
                            : "losing"
                        }}
                        <strong
                          >{{
                            Math.abs(
                              events.data[events.highest].week.mmr.averages
                                .gain,
                            )
                          }}MMR</strong
                        >
                        per game (on average)
                      </section>
                      <v-sheet
                        v-if="
                          events.data[events.highest].week.mmr.averages.gain > 0
                        "
                        class="mt-1 text-green"
                      >
                        <section class="mt-1 font-weight-bold">
                          And it will take him
                          {{
                            numberOfGames(
                              3000 -
                                events.data[events.highest].week.mmr.current,
                              events.data[events.highest].week.mmr.averages
                                .gain,
                            )
                          }}
                          games to reach 3000 MMR.
                        </section>
                      </v-sheet>
                      <div
                        v-if="
                          events.data[events.highest].week.mmr.averages.gain < 0
                        "
                        class="mt-1 text-red text-subtitle"
                      >
                        <section>
                          Will not make it with the current trend! MMR will
                          decrease by 100 points after
                          {{
                            numberOfGames(
                              100,
                              events.data[events.highest].week.mmr.averages
                                .gain,
                            )
                          }}
                          games if this continues!
                        </section>
                      </div>
                    </v-col>
                  </v-row>
                </section>
              </v-col>

              <v-col cols="12" v-if="events.ongoing.active">
                <v-sheet :elevation="0">
                  <v-row>
                    <v-col cols="8" class="text-center">
                      <v-col cols="12">
                        <span class="text-h6 font-weight-bold"
                          >Current game on '{{ events.ongoing?.map }}' :
                          {{ duration }}</span
                        >
                      </v-col>
                      <v-col cols="12">
                        <span class="text-h5" style="vertical-align: text-top"
                          >Vs.
                        </span>
                        <img
                          class="mx-2"
                          style="vertical-align: middle"
                          width="70px"
                          :src="raceIcon[events.ongoing.opponent.race]"
                        />
                        <span class="text-h5" style="vertical-align: text-top">
                          {{ events.ongoing.opponent?.name }} ({{
                            events.ongoing.opponent?.oldMmr
                          }})</span
                        >
                      </v-col>
                    </v-col>

                    <v-col cols="4">
                      <v-col cols="12" class="text-right">
                        <div>
                          <span
                            class="text-caption font-weight-bold"
                            v-if="events.ongoing.history.last.length"
                            >Last
                            {{ events.ongoing.history.last.length }} game(s) vs
                            opponent:
                          </span>
                          <span class="text-caption font-weight-bold" v-else>
                            First Game This Season vs Opponent!
                          </span>
                          <template
                            v-for="result in events.ongoing.history.last"
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
                          class="text-caption text-green font-weight-bold mt-3"
                        >
                          Gained {{ events.ongoing.history.mmr.gain }} MMR
                        </div>
                        <div class="text-caption text-red font-weight-bold">
                          Lost {{ events.ongoing.history.mmr.loss }} MMR
                        </div>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>

              <v-col cols="12">
                <span class="float-right text-h6"
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
                              const day = days - (today.dayOfYear() - d) - 1;
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
                      },
                      {
                        yAxisID: 'gamesAxis',
                        backgroundColor: 'orange',
                        data: events.data[account].season[Race.Undead].matches
                          .filter((m: any) => moment(m.endTime).isAfter(start))
                          ?.reduce(
                            (r: number[], m: any) => {
                              const d = moment(m.endTime).dayOfYear();
                              const day = days - (today.dayOfYear() - d) - 1;

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
                      },
                    ],
                  }"
                  :options="options"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3" v-if="win" class="text-center">
                <div class="font-weight-bold text-green">BIGGEST WIN</div>
                <div class="title mb-2">
                  {{ moment(win.endTime).format("dddd d. MMMM - HH:mm:ss") }}
                </div>
                <img
                  style="vertical-align: middle"
                  width="50px"
                  :src="raceIcon[win.teams[1].players[0].race]"
                />
                <div class="title">
                  <strong>{{ win.teams[1].players[0].battleTag }}</strong>
                </div>
                <div class="title text-green">
                  GAINED {{ win.teams[0].players[0].mmrGain }} MMR
                </div>
                <div class="text-grey">
                  on {{ win.teams[0].players[0].name }}
                </div>
              </v-col>

              <v-col cols="3" v-if="loss" class="text-center">
                <div class="font-weight-bold text-red">BIGGEST LOSS</div>
                <div class="title mb-2">
                  {{ moment(loss.endTime).format("dddd d. MMMM - HH:mm:ss") }}
                </div>
                <img
                  style="vertical-align: middle"
                  width="50px"
                  :src="raceIcon[loss.teams[0].players[0].race]"
                />
                <div class="title">
                  <strong>{{ loss.teams[0].players[0].battleTag }}</strong>
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
                  <strong>{{ donater.opponent }}</strong>
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
                  <strong>{{ stealer.opponent }}</strong>
                </div>
                <div class="title text-red">
                  LOST {{ Math.abs(stealer.lost) }} MMR
                </div>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-right">
          <v-sheet class="pa-8" elevation="5">
            <span style="vertical-align: middle"
              >Proudly sponsored by MAKRURA
            </span>
            <img class="ml-3" style="vertical-align: middle" :src="makrura" />
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
</style>
