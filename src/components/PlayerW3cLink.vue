<script setup lang="ts">
import { computed } from "vue";

interface Props {
  battleTag: string;
  won?: boolean;
}
const props = withDefaults(defineProps<Props>(), { won: undefined });
const name = computed(() => props.battleTag?.split("#") ?? ["", ""]);
</script>

<template>
  <a
    :href="`https://www.w3champions.com/player/${encodeURIComponent(battleTag)}`"
    target="_blank"
    :class="{
      'text-success': won,
      'text-error': won !== undefined && !won,
      'text-white': won === undefined,
    }"
    >{{ name?.[0] }}
  </a>
</template>
