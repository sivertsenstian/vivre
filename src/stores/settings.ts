import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', () => {
  const data = useStorage("poc/settings", { battleTag: "", goal: 0 });

  return { data }
})
