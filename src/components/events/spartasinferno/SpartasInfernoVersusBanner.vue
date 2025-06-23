<script setup lang="ts">
import { Race, raceIcon } from "@/stores/races";
import banner_hu from "@assets/kreisliga/si_banner_hu.png";
import banner_ne from "@assets/kreisliga/si_banner_ne.png";
import banner_ud from "@assets/kreisliga/si_banner_ud.png";
import banner_oc from "@assets/kreisliga/si_banner_oc.png";
import banner_rnd from "@assets/kreisliga/si_banner_rd.png";
import _range from "lodash/range";
import moment from "moment/moment";
import { getloss, getplayer, getwins } from "@/utilities/matchcalculator";
import _fill from "lodash/fill";
import w3ciconDark from "@/assets/w3c_dark.png";

const raceBanner: any = {
  [Race.Human]: banner_hu,
  [Race.NightElf]: banner_ne,
  [Race.Undead]: banner_ud,
  [Race.Orc]: banner_oc,
  [Race.Random]: banner_rnd,
};

const raceColor: any = {
  [Race.Human]: "#e8b453",
  [Race.NightElf]: "#6a5693",
  [Race.Undead]: "#5198ba",
  [Race.Orc]: "#7b1414",
  [Race.Random]: "#59524A",
};

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
import { computed } from "vue";
import _groupBy from "lodash/groupBy";
import _first from "lodash/first";
import _last from "lodash/last";
import _take from "lodash/take";
import _skip from "lodash/drop";
import type { Moment } from "moment";

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
  maintainAspectRatio: true,
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      type: "time",
      time: {
        unit: "day",
      },
      display: false,
    },
    mmrAxis: {
      suggestedMin: 800,
      suggestedMax: 1800,
      stacked: false,
      beginAtZero: false,
      grid: { display: false },
      display: false,
    },
    gamesAxis: {
      suggestedMax: 10,
      stacked: true,
      beginAtZero: true,
      grid: { display: false },
      display: false,
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
// End

interface Props {
  player: any;
  banner?: string;
  onRemove?: () => void;
  mode?: string;
  highlight?: string;
  rank: number;
  seasonStart: Moment;
  streaming?: boolean;
  laddering?: boolean;
  winner?: boolean;
  dates: any;
}
const props = withDefaults(defineProps<Props>(), {
  mode: "season",
});

const data = computed(() => {
  if (props.mode === "week") {
    return props.player.week;
  } else if (props.mode === "month") {
    return props.player.month;
  } else if (props.mode === "season") {
    return props.player.race
      ? props.player.season[props.player.race]
      : props.player.season.summary;
  }
  return {};
});

const mmr = computed(() => {
  const getPlayer = getplayer(props.player.battleTag);
  if (data.value?.matches.length) {
    const g = _groupBy(data.value?.matches, (m) => {
      const d = moment(m.endTime).dayOfYear() - 1;
      const y = moment(m.endTime).year();
      const yd =
        props.dates.today.year() > y
          ? moment().year(y).isLeapYear()
            ? 366
            : 365
          : 0;

      return (
        props.dates.daysSinceStart - (props.dates.today.dayOfYear() - d) - yd
      );
    });

    const initial = getPlayer(_last(g[Object.keys(g)[0]]))?.players[0].oldMmr;
    const v = _fill(
      _range(
        props.dates.today.dayOfYear() - props.dates.daysSinceStart,
        props.dates.today.dayOfYear(),
      ),
      initial,
    );

    for (let i = 0; i < v.length; i++) {
      let m = _first(g[i]);
      if (m !== undefined) {
        const p = getPlayer(m);
        v[i] = p.players[0].currentMmr;
      } else if (i > 0) {
        v[i] = v[i - 1];
      }
    }

    return v;
  }

  return _fill(
    _range(
      props.dates.today.dayOfYear() - props.dates.daysSinceStart,
      props.dates.today.dayOfYear(),
    ),
    0,
  );
});

const wins = computed(() => {
  return data.value?.matches
    .filter((m: any) => getwins(props.player.battleTag, m))
    ?.reduce(
      (r: number[], m: any) => {
        const d = moment(m.endTime).dayOfYear() - 1;
        const y = moment(m.endTime).year();
        const yd =
          props.dates.end.year() > y
            ? moment().year(y).isLeapYear()
              ? 366
              : 365
            : 0;
        const day =
          props.dates.daysSinceStart - (props.dates.today.dayOfYear() - d) - yd;

        r[day]++;

        return r;
      },
      _fill(
        _range(
          props.dates.today.dayOfYear() - props.dates.daysSinceStart,
          props.dates.today.dayOfYear(),
        ),
        0,
      ),
    )
    .map((v: number) => v);
});

const loss = computed(() => {
  return data.value?.matches
    ?.filter((m: any) => getloss(props.player.battleTag, m))
    ?.reduce(
      (r: number[], m: any) => {
        const d = moment(m.endTime).dayOfYear() - 1;
        const y = moment(m.endTime).year();
        const yd =
          props.dates.today.year() > y
            ? moment().year(y).isLeapYear()
              ? 366
              : 365
            : 0;
        const day =
          props.dates.daysSinceStart - (props.dates.today.dayOfYear() - d) - yd;

        r[day]++;
        return r;
      },
      _fill(
        _range(
          props.dates.today.dayOfYear() - props.dates.daysSinceStart,
          props.dates.today.dayOfYear(),
        ),
        0,
      ),
    )
    .map((v: number) => v);
});

const open = (battleTag: string) =>
  window.open(
    `https://www.w3champions.com/player/${encodeURIComponent(battleTag)}`,
    "_blank",
  );

const avg = computed(() =>
  data.value?.total
    ? Math.ceil(data.value.total / props.dates.daysSinceStart)
    : "-",
);
</script>

<template>
  <v-card
    color="surface"
    :class="`text-center pa-0 ${winner ? 'gold goal' : 'card-shine-effect'}`"
    :elevation="10">
    <v-list-item class="px-3" :style="`background: ${raceColor[player.race]}`">
      <template v-slot:prepend>
        <img
          style="vertical-align: middle"
          width="40px"
          :src="raceIcon[player.race]" />
      </template>
      <template v-slot:title>
        <div class="ml-1 text-left text-h5">
          {{ player.battleTag.split("#")[0] }}
          <v-icon
            v-if="laddering || streaming"
            class="elementToFadeInAndOut"
            style="vertical-align: middle"
            size="x-small"
            icon="mdi-broadcast"
            title="Currently in a ladder game!"
            :color="laddering ? 'green-lighten-1' : 'purple-lighten-1'" />
          <span
            v-if="laddering"
            class="text-green-lighten-1 ml-1"
            style="vertical-align: middle"
            >IN GAME!</span
          >
          <span
            v-if="streaming && !laddering"
            class="text-purple-lighten-1 ml-1"
            style="vertical-align: middle"
            >LIVE!</span
          >

          <v-btn
            v-if="onRemove"
            @click="onRemove"
            style="vertical-align: center"
            size="x-small"
            variant="tonal"
            icon="mdi-arrow-u-left-top-bold"
            title="Click to remove challenger"
            color="red" />
        </div>
      </template>
      <template v-if="data?.matches?.length" v-slot:append>
        <div
          style="
            position: absolute;
            left: 2px;
            top: 52px;
            overflow: visible;
            z-index: 99999999999999;
          ">
          <ul style="list-style-type: none" class="d-flex flex-row">
            <li
              class="mr-1"
              v-for="achievement in _take<any>(data.achievements, 10)">
              <v-tooltip
                :text="`${achievement.name} - ${achievement.description} // ${achievement.points} Additional Points!`"
                content-class="custom-tooltip"
                open-on-click>
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    size="x-small"
                    variant="elevated"
                    style="color: goldenrod; border: 1px solid goldenrod"
                    color="dark"
                    :icon="achievement.icon" />
                </template>
              </v-tooltip>
            </li>
          </ul>
        </div>
        <div
          style="
            position: absolute;
            left: 2px;
            top: 87px;
            overflow: visible;
            z-index: 99999999999999;
          ">
          <ul style="list-style-type: none" class="d-flex flex-row">
            <li
              class="mr-1"
              v-for="achievement in _skip<any>(data.achievements, 10)">
              <v-tooltip
                :text="`${achievement.name} - ${achievement.description} // ${achievement.points} Additional Points!`"
                content-class="custom-tooltip"
                open-on-click>
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    size="x-small"
                    variant="elevated"
                    style="color: goldenrod; border: 1px solid goldenrod"
                    color="dark"
                    :icon="achievement.icon" />
                </template>
              </v-tooltip>
            </li>
          </ul>
        </div>
      </template>
    </v-list-item>

    <v-img height="250" :src="banner ?? raceBanner[player.race]" cover></v-img>
    <Bar
      v-if="data?.matches?.length"
      style="position: absolute; bottom: 217px"
      :data="{
        labels: _range(0, dates.daysSinceStart)
          .map((n) => {
            return moment().subtract(n, 'days').startOf('day');
          })
          .reverse(),
        datasets: [
          {
            type: 'line' as any,
            yAxisID: 'mmrAxis',
            borderColor: 'lime',
            pointStyle: mmr.length === 1 ? 'rect' : false,
            backgroundColor: 'lime',
            data: mmr,
            datalabels: {
              display: false,
            },
          },
          {
            label: 'won',
            yAxisID: 'gamesAxis',
            backgroundColor: '#66BB6A',
            maxBarThickness: 15,
            data: wins,
            datalabels: {
              display: false,
            },
          },
          {
            label: 'lost',
            yAxisID: 'gamesAxis',
            backgroundColor: '#EF5350',
            maxBarThickness: 15,
            data: loss,
            datalabels: {
              display: false,
            },
          },
        ],
      }"
      :options="options" />

    <v-card-item class="py-0">
      <v-card-title class="d-flex justify-space-between">
        <span v-if="data.totalPoints > 0"
          >Rank #<span class="font-weight-bold" style="color: darkgoldenrod">{{
            data.totalPoints > 0 ? rank + 1 : "-"
          }}</span></span
        >
        <span v-else
          >Rank
          <span class="font-weight-bold" style="color: darkgoldenrod"
            >-</span
          ></span
        >
        <span v-if="highlight === 'points'"
          >{{ data?.mmr?.current ?? "-" }} MMR</span
        >
        <span
          :title="`${data.points} points from ladder, ${data.achievementPoints} points from achievements`"
          v-else
          >{{ data.totalPoints ?? "-" }} Points</span
        >
      </v-card-title>
      <v-card-subtitle class="d-flex justify-space-between" style="opacity: 1">
        <span style="opacity: 0.7" class="me-1">Games: {{ avg }} per day </span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-item class="py-0" v-if="highlight === 'points'">
      <v-card-title>
        <span
          class="text-h3 fontweight-bold"
          style="color: goldenrod; vertical-align: middle"
          ><v-progress-circular indeterminate v-if="isNaN(data.points)" />
          <span
            v-else
            :title="`${data.points} points from ladder, ${data.achievementPoints} points from achievements`">
            {{ data.totalPoints }}
          </span>
        </span>
      </v-card-title>
      <v-card-subtitle>
        <span
          class="text-subtitle-2"
          style="vertical-align: middle; color: goldenrod"
          v-if="isNaN(data.points)">
          calculating...
        </span>
        <span v-else>
          <span
            v-if="data.points === 0"
            class="text-subtitle-2"
            style="vertical-align: middle; color: goldenrod">
            No 1v1 games (or no account) on the w3c ladder yet!
          </span>
          <span v-else>
            <v-icon size="x-small" icon="mdi-medal" style="color: goldenrod" />
            <span
              class="text-subtitle-2"
              style="vertical-align: middle; color: goldenrod"
              >points</span
            >
          </span>
        </span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-item class="py-0" v-else>
      <v-card-title>
        <span
          class="text-h3 fontweight-bold"
          style="color: goldenrod; vertical-align: middle"
          ><v-progress-circular indeterminate v-if="isNaN(data.points)" />
          <span v-else>
            {{ data?.mmr?.current ?? "-" }}
          </span>
        </span>
      </v-card-title>
      <v-card-subtitle>
        <span
          class="text-subtitle-2"
          style="vertical-align: middle; color: goldenrod"
          v-if="isNaN(data.points)">
          calculating...
        </span>
        <span v-else>
          <span
            v-if="data.points === 0"
            class="text-subtitle-2"
            style="vertical-align: middle; color: goldenrod">
            No 1v1 games (or no account) on the w3c ladder yet!
          </span>
          <span v-else>
            <v-icon size="x-small" icon="mdi-medal" style="color: goldenrod" />
            <span
              class="text-subtitle-2"
              style="vertical-align: middle; color: goldenrod"
              ><strong>MMR</strong></span
            >
          </span>
        </span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-item class="py-0">
      <v-card-title class="d-flex justify-space-between">
        <span>
          <v-icon icon="mdi-sword" color="green" size="small" />
          <span
            class="text-h5 text-green fontweight-bold mr-1"
            style="vertical-align: middle"
            >{{ data?.wins ?? "-" }}</span
          >
        </span>
        <span>
          <span
            class="text-h5 text-red fontweight-bold mr-1"
            style="vertical-align: middle"
            >{{ data?.loss ?? "-" }}</span
          >
          <v-icon icon="mdi-skull-outline" color="red" size="small" />
        </span>
      </v-card-title>
    </v-card-item>

    <v-card-actions>
      <v-row>
        <v-col cols="6" offset="3" class="text-center">
          <v-btn
            title="Open W3Champions Profile Page"
            color="transparent"
            variant="flat"
            @click="() => open(player.battleTag)"
            ><img :src="w3ciconDark" height="22px"
          /></v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.goal {
  box-shadow: 0 0 15px 5px goldenrod !important;
  animation: pulse 2s infinite;
}

.gold {
  border-radius: 0.875rem;
  padding: 4rem 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid darkgoldenrod;

  background: radial-gradient(
      ellipse farthest-corner at right bottom,
      #fedb37 0%,
      #fdb931 8%,
      #9f7928 30%,
      #8a6e2f 40%,
      transparent 80%
    ),
    radial-gradient(
      ellipse farthest-corner at left top,
      #ffffff 0%,
      #ffffac 8%,
      #d1b464 25%,
      #5d4a1f 62.5%,
      #5d4a1f 100%
    );
}

@keyframes pulse {
  0% {
    border-color: white;
  }

  50% {
    border-color: goldenrod;
  }

  100% {
    border-color: white;
  }
}

.card-shine-effect {
  --shine-deg: 45deg;
  position: relative;
  overflow: hidden;
  border-radius: 0.875rem;
  border: 1px solid rgb(15 23 42);
  background-color: rgb(9 9 11);
  padding: 4rem 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 28rem;

  background-repeat: no-repeat;
  background-position:
    -100% 0,
    0 0;

  background-image: linear-gradient(
    var(--shine-deg),
    transparent 20%,
    transparent 40%,
    rgb(68, 68, 68, 0.2) 50%,
    rgb(68, 68, 68, 0.2) 55%,
    transparent 70%,
    transparent 100%
  );

  background-size:
    250% 250%,
    100% 100%;
  transition: background-position 0s ease;
}

.card-shine-effect:hover {
  background-position:
    200%0,
    0 0;
  transition-duration: 1.5s;
}

:global(.custom-tooltip) {
  opacity: 1 !important;
  background-color: rgb(var(--v-theme-surface)) !important;
  color: goldenrod !important;
  font-weight: bold !important;
  border: 2px solid darkgoldenrod !important;
}

.elementToFadeInAndOut {
  -webkit-animation: fadeinout 3s linear infinite;
  animation: fadeinout 3s linear infinite;
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
</style>
