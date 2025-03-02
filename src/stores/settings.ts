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

  const season = 20;
  const seasonDurationInWeeks = 15;
  const start = moment("07.10.24", "DD.MM.YYYY");
  const end = moment(start).add(seasonDurationInWeeks, "weeks");
  const duration = Math.abs(end.diff(start, "days"));

  return { data, modes, season, duration, start, end };
});
