<script setup lang="ts">
interface Props {
  visible: boolean;
  performance: boolean[];
  today: number;
}
defineProps<Props>();
</script>

<template>
  <div v-if="visible">
    <template v-for="(result, i) in performance">
      <v-chip
        v-if="i === today"
        size="small"
        variant="tonal"
        color="gray"
        label
        class="rounded-0"
        title="Start of Today">
        <v-icon icon="mdi-calendar" />
      </v-chip>
      <v-chip
        v-if="result"
        size="small"
        variant="tonal"
        color="green"
        label
        class="rounded-0"
        title="Win">
        <v-icon icon="mdi-shield-crown" />
      </v-chip>
      <v-chip
        v-else
        variant="tonal"
        size="small"
        color="red"
        label
        class="rounded-0"
        title="Loss">
        <v-icon icon="mdi-shield-crown-outline" />
      </v-chip>
    </template>
  </div>
</template>

<style scoped></style>
