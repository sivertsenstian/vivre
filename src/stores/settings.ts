import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import moment from "moment";

export const useSettingsStore = defineStore("settings", () => {
  const modes = ["week", "month", "season"];

  const data = useStorage("vivre/settings", {
    battleTag: "",
    goal: 1,
    mmr: null,
    mode: "week", // 'week', 'month', 'season'
    challengers: [null, null],
    ladder: "",
  });

  return { data, modes };
});
