<script setup lang="ts">
import { type Race, raceIcon, raceName } from "@/stores/races.ts";

interface Props {
  race: Race;
  size?: number;
}
defineProps<Props>();
</script>

<template>
  <img
    :width="size ?? 30"
    :src="raceIcon[race]"
    :title="raceName[race]"
    style="vertical-align: middle" />
</template>
