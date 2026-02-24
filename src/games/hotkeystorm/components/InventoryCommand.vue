<script setup lang="ts">
import { getIconUrl } from '@/utilities/api.ts';
import { computed } from 'vue';
import { useHotKeyStormStore } from '@/games/hotkeystorm/store.ts';

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
  <v-table class="pa-0 mx-3">
    <tbody>
      <tr>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item1'"
            :src="getIconUrl(action)"
            :width="size"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            src="/empty_inventory.jpg"
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
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            src="/empty_inventory.jpg"
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
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            src="/empty_inventory.jpg"
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
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img
            v-else
            src="/empty_inventory.jpg"
            :width="size"
            :height="size" />
        </td>
      </tr>
      <tr>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img src="/empty_inventory.jpg" :width="size" :height="size" />
        </td>
        <td
          :style="`border: 1px solid black; height: ${size}px; width: ${size}px`"
          class="pa-0 ma-0">
          <v-img src="/empty_inventory.jpg" :width="size" :height="size" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped></style>
