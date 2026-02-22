<script setup lang="ts">
import { getIconUrl } from '@/utilities/api.ts';
import { computed } from 'vue';
import { useHotKeyStormStore } from '@/games/hotkeystorm/store.ts';

const store = useHotKeyStormStore();

interface Props {
  name: string;
  action: string;
  current?: string;
}
const props = defineProps<Props>();

const active = computed(
  () =>
    store.getHotkeyFromAction(props.name, props.action)?.toLowerCase() !==
    props.current?.toLowerCase(),
);
</script>

<template>
  <v-table class="pa-0">
    <tbody>
      <tr>
        <td
          style="border: 1px solid black; height: 42px; width: 42px"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item1'"
            :src="getIconUrl(action)"
            width="42"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img v-else src="/empty_inventory.jpg" width="42" height="42" />
        </td>
        <td
          style="border: 1px solid black; height: 42px; width: 42px"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item2'"
            :src="getIconUrl(action)"
            width="42"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img v-else src="/empty_inventory.jpg" width="42" height="42" />
        </td>
      </tr>
      <tr>
        <td
          style="border: 1px solid black; height: 42px; width: 42px"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item3'"
            :src="getIconUrl(action)"
            width="42"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img v-else src="/empty_inventory.jpg" width="42" height="42" />
        </td>
        <td
          style="border: 1px solid black; height: 42px; width: 42px"
          class="pa-0 ma-0">
          <v-img
            v-if="name === 'Item4'"
            :src="getIconUrl(action)"
            width="42"
            :style="{
              filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
            }" />
          <v-img v-else src="/empty_inventory.jpg" width="42" height="42" />
        </td>
      </tr>
      <tr>
        <td
          style="border: 1px solid black; height: 42px; width: 42px"
          class="pa-0 ma-0">
          <v-img src="/empty_inventory.jpg" width="42" height="42" />
        </td>
        <td
          style="border: 1px solid black; height: 42px; width: 42px"
          class="pa-0 ma-0">
          <v-img src="/empty_inventory.jpg" width="42" height="42" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped></style>
