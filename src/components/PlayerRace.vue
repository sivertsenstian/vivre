<script setup lang="ts">
import { races } from "@/utilities/constants.ts";
import { raceIcon, raceName } from "@/stores/races.ts";
import { useSettingsStore } from "@/stores/settings.ts";

const settings = useSettingsStore();
</script>

<template>
  <v-select
    variant="plain"
    hide-details
    :items="
      races.map((r) => ({
        text: r === 0 ? 'Random' : raceName[r],
        value: r,
      }))
    "
    density="compact"
    item-title="text"
    item-value="value"
    v-model="settings.data.race">
    <template v-slot:selection="{ item }">
      <div class="text-center mt-1">
        <img :width="35" :src="raceIcon[item.value]" />
      </div>
    </template>
    <template v-slot:item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps" class="text-center" title="">
        <img :width="40" :src="raceIcon[item.value]" />
      </v-list-item>
    </template>
  </v-select>
</template>
