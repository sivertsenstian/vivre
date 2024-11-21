import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import moment from "moment";

export const useSettingsStore = defineStore("settings", () => {
  const modes = ["week", "month", "season"];

  const data = useStorage("vivre/settings", {
    battleTag: "",
    goal: 7,
    mmr: null,
    mode: "week", // 'week', 'month', 'season'
    challengers: [null, null],
  });

  const season = 20;
  const start = moment("07.10.24", "DD.MM.YYYY");
  const end = moment(start).add(15, "weeks");

  return { data, modes, season, start, end };
});
