import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import _isNil from "lodash/isNil";
import _forEach from "lodash/forEach";
import moment from "moment";
import { useSettingsStore } from "./settings";
import { Race } from "@/stores/races";
import type { IStatistics } from "@/utilities/types";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getRaceStatistics,
  getwins,
  isRace,
} from "@/utilities/matchcalculator";
import _groupBy from "lodash/groupBy";
import { search } from "@/utilities/api.ts";

export const useSeasonStore = defineStore("season", () => {
  const settings = useSettingsStore();
  const tag = computed(() => settings.data.battleTag);

  const searchResults = ref([]);
  const searching = ref(false);
  const latest = 23;

  const gameModeStatsUrl = (tag: string, season: number) =>
    `https://website-backend.w3champions.com/api/players/${encodeURIComponent(
      tag,
    )}/game-mode-stats?gateway=20&season=${season}`;

  const getMapsUrl = () =>
    "https://website-backend.w3champions.com/api/ladder/active-modes";

  const daily = ref<{ count: number; matches: any[] }>({
    count: 0,
    matches: [],
  });
  const weekly = ref<{ count: number; matches: any[] }>({
    count: 0,
    matches: [],
  });
  const monthly = ref<{ count: number; matches: any[] }>({
    count: 0,
    matches: [],
  });
  const season = ref<{ count: number; matches: any[] }>({
    count: 0,
    matches: [],
  });
  const maps = ref<string[]>([]);

  const highscore = ref<any>({});

  const today = moment().startOf("day");
  const weekRule = moment().startOf("isoWeek");
  const monthRule = moment().startOf("month");

  const player = ref<IStatistics>();

  const getMaps = async () => {
    try {
      const { data: modes } = await axios.get(getMapsUrl());
      return (
        modes
          ?.find((m: any) => m.id === 1)
          ?.maps?.map((m: any) => m.name)
          ?.sort() ?? []
      );
    } catch (e) {
      return [];
    }
  };

  const getHighScores = async () => {
    let result: any = {};
    highscore.value = { loading: true };
    try {
      for (let i = 1; i <= latest; i++) {
        const { data: stats } = await axios.get(gameModeStatsUrl(tag.value, i));
        const g = _groupBy(
          stats.filter((s: any) => s.gameMode === 1 && s.race !== null),
          (v) => v.race,
        );

        _forEach(g, ([s]) => {
          if (
            !_isNil(s) &&
            (_isNil(result[s.race]) || s.mmr >= result[s.race].mmr)
          ) {
            result[s.race] = {
              race: s.race,
              mmr: s.mmr,
              season: i,
            };
          }
        });
      }
    } finally {
      highscore.value = result;
    }
  };

  const getMatches = async (btag: string) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let monthActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getAllSeasonGames(btag, latest);

      const race = all?.[0]?.teams.find((t: any) =>
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === btag.toLowerCase(),
        ),
      )?.players?.[0]?.race;

      seasonActual = all;
      monthActual = all
        .filter((m: any) => moment(m.endTime).isAfter(monthRule))
        .filter((m: any) => isRace(btag, m, race));
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(weekRule))
        .filter((m: any) => isRace(btag, m, race));
      dayActual = all
        .filter((m: any) => moment(m.endTime).isAfter(today))
        .filter((m: any) => isRace(btag, m, race));

      const info = getInfo(btag, seasonActual);

      const season = {
        [Race.Human]: seasonActual.filter((m) => isRace(btag, m, Race.Human)),
        [Race.Orc]: seasonActual.filter((m) => isRace(btag, m, Race.Orc)),
        [Race.Undead]: seasonActual.filter((m) => isRace(btag, m, Race.Undead)),
        [Race.NightElf]: seasonActual.filter((m) =>
          isRace(btag, m, Race.NightElf),
        ),
        [Race.Random]: seasonActual.filter((m) => isRace(btag, m, Race.Random)),
      };

      result = {
        battleTag: info.battleTag ?? btag,
        race: info.race ?? Race.Random,
        day: getRaceStatistics(btag, dayActual),
        week: getRaceStatistics(btag, weekActual),
        month: getRaceStatistics(btag, monthActual),
        season: {
          summary: {
            ...getRaceStatistics(btag, seasonActual),
            suspiciousGames: {
              total:
                seasonActual.filter((m) => m?.durationInSeconds <= 120)
                  ?.length ?? 0,
              wins:
                seasonActual
                  .filter((m) => getwins(btag, m))
                  .filter((m) => m?.durationInSeconds <= 120)?.length ?? 0,
              loss:
                seasonActual
                  .filter((m) => getloss(btag, m))
                  .filter((m) => m?.durationInSeconds <= 120)?.length ?? 0,
            },
          },
          [Race.Random]: getRaceStatistics(btag, season[Race.Random]),
          [Race.Human]: getRaceStatistics(btag, season[Race.Human]),
          [Race.Orc]: getRaceStatistics(btag, season[Race.Orc]),
          [Race.Undead]: getRaceStatistics(btag, season[Race.Undead]),
          [Race.NightElf]: getRaceStatistics(btag, season[Race.NightElf]),
        },
      };
    } catch (error) {
      console.log(error);
    }

    return {
      player: result,
      day: { matches: dayActual, count: dayActual.length },
      week: { matches: weekActual, count: weekActual.length },
      month: { matches: monthActual, count: monthActual.length },
      season: { matches: seasonActual, count: seasonActual.length },
    };
  };

  const update = async () => {
    const results = await getMatches(tag.value);
    player.value = results.player;
    daily.value = results.day;
    weekly.value = results.week;
    monthly.value = results.month;
    season.value = results.season;
  };

  void update();
  setInterval(update, 10000);

  const getBattleTag = async (input: string) => {
    if (input.length < 3) {
      return;
    }

    try {
      searching.value = true;
      const { data: results } = await axios.get(search(input));
      searchResults.value = results;
    } catch (error) {
      console.log(error);
    } finally {
      searching.value = false;
    }
  };

  watchEffect(async () => {
    const results = await getMatches(tag.value);
    player.value = results.player;
    daily.value = results.day;
    weekly.value = results.week;
    monthly.value = results.month;
    season.value = results.season;
    maps.value = await getMaps();

    void getHighScores();
  });

  return {
    season,
    weekly,
    daily,
    player,
    getBattleTag,
    searchResults,
    searching,
    highscore,
    latest,
    maps,
  };
});
