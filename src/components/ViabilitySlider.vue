<script setup lang="ts">
const viabilities = [
  { name: "Fun", color: "pink" },
  { name: "Playable", color: "warning" },
  { name: "Almost Meta", color: "secondary" },
  { name: "Meta", color: "primary" },
];

interface Props {
  readonly?: boolean;
  icon?: number;
}
defineProps<Props>();

const model = defineModel<number>({ default: 2 });
</script>

<template>
  <v-chip
    v-if="icon"
    :title="viabilities[icon - 1].name"
    variant="tonal"
    label
    size="small"
    :color="viabilities[icon - 1].color"
  >
    <v-icon icon="mdi-heart-pulse" />
  </v-chip>

  <span v-if="readonly" class="text-subtitle-2 font-weight-bold mr-1"
    >Viability:
  </span>
  <v-chip
    v-if="readonly"
    variant="tonal"
    label
    size="small"
    :color="viabilities[model - 1].color"
    prepend-icon="mdi-heart-pulse"
  >
    {{ viabilities[model - 1].name }}
  </v-chip>

  <v-slider
    v-if="!readonly && !icon"
    :class="`viability c-${viabilities[model - 1]}`"
    v-model="model"
    label="Viability"
    append-icon="mdi-heart-pulse"
    :color="viabilities[model - 1].color"
    :thumb-color="viabilities[model - 1].color"
    :step="1"
    :min="1"
    :max="4"
    tick-size="4"
    :hint="viabilities[model - 1].name"
  >
  </v-slider>
</template>

<style>
.viability .v-messages {
  text-align: center;
  font-weight: bold;
  opacity: 1;
}

.viability.c-pink > .v-input__append > i.mdi.v-icon {
  color: #e91e63 !important;
}

.viability.c-warning > .v-input__append > i.mdi.v-icon {
  color: rgb(var(--v-theme-warning));
}

.viability.c-secondary > .v-input__append > i.mdi.v-icon {
  color: rgb(var(--v-theme-secondary));
}

.viability.c-primary > .v-input__append > i.mdi.v-icon {
  color: rgb(var(--v-theme-primary));
}
</style>
