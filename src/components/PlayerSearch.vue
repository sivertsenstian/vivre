<script setup lang="ts">
import { ref } from "vue";
import * as api from "@/utilities/api.ts";
import _isNil from "lodash/isNil";
import { current_season } from "@/utilities/constants.ts";
import { Race } from "@/stores/races.ts";
import { useSettingsStore } from "@/stores/settings.ts";

const settings = useSettingsStore();

const searching = ref(false);
const searchResults = ref([]);
</script>

<template>
  <v-autocomplete
    :items="searchResults"
    :loading="searching"
    @input="
      async (e: any) => {
        searching = true;
        try {
          const results = await api.getBattleTag(e.target.value);
          searchResults = results;
        } catch (error) {
          console.error('Error searching w3c', error);
        } finally {
          searching = false;
        }
      }
    "
    @update:model-value="
      async (value: any) => {
        if (_isNil(value)) {
          settings.data.profilePicture = '';
          settings.data.battleTag = '';
          settings.data.race = undefined;
        } else {
          const information = await api.getPlayerInformation(
            value,
            current_season,
          );
          settings.data.battleTag = value;
          settings.data.race = information?.race ?? Race.Random;
        }
      }
    "
    clearable
    v-model="settings.data.battleTag as any"
    class="mx-auto"
    density="comfortable"
    placeholder="Search W3C for player..."
    prepend-inner-icon="mdi-magnify"
    variant="solo-filled"
    item-title="battleTag"
    item-value="battleTag"
    auto-select-first />
</template>
