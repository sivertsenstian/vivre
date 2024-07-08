import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import _take from "lodash/take";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _maxBy from "lodash/maxBy";
import _forEach from "lodash/forEach";
import moment from "moment";
import { useSettingsStore } from "./settings";
import { Race } from "@/stores/races";
import type { IStatistics } from "@/utilities/types";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getplayer,
  getRaceStatistics,
  getwins,
} from "@/utilities/matchcalculator";
import _groupBy from "lodash/groupBy";

export const useStatsStore = defineStore("stats", () => {
  const settings = useSettingsStore();
  const tag = computed(() => settings.data.battleTag);

  const searchResults = ref([]);
  const searching = ref(false);
  const latest = 19;

  const search = (name: string) =>
    `https://website-backend.w3champions.com/api/players/global-search?search=${encodeURIComponent(
      name,
    )}&pageSize=20`;

  const url = (
    tag: string,
    offset: number = 0,
    size: number = 100,
    season: number = latest,
  ) =>
    `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
      tag,
    )}&gateway=20&offset=${offset}&pageSize=${size}&gameMode=1&season=${season}`;

  const currentUrl = (tag: string) =>
    `https://website-backend.w3champions.com/api/matches/ongoing/${encodeURIComponent(
      tag,
    )}`;

  const opponentHistoryUrl = (tag: string, opponent: string) =>
    `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
      tag,
    )}&opponentId=${encodeURIComponent(
      opponent,
    )}&pageSize=100&season=${latest}`;

  const opponentHeroOnMapVersusRace = (opponent: string) =>
    `https://website-backend.w3champions.com/api/player-stats/${encodeURIComponent(
      opponent,
    )}`;

  const gameModeStatsUrl = (tag: string, season: number) =>
    `https://website-backend.w3champions.com/api/players/${encodeURIComponent(
      tag,
    )}/game-mode-stats?gateway=20&season=${season}`;

  const daily = ref<{ count: number; matches: any[] }>({
    count: 0,
    matches: [],
  });
  const weekly = ref<{ count: number; matches: any[] }>({
    count: 0,
    matches: [],
  });
  const season = ref<{ count: number; matches: any[] }>({
    count: 0,
    matches: [],
  });

  const highscore = ref<any>({});

  const today = moment().startOf("day");
  const rule = moment().startOf("isoWeek");

  const player = ref<IStatistics>();

  const getHighScores = async () => {
    let result: any = {};
    highscore.value = { loading: true };
    try {
      for (let i = 1; i <= latest; i++) {
        const all = await getAllSeasonGames(tag.value, i);
        const g = _groupBy(
          all.map(getplayer(tag.value)),
          (p) => p.players[0].race,
        );

        _forEach(g, (matches, race) => {
          const s = _maxBy(matches, (p) => p.players[0].currentMmr)
            ?.players?.[0];

          if (
            !_isNil(s) &&
            (_isNil(result[s.race]) || s.currentMmr >= result[s.race].mmr)
          ) {
            result[s.race] = {
              race: s.race,
              mmr: s.currentMmr,
              season: i,
            };
          }
        });
      }
    } finally {
      highscore.value = result;
    }
  };

  const getMatches = async () => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getAllSeasonGames(tag.value, latest);

      const race = all?.[0]?.teams.find((t: any) =>
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
        ),
      )?.players?.[0]?.race;

      const isRace = (m: any, r: Race) =>
        m.teams.some((t: any) =>
          t.players.some(
            (p: any) =>
              p.battleTag.toLowerCase() === tag.value.toLowerCase() &&
              p.race === r,
          ),
        );
      seasonActual = all;
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(rule))
        .filter((m: any) => isRace(m, race));
      dayActual = all
        .filter((m: any) => moment(m.endTime).isAfter(today))
        .filter((m: any) => isRace(m, race));

      const info = getInfo(tag.value, seasonActual);

      const season = {
        [Race.Human]: seasonActual.filter((m) => isRace(m, Race.Human)),
        [Race.Orc]: seasonActual.filter((m) => isRace(m, Race.Orc)),
        [Race.Undead]: seasonActual.filter((m) => isRace(m, Race.Undead)),
        [Race.NightElf]: seasonActual.filter((m) => isRace(m, Race.NightElf)),
        [Race.Random]: seasonActual.filter((m) => isRace(m, Race.Random)),
      };

      result = {
        battleTag: info.battleTag,
        race: info.race,
        day: getRaceStatistics(tag.value, dayActual),
        week: getRaceStatistics(tag.value, weekActual),
        season: {
          summary: {
            ...getRaceStatistics(tag.value, seasonActual),
            suspiciousGames: {
              total:
                seasonActual.filter((m) => m?.durationInSeconds <= 240)
                  ?.length ?? 0,
              wins:
                seasonActual
                  .filter((m) => getwins(tag.value, m))
                  .filter((m) => m?.durationInSeconds <= 240)?.length ?? 0,
              loss:
                seasonActual
                  .filter((m) => getloss(tag.value, m))
                  .filter((m) => m?.durationInSeconds <= 240)?.length ?? 0,
            },
          },
          [Race.Random]: getRaceStatistics(tag.value, season[Race.Random]),
          [Race.Human]: getRaceStatistics(tag.value, season[Race.Human]),
          [Race.Orc]: getRaceStatistics(tag.value, season[Race.Orc]),
          [Race.Undead]: getRaceStatistics(tag.value, season[Race.Undead]),
          [Race.NightElf]: getRaceStatistics(tag.value, season[Race.NightElf]),
        },
      };
    } catch (error) {
      console.log(error);
    } finally {
      player.value = result;
      daily.value = { matches: dayActual, count: dayActual.length };
      weekly.value = { matches: weekActual, count: weekActual.length };
      season.value = { matches: seasonActual, count: seasonActual.length };
    }
  };

  setInterval(() => {
    getMatches();
  }, 60000);

  const ongoing = ref({
    id: null,
    start: null,
    active: false,
    player: { name: "", race: 0, battleTag: "", oldMmr: 0 },
    opponent: { name: "", race: 0, battleTag: "", oldMmr: 0 },
    map: "",
    server: {},
    history: { wins: 0, loss: 0, total: 0, performance: [], last: [] },
  });

  const getOpponentHistory = async (opponent: string) => {
    let history = {
      hero: {},
      wins: 0,
      loss: 0,
      total: 0,
      performance: [],
      last: [],
    };

    if (_isEmpty(opponent)) {
      return history;
    }

    try {
      const { data: historyResponse } = await axios.get(
        opponentHistoryUrl(tag.value, opponent),
      );

      const matches = historyResponse?.matches ?? [];
      const performance = matches.map(
        (match: any) =>
          match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
          settings.data.battleTag.toLowerCase(),
      );

      // const { data: heroStats } = await axios.get(
      //   opponentHeroOnMapVersusRace(opponent),
      // );

      history = {
        // hero: heroStats,
        hero: {},
        performance,
        last: _take(performance, 5),
        wins: matches.filter((m: any) => getwins(tag.value, m)).length,
        loss: matches.filter((m: any) => getloss(tag.value, m)).length,
        total: historyResponse.count,
      };
    } catch (error) {
      console.log(error);
    } finally {
      return history;
    }
  };

  const getOngoing = async () => {
    let result = {
      id: null,
      start: null,
      active: false,
      player: { name: "", race: 0, battleTag: "", oldMmr: 0 },
      opponent: { name: "", race: 0, battleTag: "", oldMmr: 0 },
      map: "",
      server: {},
      history: { wins: 0, loss: 0, total: 0, performance: [], last: [] },
    };

    try {
      const { data: onGoingResponse } = await axios.get(currentUrl(tag.value));
      if (!_isNil(onGoingResponse?.id)) {
        const player = onGoingResponse.teams?.find((t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
          ),
        )?.players?.[0];
        const opponent = onGoingResponse.teams?.find((t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() != tag.value.toLowerCase(),
          ),
        )?.players?.[0];

        result = {
          id: onGoingResponse.id,
          start: moment(onGoingResponse.startTime) as any,
          active: true,
          player,
          opponent,
          map: onGoingResponse.mapName,
          server: onGoingResponse.serverInfo,
          history: await getOpponentHistory(opponent.battleTag),
        };
      }
    } catch (error) {
      console.log(error);
    } finally {
      ongoing.value = result;
    }
  };

  setInterval(() => {
    getOngoing();
  }, 10000);

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

  watchEffect(() => {
    getMatches();
    getOngoing();
    getHighScores();
  });

  return {
    season,
    weekly,
    daily,
    getMatches,
    player,
    ongoing,
    getBattleTag,
    searchResults,
    searching,
    highscore,
  };
});
