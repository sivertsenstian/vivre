<script setup lang="ts">
import { useHotKeyStormStore } from '@/games/hotkeystorm/store.ts';

const store = useHotKeyStormStore();

interface Props {
  code: string;
}
defineProps<Props>();
</script>

<template>
  <v-text-field
    clearable
    :placeholder="
      store.getHotkeyFromCode(code) === code
        ? 'None'
        : store.getHotkeyFromCode(code)
    "
    v-model="store.data.inventory[code]"
    @keydown="
      (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (['Control', 'Alt', 'Shift'].some((v) => v === event.key)) {
          return;
        }
        let capture = '';
        if (event.ctrlKey) {
          capture += 'CTRL + ';
        }

        if (event.altKey) {
          capture += 'ALT + ';
        }

        if (event.shiftKey) {
          capture += 'SHIFT + ';
        }

        capture += event.key.toUpperCase();

        store.data.inventory[code] = capture;
      }
    "
    @update:model-value="
      () => {
        return false;
      }
    "
    hide-details
    variant="underlined"
    density="compact" />
</template>

<style scoped></style>
