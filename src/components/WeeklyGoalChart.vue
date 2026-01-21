<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement } from "chart.js";
import _capitalize from "lodash/capitalize";
import { end_color, start_color } from "@/utilities/constants.ts";

ChartJS.register(ArcElement);

const props = defineProps({ played: Number, goal: Number, mode: String });

const options = {
  radius: "80%",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: false,
  },
  cutout: "80%",
};
</script>

<template>
  <v-row class="mx-auto">
    <v-col cols="12">
      <Doughnut
        :data="{
          labels:
            (props.played ?? 0) >= (props.goal ?? 0)
              ? ['Played']
              : ['Played', 'Goal'],
          datasets: [
            {
              backgroundColor:
                (props.played ?? 0) >= (props.goal ?? 0)
                  ? [end_color]
                  : [start_color, 'rgb(33,33,33)'],
              borderColor:
                (props.played ?? 0) >= (props.goal ?? 0)
                  ? end_color
                  : 'rgb(33,33,33)',
              data:
                (props.played ?? 0) >= (props.goal ?? 0)
                  ? [Number(props.played)]
                  : [
                      Number(props.played),
                      Number((props.goal ?? 0) - (props.played ?? 0)),
                    ],
              datalabels: {
                display: false,
              },
            },
          ],
        }"
        :options="options" />
    </v-col>
    <h2
      class="text-h5 weight-black mx-auto"
      style="position: relative; bottom: 180px; height: 0">
      <v-row class="text-center">
        <v-col cols="12" class="pa-0">
          <span>{{ _capitalize(mode) }}ly Goal</span>
        </v-col>
        <v-col cols="12" class="pa-0">
          <span
            :class="{
              'text-start': Number(props.played ?? 0) < Number(props.goal ?? 0),
              'text-end': Number(props.played ?? 0) >= Number(props.goal ?? 0),
            }">
            {{ props.played }}</span
          >
          <span class="text-grey"> / {{ props.goal }}</span>
        </v-col>
      </v-row>
    </h2>
  </v-row>
</template>

<style scoped>
.text-start {
  color: var(--level-start-color);
}

.text-end {
  color: var(--level-end-color);
}
</style>
