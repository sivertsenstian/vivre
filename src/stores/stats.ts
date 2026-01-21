import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import _isNil from "lodash/isNil";
import { useSettingsStore } from "./settings";
import { Race } from "@/stores/races";
import type { IOngoing, IStatistics } from "@/utilities/types";
import {
  getPlayerInformation,
  getLeagueAndRanking,
  getMaps,
  getOngoing,
  getMatches,
} from "@/utilities/api.ts";
import { current_season } from "@/utilities/constants.ts";

export const useStatsStore = defineStore("stats", () => {
  const settings = useSettingsStore();
  const maps = ref<string[]>([]);
  const player = ref<IStatistics>();
  const ranking = ref<any>();
  const challengers = ref<Record<string, IStatistics>>({});
  const ongoing = ref<IOngoing>();

  watchEffect(async () => {
    const results = await getMatches(
      settings.battleTag,
      settings.race ?? Race.Random,
    );
    player.value = results.player;
    maps.value = await getMaps();

    if (player.value?.battleTag?.length) {
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
      const c = await getMatches(challenger, challenger_information.race);
      challengers.value[challenger] = c.player;
    }
  });

  const subscription = ref<number | null>(null);

  const subscribe = () => {
    if (subscription.value === null) {
      subscription.value = setInterval(async () => {
        const results = await getMatches(
          settings.battleTag,
          settings.race ?? Race.Random,
        );
        player.value = results.player;

        if (player.value?.battleTag?.length) {
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
          const c = await getMatches(challenger, challenger_information.race);
          challengers.value[challenger] = c.player;
        }
      }, 30000);
    }
  };

  const unsubscribe = () => {
    if (subscription.value !== null) {
      clearInterval(subscription.value);
      subscription.value = null;
    }
  };

  return {
    player,
    challengers,
    ongoing,
    maps,
    subscribe,
    unsubscribe,
    ranking,
  };
});
