import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import { useSettingsStore } from "./settings";
import { getLeaguesAndRankings } from "@/utilities/api.ts";
import { current_season } from "@/utilities/constants.ts";
import _maxBy from "lodash/maxBy";
import _values from "lodash/values";

export const useSeasonStore = defineStore("season", () => {
  const settings = useSettingsStore();
  const ranking = ref<any[]>([]);
  const current = ref<any>({});
  const loading = ref(false);

  watchEffect(async () => {
    loading.value = true;
    const ranks = await getLeaguesAndRankings(
      settings.battleTag,
      current_season,
    );

    // find current rank
    const v = ranks.find((r) => _values(r)[0].season === current_season);
    const values = _values(v);
    const highest = _maxBy(values, "level");
    current.value = {
      highest,
      others: values.filter((v) => v.race !== highest.race),
    };

    // process ranks and find the highest ranked for each season
    ranking.value =
      ranks
        .filter((r) => _values(r)[0].season !== current_season)
        .map((r) => {
          const values = _values(r);
          const highest = _maxBy(values, "level");
          return {
            highest,
            others: values.filter((v) => v.race !== highest.race),
          };
        }) ?? [];
    loading.value = false;
  });
  const subscription = ref<number | null>(null);

  const subscribe = () => {
    if (subscription.value === null) {
      subscription.value = setInterval(async () => {
        const ranks = await getLeaguesAndRankings(
          settings.battleTag,
          current_season,
        );

        // find current rank
        const v = ranks.find((r) => _values(r)[0].season === current_season);
        const values = _values(v);
        const highest = _maxBy(values, "level");
        current.value = {
          highest,
          others: values.filter((v) => v.race !== highest.race),
        };

        // process ranks and find the highest ranked for each season
        ranking.value =
          ranks
            .filter((r) => _values(r)[0].season !== current_season)
            .map((r) => {
              const values = _values(r);
              const highest = _maxBy(values, "level");
              return {
                highest,
                others: values.filter((v) => v.race !== highest.race),
              };
            }) ?? [];
      }, 30000);
    }
  };

  const unsubscribe = () => {
    if (subscription.value !== null) {
      clearInterval(subscription.value);
      subscription.value = null;
    }
  };

  return { current, ranking, loading, subscribe, unsubscribe };
});
