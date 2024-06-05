<script setup lang="ts">
import help from "@/assets/halp.jpg";
import { useSettingsStore } from "@/stores/settings";
const settings = useSettingsStore();
</script>

<template>
  <main>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-sheet class="pa-4" :elevation="5">
            <div class="text-h5">Settings</div>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Weekly Ladder Goal"
            v-model.trim="settings.data.goal"
            clearable
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <div class="text-h4">What does this all mean?</div>
        </v-col>
        <v-col cols="10">
          <img style="border: 1px solid white" :src="help" width="100%" />
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
