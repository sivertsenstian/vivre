<script setup lang="ts">
interface Props {
  name: any;
}
defineProps<Props>();
</script>

<template>
  <a
    title="Click to visit the creep route planner for this map!"
    :href="`https://coff-creeps.web.app?category=w3c 1v1&map=${name}`"
    target="_blank"
    ><span class="font-weight-bold" style="vertical-align: middle">{{
      name
    }}</span>
    <v-icon
      icon="mdi-link"
      size="x-small"
      class="ml-1"
      style="color: goldenrod; vertical-align: sub"
  /></a>
</template>
