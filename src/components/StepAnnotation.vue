<script setup lang="ts">
import type { IStepAnnotation } from "@/utilities/types";

interface Props {
  annotation?: IStepAnnotation;
}
defineProps<Props>();

const color = (type: string) => {
  switch (type) {
    case "Information":
      return "secondary";
    case "Army":
      return "yellow";
    case "Tech":
      return "purple-lighten-2";
    default:
      return "grey";
  }
};
</script>

<template>
  <v-menu
    v-if="annotation"
    :open-on-hover="true"
    :close-on-content-click="false"
    location="end"
    max-width="400px"
  >
    <template v-slot:activator="{ props }">
      <v-icon
        v-bind="props"
        icon="mdi-information-outline"
        :color="color(annotation.type)"
        size="x-small"
      />
    </template>

    <v-card min-width="300">
      <v-list>
        <v-list-item
          density="compact"
          subtitle="Annotation"
          :title="annotation.type"
        >
          <template v-slot:prepend>
            <v-btn
              :class="`text-${color(annotation.type)}`"
              icon="mdi-information-outline"
              variant="text"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-divider />

      <section class="pa-5" style="white-space: pre-line">
        {{ annotation.text }}
      </section>
      <v-divider />
    </v-card>
  </v-menu>
</template>
