<script setup lang="ts">
import moment from "moment/moment";
import { computed } from "vue";
import _groupBy from "lodash/groupBy";
import _reduce from "lodash/reduce";
import _isNil from "lodash/isNil";

interface Props {
  matches: any[];
  dark?: boolean;
}

const props = defineProps<Props>();

// Activity
const activity = computed(() => {
  const g = _groupBy(props.matches, (m: any) => [
    moment(m.endTime).format("dddd"),
    moment(m.endTime).format("HH"),
  ]);
  return _reduce(
    g,
    (r: any, v: any, k: string) => ({
      ...r,
      [k]: v.length,
    }),
    {},
  );
});

const lightIntensity = (n: number) => {
  const colors = [
    "rgb(235, 237, 240)",
    "rgb(218, 226, 239)",
    "rgb(192, 221, 249)",
    "rgb(115, 179, 243)",
    "rgb(56, 134, 225)",
    "rgb(23, 69, 158)",
  ];

  if (_isNil(n) || n === 0) {
    return colors[0];
  } else if (n <= 1) {
    return colors[1];
  } else if (n <= 2) {
    return colors[2];
  } else if (n <= 3) {
    return colors[3];
  } else if (n <= 5) {
    return colors[4];
  } else {
    return colors[5];
  }
};

const darkIntensity = (n: number) => {
  const colors = [
    "rgb(31, 31, 34)",
    "rgb(30, 51, 74)",
    "rgb(29, 70, 108)",
    "rgb(29, 86, 137)",
    "rgb(29, 106, 172)",
    "rgb(27, 149, 209)",
  ];

  if (_isNil(n) || n === 0) {
    return colors[0];
  } else if (n <= 1) {
    return colors[1];
  } else if (n <= 2) {
    return colors[2];
  } else if (n <= 3) {
    return colors[3];
  } else if (n <= 5) {
    return colors[4];
  } else {
    return colors[5];
  }
};
</script>

<template>
  <v-table density="compact" class="time-table text-center">
    <thead style="color: #767676; font-size: 11px">
      <tr>
        <th class="text-center"></th>
        <th
          :class="{
            'text-center': true,
            'font-weight-bold': moment().format('d') === '1',
          }"
          :style="{
            color: moment().format('d') === '1' ? 'goldenrod' : 'inherit',
          }"
        >
          M
        </th>
        <th
          :class="{
            'text-center': true,
            'font-weight-bold': moment().format('d') === '2',
          }"
          :style="{
            color: moment().format('d') === '2' ? 'goldenrod' : 'inherit',
          }"
        >
          T
        </th>
        <th
          :class="{
            'text-center': true,
            'font-weight-bold': moment().format('d') === '3',
          }"
          :style="{
            color: moment().format('d') === '3' ? 'goldenrod' : 'inherit',
          }"
        >
          W
        </th>
        <th
          :class="{
            'text-center': true,
            'font-weight-bold': moment().format('d') === '4',
          }"
          :style="{
            color: moment().format('d') === '4' ? 'goldenrod' : 'inherit',
          }"
        >
          T
        </th>
        <th
          :class="{
            'text-center': true,
            'font-weight-bold': moment().format('d') === '5',
          }"
          :style="{
            color: moment().format('d') === '5' ? 'goldenrod' : 'inherit',
          }"
        >
          F
        </th>
        <th
          :class="{
            'text-center': true,
            'font-weight-bold': moment().format('d') === '6',
          }"
          :style="{
            color: moment().format('d') === '6' ? 'goldenrod' : 'inherit',
          }"
        >
          S
        </th>
        <th
          :class="{
            'text-center': true,
            'font-weight-bold': moment().format('d') === '7',
          }"
          :style="{
            color: moment().format('d') === '7' ? 'goldenrod' : 'inherit',
          }"
        >
          S
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="hour in [
          '08',
          '09',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
        ]"
      >
        <td
          :class="{
            'font-weight-bold': moment().format('HH') === hour,
          }"
          :style="{
            height: 'auto',
            width: 'auto',
            border: 'none',
            color: moment().format('HH') === hour ? 'goldenrod' : '#767676',
            fontSize: '11px',
          }"
        >
          {{ hour }}:00
        </td>
        <td
          style="height: 21px; width: auto; border: none"
          v-for="day in [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ]"
        >
          <svg height="10" width="10">
            <rect
              rx="5"
              ry="5"
              width="10"
              height="10"
              :style="{
                fill: dark
                  ? darkIntensity(activity[`${day},${hour}`])
                  : lightIntensity(activity[`${day},${hour}`]),
              }"
            >
              <title>
                {{ day }} {{ hour }}:00 -
                {{ activity?.[`${day},${hour}`] ?? 0 }}
                game(s) played
              </title>
            </rect>
          </svg>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped></style>
