<script setup lang="ts">
import { getIconUrl } from '@/utilities/api.ts';
import { computed, onMounted, onUpdated, ref } from 'vue';
import { useHotKeyStormStore } from '@/games/hotkeystorm/store.ts';
import _sample from 'lodash/sample';

const store = useHotKeyStormStore();

interface Props {
  name: string;
  action: string;
  current?: string;
  size?: number;
}
const props = withDefaults(defineProps<Props>(), { size: 42 });

const active = computed(
  () =>
    store.getHotkeyFromAction(props.name, props.action)?.toLowerCase() !==
    props.current?.toLowerCase(),
);
</script>

<template>
  <v-table class="pa-0 mx-3" :key="`${name}_${action}`">
    <tbody>
      <tr>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item1'"
            :src="getIconUrl(action)"
            :width="size"
            class="blink"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            :src="store.filler['Item1']"
            style="filter: brightness(0.75)"
            :width="size"
            :height="size" />
        </td>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item2'"
            :src="getIconUrl(action)"
            :width="size"
            class="blink"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            :src="store.filler['Item2']"
            style="filter: brightness(0.75)"
            :width="size"
            :height="size" />
        </td>
      </tr>
      <tr>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item3'"
            :src="getIconUrl(action)"
            :width="size"
            class="blink"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            :src="store.filler['Item3']"
            style="filter: brightness(0.75)"
            :width="size"
            :height="size" />
        </td>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item4'"
            :src="getIconUrl(action)"
            :width="size"
            class="blink"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            :src="store.filler['Item4']"
            style="filter: brightness(0.75)"
            :width="size"
            :height="size" />
        </td>
      </tr>
      <tr>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item5'"
            :src="getIconUrl(action)"
            :width="size"
            class="blink"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            :src="store.filler['Item5']"
            style="filter: brightness(0.75)"
            :width="size"
            :height="size"
            v-else />
        </td>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item6'"
            :src="getIconUrl(action)"
            :width="size"
            class="blink"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            :src="store.filler['Item6']"
            style="filter: brightness(0.75)"
            :width="size"
            :height="size"
            v-else />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.blink {
  box-shadow: 0 0 2px 2px gold !important;
  animation: pulse 2s infinite;
}
</style>
