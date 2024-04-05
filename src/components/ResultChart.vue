<script setup lang="ts">
const props = defineProps({ result: { wins: Number, loss: Number, total: Number } as any })
const height = 20
</script>

<template>
  <div v-if="props.result.total">
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
          :style="{ marginRight: (props.result.loss / props.result.total) * 100 + '%' }"
          >{{ props.result.wins }}W</span
        >
      </template>
    </v-progress-linear>
    <v-progress-linear
      color="red-lighten-1"
      :model-value="(props.result.loss / props.result.total) * 100"
      :height="height"
      :style="{ top: -height / 2 + 'px', border: '1px solid white' }"
      reverse
    >
      <span
        v-if="props.result.loss"
        class="text-white text-caption font-weight-bold"
        :style="{ marginLeft: (props.result.wins / props.result.total) * 100 + '%', color: 'lime' }"
      >
        {{ props.result.loss }}L</span
      >
    </v-progress-linear>
  </div>
</template>

<style scoped></style>
