<script setup lang="ts">
import moment from "moment";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { end_color, start_color } from "@/utilities/constants.ts";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartDataLabels);

const props = defineProps({
  weekly: { matches: Array, count: Number } as any,
  goal: Number,
});

const options = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, beginAtZero: true, grid: { display: false } },
  },
} as any;
</script>

<template>
  <v-row class="mx-auto">
    <v-col cols="12">
      <Bar
        :data="{
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          datasets: [
            {
              backgroundColor: end_color,
              data:
                props.weekly.matches
                  ?.reduce(
                    (r: number[], m: any) => {
                      const d = moment(m.endTime).day();
                      const day = d === 0 ? 6 : d - 1;
                      r[day]++;
                      return r;
                    },
                    [0, 0, 0, 0, 0, 0, 0],
                  )
                  .map((v: number) => (v >= (props.goal ?? 0) ? v : 0)) ?? [],
              datalabels: {
                display: function (context) {
                  const v = Number(
                    context.dataset?.data?.[context.dataIndex] ?? 0,
                  );
                  return v > 0 && v >= (props.goal ?? 0);
                },
                clip: false,
                clamp: false,
                anchor: 'end',
                align: 'end',
                offset: -7,
                color: 'lightgray',
              },
            },
            {
              backgroundColor: start_color,
              data:
                props.weekly.matches
                  ?.reduce(
                    (r: number[], m: any) => {
                      const d = moment(m.endTime).day();
                      const day = d === 0 ? 6 : d - 1;
                      r[day]++;
                      return r;
                    },
                    [0, 0, 0, 0, 0, 0, 0],
                  )
                  .map((v: number) => (v < (props.goal ?? 0) ? v : 0)) ?? [],
              datalabels: {
                display: function (context) {
                  const v = Number(
                    context.dataset?.data?.[context.dataIndex] ?? 0,
                  );
                  return v > 0 && v < (props.goal ?? 0);
                },
                clip: false,
                clamp: false,
                anchor: 'end',
                align: 'end',
                offset: -7,
                color: 'gray',
              },
            },
          ],
        }"
        :options="options" />
    </v-col>
  </v-row>
</template>

<style scoped></style>
