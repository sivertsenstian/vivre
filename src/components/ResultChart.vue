<script setup lang="ts">
const props = defineProps({ result: { wins: Number, loss: Number, total: Number } })
const height = 14
</script>

<template>
  <div>
    <v-progress-linear
      rounded
      color="success"
      :model-value="(props.result.wins / props.result.total) * 100"
      :height="height"
      :style="{ top: height / 2 + 'px' }"
    >
      <template v-slot:default="{ value }">
        <span
          v-if="props.result.wins"
          class="text-white text-caption font-weight-bold"
          style="margin-right: 60%"
          >{{ props.result.wins }} win(s)</span
        >
      </template>
    </v-progress-linear>
    <v-progress-linear
      rounded
      color="error"
      :model-value="(props.result.loss / props.result.total) * 100"
      :height="height"
      :style="{ top: -height / 2 + 'px' }"
      reverse
    >
      <span
        v-if="props.result.loss"
        class="text-white text-caption font-weight-bold"
        style="margin-left: 60%"
      >
        {{ props.result.loss }} loss(es)</span
      >
    </v-progress-linear>
  </div>
</template>

<style scoped></style>
