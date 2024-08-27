<script setup lang="ts">
import { MdPreview } from "md-editor-v3";

const model = defineModel<string>({ default: "" });
</script>

<template>
  <md-preview
    preview-theme="github"
    no-katex
    no-mermaid
    no-img-zoom-in
    :codeFoldable="false"
    :autoFoldThreshold="0"
    :theme="'dark'"
    language="en-US"
    :modelValue="model"
  />
</template>

<style scoped></style>
