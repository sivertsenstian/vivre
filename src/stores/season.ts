import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { useSettingsStore } from "./settings";
import { Race } from "@/stores/races";
import type { IStatistics } from "@/utilities/types";
import { getMaps, getMatches, getLeaguesAndRankings } from "@/utilities/api.ts";
import { current_season } from "@/utilities/constants.ts";
import _values from "lodash/values";
import _maxBy from "lodash/maxBy";

export const useSeasonStore = defineStore("season", () => {
  const settings = useSettingsStore();
  const maps = ref<string[]>([]);
  const player = ref<IStatistics>();
  const initializing = ref(false);
  const season_offset = ref(0);
  const actual_season = computed(() => current_season - season_offset.value);
  const actual_season_ranking = ref<any>({});
  const season_rankings = ref<any[]>([]);

  const update = async () => {
    const results = await getMatches(
      actual_season.value,
      settings.battleTag,
      settings.race ?? Race.Random,
    );
    player.value = results.player;
    maps.value = await getMaps();

    if (settings.battleTag?.length) {
      const ranks = await getLeaguesAndRankings(
        settings.battleTag,
        current_season,
      );

      // find current rank
      const v = ranks.find((r) => _values(r)[0].season === actual_season.value);
      const values = _values(v);
      const highest = _maxBy(values, "level");
      actual_season_ranking.value = {
        highest,
        others: values.filter((v) => v.race !== highest.race),
        additional: true,
      };

      // process ranks and find the highest ranked for each season
      season_rankings.value =
        ranks
          .filter((r) => _values(r)[0].season !== actual_season.value)
          .map((r) => {
            const values = _values(r);
            const highest = _maxBy(values, "level");
            return {
              highest,
              others: values.filter((v) => v.race !== highest.race),
            };
          }) ?? [];
    }
  };

  watchEffect(async () => {
    try {
      initializing.value = true;
      await update();
    } finally {
      initializing.value = false;
    }
  });

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
      season_offset.value = 0;
    }
  };

  return {
    initializing,
    player,
    maps,
    subscribe,
    unsubscribe,
    season_offset,
    actual_season,
    actual_season_ranking,
    season_rankings,
  };
});
