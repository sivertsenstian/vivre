<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";
import { createGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";
import ActivityTable from "@/components/ActivityTable.vue";
import GNLBanner from "@/components/gnl/GNLBanner.vue";
import _isEmpty from "lodash/isEmpty";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const useGNLStore = createGNLStore(
  15,
  [{ battleTag: "SaulApeMan#2163", race: Race.Undead }],
  [{ battleTag: "Longjacket#2840", race: Race.Human }],
);
const store = useGNLStore();
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <pre>{{ _isEmpty(store.data) }}</pre>
      <v-sheet
        class="pa-8"
        elevation="10"
        style="min-height: 90vh"
        v-if="false && store.data">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-h2">GNL Season {{ store.season }}</div>
            <hr />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <GNLBanner
              :race="store.data['SaulApeMan#2163'].race"
              :current="
                store.data['SaulApeMan#2163'].season.summary.mmr.current
              "
              :label="'SaulApeMan#2163'" />
            <ActivityTable
              :matches="store.data?.['SaulApeMan#2163']?.season.summary.matches"
              :dark="isDark" />
          </v-col>
          <v-col cols="6">
            <GNLBanner
              :race="store.data['Longjacket#2840'].race"
              :current="
                store.data['Longjacket#2840'].season.summary.mmr.current
              "
              :label="'Longjacket#2840'" />
            <ActivityTable
              :matches="store.data?.['Longjacket#2840']?.season.summary.matches"
              :dark="isDark" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
