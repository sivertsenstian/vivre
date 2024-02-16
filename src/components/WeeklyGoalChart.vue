<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement } from 'chart.js'

ChartJS.register(ArcElement)

const props = defineProps({ played: Number, goal: Number })

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%'
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
              data: [Number(props.played), Number(props.goal - props.played)]
            }
          ]
        }"
        :options="options"
      />
    </v-col>
    <h2 class="text-h4 font-weight-black mx-auto" style="position: relative; bottom: 180px">
      <span class="text-orange"> {{ props.played }}</span>
      <span class="text-grey"> / {{ props.goal }}</span>
    </h2>
  </v-row>
</template>

<style scoped></style>
