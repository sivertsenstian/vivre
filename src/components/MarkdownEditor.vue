<script setup lang="ts">
import { MdEditor } from "md-editor-v3";

const model = defineModel<string>({ default: "" });
</script>

<template>
  <md-editor
    v-model="model"
    placeholder="Guide (optional) - Markdown is supported - click the icon on the far right to preview how it will end up!"
    language="en-US"
    :theme="'dark'"
    preview-theme="github"
    :preview="false"
    code-theme="atom"
    no-mermaid
    no-katex
    no-upload-img
    :toolbars="[
      'bold',
      'underline',
      'italic',
      '-',
      'strikeThrough',
      'title',
      'sub',
      'sup',
      'quote',
      'unorderedList',
      'orderedList',
      '-',
      'link',
      'table',
      '=',
      'revoke',
      'next',
      'pageFullscreen',
      'previewOnly',
    ]"
    :footers="[]"
  />
</template>

<style scoped></style>
