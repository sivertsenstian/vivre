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
          labels: ['Played', 'Goal'],
          datasets: [
            {
              backgroundColor: ['orange', 'lightgray'],
              data: [Number(props.played), Number((props.goal ?? 0) - (props.played ?? 0))]
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
          <span class="text-orange"> {{ props.played }}</span>
          <span class="text-grey"> / {{ props.goal }}</span>
        </v-col>
      </v-row>
    </h2>
  </v-row>
</template>

<style scoped></style>
