<script setup lang="ts">
const props = defineProps({ result: { wins: Number, loss: Number, total: Number } as any })
const height = 16
</script>

<template>
  <div>
    <v-progress-linear
      color="green-lighten-1"
      :model-value="(props.result.wins / props.result.total) * 100"
      :height="height"
      :style="{ top: height / 2 + 'px', border: '1px solid green' }"
    >
      <template v-slot:default="{ value }">
        <span
          v-if="props.result.wins"
          class="text-white text-caption font-weight-bold"
          style="margin-right: 60%"
          >{{ props.result.wins }}W</span
        >
      </template>
    </v-progress-linear>
    <v-progress-linear
      color="red-lighten-1"
      :model-value="(props.result.loss / props.result.total) * 100"
      :height="height"
      :style="{ top: -height / 2 + 'px', border: '1px solid black' }"
      reverse
    >
      <span
        v-if="props.result.loss"
        class="text-white text-caption font-weight-bold"
        style="margin-left: 60%"
      >
        {{ props.result.loss }}L</span
      >
    </v-progress-linear>
  </div>
</template>

<style scoped></style>
