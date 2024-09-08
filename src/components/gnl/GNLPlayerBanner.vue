<script setup lang="ts">
import { Race, raceIcon } from "@/stores/races";
import hu_banner from "@/assets/take_a_look_at_banner_michael.png";
import oc_banner from "@/assets/take_a_look_at_banner_orc.png";
import ud_banner from "@/assets/take_a_look_at_banner_undead.png";
import ne_banner from "@/assets/take_a_look_at_banner_nightelf.png";
import r_banner from "@/assets/take_a_look_at_banner_random.png";
import gnl_banner from "@assets/gnl_banner.png";
import _range from "lodash/range";
import moment from "moment/moment";
import { getloss, getplayer, getwins } from "@/utilities/matchcalculator";
import _fill from "lodash/fill";
import w3cicon from "@/assets/w3c.png";
import w3ciconDark from "@/assets/w3c_dark.png";

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
import {computed} from "vue";

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

const start = moment("01.08.2024", "DD.MM.YYYY").startOf("day");
const today = moment().add(1, "day").startOf("day");
const days = today.diff(start, "days");

const raceBanner: any = {
  [Race.Human]: hu_banner,
  [Race.Orc]: oc_banner,
  [Race.Undead]: ud_banner,
  [Race.NightElf]: ne_banner,
  [Race.Random]: r_banner,
};

interface Props {
  race: Race;
  current: number;
  diff?: number;
  label: string;
  highlight?: boolean;
  battleTag: string;
  data: any;
}
const props = defineProps<Props>();

const mmr = computed(() => {
   return props.data.matches.reverse()?.reduce(
      (r: number[], m: any) => {
        const d = moment(m.endTime).dayOfYear();
        const day = days - (today.dayOfYear() - d);
        const p = getplayer(props.battleTag)(m);
        const mmr = p.players[0].currentMmr;

        for (let i = day; i < r.length; i++) {
          r[i] = mmr;
        }

        return r;
      },
      _fill(_range(today.dayOfYear() - days, today.dayOfYear()), 0),
  )
})

const wins = computed(() => {
  return props.data.matches
      .filter((m: any) => getwins(props.battleTag, m))
      ?.reduce(
          (r: number[], m: any) => {
            const d = moment(m.endTime).dayOfYear();
            const day = days - (today.dayOfYear() - d);

            r[day]++;
            return r;
          },
          _fill(_range(today.dayOfYear() - days, today.dayOfYear()), 0),
      )
      .map((v: number) => v)
})

const loss = computed(() => {
  return props.data.matches
      .filter((m: any) => getloss(props.battleTag, m))
      ?.reduce(
          (r: number[], m: any) => {
            const d = moment(m.endTime).dayOfYear();
            const day = days - (today.dayOfYear() - d);

            r[day]++;
            return r;
          },
          _fill(_range(today.dayOfYear() - days, today.dayOfYear()), 0),
      )
      .map((v: number) => v)
})

const open = (battleTag: string) => window.open(`https://www.w3champions.com/player/${encodeURIComponent(
battleTag
)}`, "_blank");
</script>

<template>
    <v-card class="text-center" color="surface" :elevation="10" style="border: 2px solid silver;">
      <v-list-item class="px-3">
        <template v-slot:prepend>
          <img
            style="vertical-align: middle"
            width="40px"
            :src="raceIcon[race]" />
        </template>
        <template v-slot:title>
          <div class="ml-1 text-left text-h5">
            {{ battleTag }}
          </div>
        </template>
      </v-list-item>

      <v-img
        height="250"
        :src="gnl_banner"
        cover
        gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.5)"></v-img>

      <Bar
          v-if="data.matches.length"
        style="position: absolute; bottom: 350px"
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
              borderColor: 'lime',
              pointStyle: false,
              data: mmr,
              datalabels: {
                display: false,
              },
            },
            {
              label: 'won',
              yAxisID: 'gamesAxis',
              backgroundColor: '#66BB6A',
              data: wins,
              datalabels: {
                display: false,
              },
            },
            {
              label: 'lost',
              yAxisID: 'gamesAxis',
              backgroundColor: '#EF5350',
              data: loss,
              datalabels: {
                display: false
              },
            },
          ],
        }"
        :options="options" />

      <v-card-item>
        <v-card-title class="text-left">Rank #1</v-card-title>
        <v-card-subtitle class="text-left">
          <span class="me-1"
            >Average games per day: {{ Math.ceil(data.total / days) }}
          </span>
        </v-card-subtitle>
        <v-card-subtitle class="text-left">
          <span class="me-1">Game contribution: 21% </span>
        </v-card-subtitle>
      </v-card-item>

      <v-divider />

      <v-card-item>
        <v-card-title>
          <span class="text-h3 fontweight-bold" style="color: goldenrod;">{{
            data.wins * 3 + data.loss
          }}</span>
        </v-card-title>
        <v-card-subtitle>
          <span class="text-subtitle-2" style="color: goldenrod;">points</span>
        </v-card-subtitle>
      </v-card-item>

      <v-card-item>
        <v-card-title>
          <span class="text-h5 fontweight-bold"
            >{{ data.mmr.current }} MMR</span
          >
        </v-card-title>
      </v-card-item>

      <v-card-item>
        <v-card-title class="d-flex justify-space-around">
          <span class="text-h5 text-green fontweight-bold"
            >{{ data.wins }} Wins</span
          >
          <span class="text-h5 text-red fontweight-bold"
            >{{ data.loss }} Losses</span
          >
        </v-card-title>
      </v-card-item>

      <v-card-actions>
        <v-btn
          title="Open W3Champions Profile Page"
            color="primary"
          block
          border
          @click="() => open(battleTag)"><img :src="w3ciconDark" height="22px"/></v-btn>
      </v-card-actions>
    </v-card>
</template>

<style scoped>
.gold {
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
.plain {
  background-color: transparent;
}
</style>
