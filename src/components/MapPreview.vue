<script setup lang="ts">
import { ladder_1v1, missing } from "@/utilities/maps";

interface Props {
  name: string;
}
defineProps<Props>();
</script>

<template>
  <img
    :width="75"
    :src="ladder_1v1[name] ?? missing"
    style="border: 3px solid #555" />
</template>
