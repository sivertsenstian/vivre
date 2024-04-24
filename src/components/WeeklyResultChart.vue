<script setup lang="ts">
import moment from "moment";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

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
              backgroundColor: '#66BB6A',
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
            },
            {
              backgroundColor: 'rgb(251, 140, 0)',
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
            },
          ],
        }"
        :options="options"
      />
    </v-col>
  </v-row>
</template>

<style scoped></style>
