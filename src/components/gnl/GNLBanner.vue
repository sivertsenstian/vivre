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
import _round from "lodash/round";

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
defineProps<Props>();
</script>

<template>
  <div class="text-h6 text-black text-center">
    <v-card color="surface" :elevation="10">
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
        style="position: absolute; bottom: 340px"
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
              data: data.matches.reverse()?.reduce(
                (r: number[], m: any) => {
                  const d = moment(m.endTime).dayOfYear();
                  const day = days - (today.dayOfYear() - d);
                  const p = getplayer(battleTag)(m);
                  const mmr = p.players[0].currentMmr;

                  for (let i = day; i < r.length; i++) {
                    r[i] = mmr;
                  }

                  return r;
                },
                _fill(_range(today.dayOfYear() - days, today.dayOfYear()), 0),
              ),
              datalabels: {
                display: false,
              },
            },
            {
              label: 'won',
              yAxisID: 'gamesAxis',
              backgroundColor: '#66BB6A',
              data: data.matches
                .filter((m: any) => getwins(battleTag, m))
                ?.reduce(
                  (r: number[], m: any) => {
                    const d = moment(m.endTime).dayOfYear();
                    const day = days - (today.dayOfYear() - d);

                    r[day]++;
                    return r;
                  },
                  _fill(_range(today.dayOfYear() - days, today.dayOfYear()), 0),
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
              data: data.matches
                .filter((m: any) => getloss(battleTag, m))
                ?.reduce(
                  (r: number[], m: any) => {
                    const d = moment(m.endTime).dayOfYear();
                    const day = days - (today.dayOfYear() - d);

                    r[day]++;
                    return r;
                  },
                  _fill(_range(today.dayOfYear() - days, today.dayOfYear()), 0),
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
                      (s: number[], d: number[]) => s.map((v, i) => v + d[i]),
                      _fill(
                        _range(0, context.chart.data.datasets[0].data.length),
                        0,
                      ),
                    );

                  const r = _round(
                    ((all[context.dataIndex] -
                      Number(context.dataset.data[context.dataIndex])) /
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
          <span class="text-h4 fontweight-bold text-orange">{{
            data.wins * 3 + data.loss
          }}</span>
        </v-card-title>
        <v-card-subtitle>
          <span class="text-subtitle-2 text-orange">points</span>
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
          color="primary"
          text="Open profile page"
          block
          border
          @click="() => console.log('yp')"></v-btn>
      </v-card-actions>
    </v-card>
  </div>
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
