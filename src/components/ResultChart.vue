<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";
import _round from "lodash/round";
import _isNil from "lodash/isNil";

interface Props {
  result?: { wins?: number; loss?: number; total?: number };
  percentage?: boolean;
}
defineProps<Props>();

const height = 16;
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
</script>

<template>
  <div v-if="!_isNil(result?.total) && result.total > 0">
    <v-progress-linear
      color="green-lighten-1"
      :model-value="((result.wins ?? 0) / result.total) * 100"
      rounded
      :height="height"
      :style="{ top: height / 2 + 'px', border: '1px solid green' }">
      <template v-slot:default="{ value }">
        <span
          v-if="result.wins"
          class="text-white text-caption font-weight-bold"
          :style="{
            marginRight: ((result.loss ?? 0) / result.total) * 100 + '%',
          }"
          >{{ result.wins }}W
          <span v-if="percentage" class="text-caption"
            >({{ _round((result.wins / result.total) * 100) }}%)</span
          ></span
        >
      </template>
    </v-progress-linear>
    <v-progress-linear
      color="red-lighten-1"
      :model-value="((result.loss ?? 0) / result.total) * 100"
      rounded
      :height="height"
      :style="{
        top: -height / 2 + 'px',
        border: `1px solid ${isDark ? 'black' : 'white'}`,
      }"
      reverse>
      <span
        v-if="result.loss"
        class="text-white text-caption font-weight-bold"
        :style="{
          marginLeft: ((result.wins ?? 0) / result.total) * 100 + '%',
          color: 'lime',
        }">
        {{ result.loss }}L</span
      >
    </v-progress-linear>
  </div>
</template>

<style scoped></style>
