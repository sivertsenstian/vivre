<script setup lang="ts">
import w3ciconSmall from "@/assets/w3c_small.png";
import w3ciconDarkSmall from "@/assets/w3c_dark_small.png";
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings.ts";
import { useTheme } from "vuetify";
import * as api from "@/utilities/api.ts";
import { current_season } from "@/utilities/constants.ts";
import { Race } from "@/stores/races.ts";

const settings = useSettingsStore();

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

interface Props {
  battleTag: string;
  won?: boolean;
  left?: boolean;
}
const props = withDefaults(defineProps<Props>(), { won: undefined });
const name = computed(() => props.battleTag?.split("#") ?? ["", ""]);
</script>

<template>
  <div class="d-inline-flex">
    <a
      v-if="left"
      class="mr-1"
      style="align-self: center"
      :href="`https://www.w3champions.com/player/${encodeURIComponent(battleTag)}`"
      title="Open w3c profile in a new tab"
      target="_blank">
      <v-img :src="isDark ? w3ciconDarkSmall : w3ciconSmall" :width="22" />
    </a>
    <div
      @click="
        async () => {
          const information = await api.getPlayerInformation(
            battleTag,
            current_season,
          );
          settings.data.battleTag = battleTag;
          settings.data.race = information?.race ?? Race.Random;
        }
      "
      title="Open season stats for this player"
      :class="{
        profile: true,
        'text-success': won,
        'text-error': won !== undefined && !won,
        'text-white': won === undefined,
      }">
      {{ name?.[0] }}
    </div>
    <a
      v-if="!left"
      class="ml-1"
      style="align-self: center"
      :href="`https://www.w3champions.com/player/${encodeURIComponent(battleTag)}`"
      title="Open w3c profile in a new tab"
      target="_blank">
      <v-img :src="isDark ? w3ciconDarkSmall : w3ciconSmall" :width="22" />
    </a>
  </div>
</template>
<style scoped>
.profile {
  transition: filter 500ms;
  &:hover {
    cursor: pointer;
    filter: brightness(1.5);
  }
}
</style>
