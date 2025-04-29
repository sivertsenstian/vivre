<script setup lang="ts">
import { Race, raceIcon } from "@/stores/races";
import gnl_banner_hu from "@assets/gnl/gnl_banner_hu.jpg";
import gnl_banner_ne from "@assets/gnl/gnl_banner_ne.jpg";
import gnl_banner_ud from "@assets/gnl/gnl_banner_ud.jpg";
import gnl_banner_oc from "@assets/gnl/gnl_banner_oc.jpg";
import gnl_banner_rnd from "@assets/gnl/gnl_banner_rnd.jpg";
import _range from "lodash/range";
import moment from "moment/moment";
import { getloss, getplayer, getwins } from "@/utilities/matchcalculator";
import _fill from "lodash/fill";
import w3ciconDark from "@/assets/w3c_dark.png";

const raceGnlBanner: any = {
  [Race.Human]: gnl_banner_hu,
  [Race.NightElf]: gnl_banner_ne,
  [Race.Undead]: gnl_banner_ud,
  [Race.Orc]: gnl_banner_oc,
  [Race.Random]: gnl_banner_rnd,
};

const raceGnlColor: any = {
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
import _round from "lodash/round";
import _groupBy from "lodash/groupBy";
import _first from "lodash/first";
import _last from "lodash/last";
import { ladderGoal, teamGnlBanner } from "@/stores/gnl";
import _take from "lodash/take";
import _skip from "lodash/drop";

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
  prefix?: string;
  team?: string;
  player: any;
  dates: any;
  rank: number;
  highlight?: boolean;
  logo?: boolean;
}
const props = defineProps<Props>();

const mmr = computed(() => {
  const getPlayer = getplayer(props.player.battleTag);
  if (props.player.data?.matches.length) {
    const g = _groupBy(props.player.data?.matches, (m) => {
      const d = moment(m.endTime).dayOfYear() - 1;
      return props.dates.daysSinceStart - (props.dates.today.dayOfYear() - d);
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
  return props.player.data?.matches
    .filter((m: any) => getwins(props.player.battleTag, m))
    ?.reduce(
      (r: number[], m: any) => {
        const d = moment(m.endTime).dayOfYear() - 1;
        const day =
          props.dates.daysSinceStart - (props.dates.today.dayOfYear() - d);

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
  return props.player.data?.matches
    ?.filter((m: any) => getloss(props.player.battleTag, m))
    ?.reduce(
      (r: number[], m: any) => {
        const d = moment(m.endTime).dayOfYear() - 1;
        const day =
          props.dates.daysSinceStart - (props.dates.today.dayOfYear() - d);

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
  props.player.data?.total
    ? Math.ceil(props.player.data.total / props.dates.daysSinceStart)
    : "-",
);
</script>

<template>
  <v-card
    color="surface"
    :class="`text-center pa-0 card-shine-effect ${player.points >= ladderGoal ? (player.points >= ladderGoal * 2 ? 'omega-goal' : 'goal') : ''}`"
    :elevation="10">
    <v-list-item
      class="px-3"
      :style="`background: ${raceGnlColor[player.race]}`">
      <template v-slot:prepend>
        <v-img
          v-if="logo"
          rounded="circle"
          cover
          class="mr-1"
          style="vertical-align: middle; border: 1px solid gold"
          width="35px"
          height="35px"
          :src="teamGnlBanner(player.team)" />
        <img
          v-else
          style="vertical-align: middle"
          width="40px"
          :src="raceIcon[player.race]" />
      </template>
      <template v-slot:title>
        <div class="ml-1 text-left text-h5">
          <span class="mr-1" v-if="prefix">{{ prefix }}</span>
          {{ player.battleTag.split("#")[0] }}
          <v-icon
            v-if="player.ongoing"
            class="elementToFadeInAndOut"
            style="vertical-align: center"
            size="x-small"
            icon="mdi-circle"
            title="Currently in a ladder game!"
            color="green" />
        </div>
      </template>
      <template v-if="player.data?.matches?.length" v-slot:append>
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
              v-for="achievement in _take<any>(player.achievements, 8)">
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
              class="mb-1"
              v-for="achievement in _skip<any>(player.achievements, 8)">
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

    <v-img height="250" :src="raceGnlBanner[player.race]" cover></v-img>

    <Bar
      v-if="player.data?.matches?.length"
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
      <v-card-title class="d-flex justify-space-between"
        ><span
          >Rank #<span class="font-weight-bold" style="color: darkgoldenrod">{{
            rank + 1
          }}</span></span
        >
        <span>{{ player.data?.mmr?.current ?? "-" }} MMR</span></v-card-title
      >
      <v-card-subtitle class="d-flex justify-space-between" style="opacity: 1">
        <span style="opacity: 0.7" class="me-1"
          >Avg. games: {{ avg }} per day
        </span>
        <v-rating
          v-if="player.data?.wins * 3 + player.data?.loss < ladderGoal * 1.2"
          readonly
          half-increments
          :length="5"
          :size="20"
          :model-value="
            ((player.data?.wins * 3 + player.data?.loss) / ladderGoal) * 5
          "
          color="#b8860b"
          active-color="#daa520"
          empty-icon="mdi-circle-outline"
          half-icon="mdi-circle-half-full"
          full-icon="mdi-circle" />
        <v-rating
          v-else
          readonly
          half-increments
          :length="5"
          :size="20"
          :model-value="
            ((player.data?.wins * 3 + player.data?.loss - ladderGoal) /
              ladderGoal) *
            5
          "
          color="#ffd700"
          active-color="#ffd700"
          empty-icon="mdi-star-outline"
          half-icon="mdi-star-half-full"
          full-icon="mdi-star" />
      </v-card-subtitle>
    </v-card-item>

    <v-card-item class="py-0">
      <v-card-title>
        <span
          class="text-h3 fontweight-bold"
          style="color: goldenrod; vertical-align: middle"
          ><v-progress-circular indeterminate v-if="isNaN(player.points)" />
          <span
            v-else
            :title="`${player.points} points from ladder, ${player.achievementPoints} points from achievements`">
            <img
              v-if="team"
              style="
                vertical-align: middle;
                border-radius: 100px;
                margin-left: -50px;
              "
              width="40px"
              :src="teamGnlBanner(team)" />
            {{ player.totalPoints }}
          </span>
        </span>
      </v-card-title>
      <v-card-subtitle>
        <span
          class="text-subtitle-2"
          style="vertical-align: middle; color: goldenrod"
          v-if="isNaN(player.points)">
          calculating...
        </span>
        <span v-else>
          <span
            v-if="player.points === 0"
            class="text-subtitle-2"
            style="vertical-align: middle; color: goldenrod">
            Play 1v1 on the w3c ladder to earn points!
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

    <v-card-item class="py-0">
      <v-card-title class="d-flex justify-space-between">
        <span>
          <v-icon icon="mdi-sword" color="green" size="small" />
          <span
            class="text-h5 text-green fontweight-bold mr-1"
            style="vertical-align: middle"
            >{{ player.data?.wins ?? "-" }}</span
          >
        </span>
        <span>
          <span
            class="text-h5 text-red fontweight-bold mr-1"
            style="vertical-align: middle"
            >{{ player.data?.loss ?? "-" }}</span
          >
          <v-icon icon="mdi-skull-outline" color="red" size="small" />
        </span>
      </v-card-title>
    </v-card-item>

    <v-card-actions>
      <v-btn
        title="Open W3Champions Profile Page"
        color="transparent"
        block
        variant="flat"
        @click="() => open(player.battleTag)"
        ><img :src="w3ciconDark" height="22px"
      /></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.goal {
  box-shadow: 0 0 15px 5px goldenrod !important;
  animation: pulse 2s infinite;
}

.omega-goal {
  box-shadow: 0 0 20px 12px #b9f2ff !important;
  animation: pulse2 1s infinite;
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

@keyframes pulse2 {
  0% {
    border-color: gold;
  }

  50% {
    border-color: #b9f2ff;
  }

  100% {
    border-color: gold;
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
