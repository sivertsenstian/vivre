import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import _isNil from "lodash/isNil";
import { useSettingsStore } from "./settings";
import type { IOngoing, IStatistics } from "@/utilities/types";
import {
  getPlayerInformation,
  getLeagueAndRanking,
  getOngoing,
  getMatches,
} from "@/utilities/api.ts";
import { current_season } from "@/utilities/constants.ts";

export const useLiveStore = defineStore("live", () => {
  const settings = useSettingsStore();
  const ranking = ref<any>();
  const challengers = ref<Record<string, IStatistics>>({});
  const ongoing = ref<IOngoing>();

  const update = async () => {
    if (settings.battleTag.length) {
      ongoing.value = await getOngoing(settings.battleTag, true);
      ranking.value = await getLeagueAndRanking(
        settings.battleTag,
        current_season,
        ranking.value,
      );
    }

    for (const challenger of settings.data.challengers.filter(
      (v) => !_isNil(v),
    )) {
      const challenger_information = await getPlayerInformation(
        challenger,
        current_season,
      );
      const c = await getMatches(
        current_season,
        challenger,
        challenger_information.race,
      );
      challengers.value[challenger] = c.player;
    }
  };

  // Fetch data on load and when any computed changes
  watchEffect(update);

  // Subscribe to auto-update every n interval
  const subscription = ref<number | null>(null);
  const subscribe = (interval = 30000) => {
    if (subscription.value === null) {
      subscription.value = setInterval(update, interval);
    }
  };

  const unsubscribe = () => {
    if (subscription.value !== null) {
      clearInterval(subscription.value);
      subscription.value = null;
    }
  };

  return {
    challengers,
    ongoing,
    subscribe,
    unsubscribe,
    ranking,
  };
});
