<script setup lang="ts">
import { getIconUrl } from '@/utilities/api.ts';

interface Props {
  name: string;
  action: string;
  size?: number;
}
withDefaults(defineProps<Props>(), {
  size: 42,
});
</script>

<template>
  <table style="border-spacing: 8px">
    <tbody>
      <tr>
        <td>
          <v-img
            :src="getIconUrl(name)"
            :width="size"
            :class="{
              'mx-3': true,
              blink: action === 'SelectFirstHero',
            }"
            :style="{
              filter:
                action === 'SelectFirstHero' ? 'grayscale(0)' : 'grayscale(1)',
            }" />
        </td>
      </tr>
      <tr>
        <td>
          <v-img
            :src="getIconUrl(name)"
            :width="size"
            :class="{
              'mx-3': true,
              blink: action === 'SelectSecondHero',
            }"
            :style="{
              filter:
                action === 'SelectSecondHero' ? 'grayscale(0)' : 'grayscale(1)',
            }" />
        </td>
      </tr>
      <tr>
        <td>
          <v-img
            :src="getIconUrl(name)"
            :width="size"
            :class="{
              'mx-3': true,
              blink: action === 'SelectThirdHero',
            }"
            :style="{
              filter:
                action === 'SelectThirdHero' ? 'grayscale(0)' : 'grayscale(1)',
            }" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.blink {
  box-shadow: 0 0 2px 2px gold !important;
  animation: pulse 2s infinite;
}
</style>
