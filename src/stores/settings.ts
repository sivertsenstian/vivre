import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { computed, ref, watchEffect } from "vue";
import { getW3CProfilePicture } from "@/utilities/api.ts";

export const useSettingsStore = defineStore("settings", () => {
  const modes = ["week", "month", "season"];

  const data = useStorage("vivre/settings", {
    profilePicture: "",
    battleTag: "",
    race: undefined,
    goal: 1,
    mmr: null,
    mode: "week", // 'week', 'month', 'season'
    challengers: [null, null],
    ladder: "",
  });

  const battleTag = computed(() => data.value.battleTag);
  const race = computed(() => data.value.race);
  const profilePicture = computed(() => data.value.profilePicture);

  watchEffect(async () => {
    if (data.value?.battleTag?.length) {
      data.value.profilePicture =
        (await getW3CProfilePicture(data.value.battleTag)) ?? "";
    }
  });

  return { data, modes, battleTag, race, profilePicture };
});
