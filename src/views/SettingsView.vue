<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';

const settings = useSettingsStore();
</script>

<template>
  <main>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-sheet class="pa-4" :elevation="5">
            <div class="text-h5">Settings</div>
            <LiveChart />
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Battle Tag" v-model="settings.data.battleTag" clearable />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Goal" v-model="settings.data.goal" clearable />
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
