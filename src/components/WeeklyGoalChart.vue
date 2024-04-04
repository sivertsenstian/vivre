<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement } from 'chart.js'

ChartJS.register(ArcElement)

const props = defineProps({ played: Number, goal: Number })

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '80%'
}
</script>

<template>
  <v-row class="mx-auto">
    <v-col cols="12">
      <Doughnut
        :data="{
          labels: (props.played ?? 0) >= (props.goal ?? 0) ? ['Played'] : ['Played', 'Goal'],
          datasets: [
            {
              backgroundColor:
                (props.played ?? 0) >= (props.goal ?? 0) ? ['green'] : ['orange', 'lightgray'],
              data:
                (props.played ?? 0) >= (props.goal ?? 0)
                  ? [Number(props.played)]
                  : [Number(props.played), Number((props.goal ?? 0) - (props.played ?? 0))]
            }
          ]
        }"
        :options="options"
      />
    </v-col>
    <h2
      class="text-h5 font-weight-black mx-auto"
      style="position: relative; bottom: 180px; height: 0"
    >
      <v-row class="text-center">
        <v-col cols="12" class="pa-0">
          <span>Weekly Goal</span>
        </v-col>
        <v-col cols="12" class="pa-0">
          <span
            :class="{
              'text-orange': Number(props.played ?? 0) < Number(props.goal ?? 0),
              'text-green': Number(props.played ?? 0) >= Number(props.goal ?? 0)
            }"
          >
            {{ props.played }}</span
          >
          <span class="text-grey"> / {{ props.goal }}</span>
        </v-col>
      </v-row>
    </h2>
  </v-row>
</template>

<style scoped></style>
