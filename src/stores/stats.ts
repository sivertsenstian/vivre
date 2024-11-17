import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import _take from "lodash/take";
import _last from "lodash/last";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _forEach from "lodash/forEach";
import _sortBy from "lodash/sortBy";
import _toPairs from "lodash/toPairs";
import moment from "moment";
import { useSettingsStore } from "./settings";
import { Race } from "@/stores/races";
import type { IOngoing, IStatistics } from "@/utilities/types";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getRaceStatistics,
  getwins,
  isRace,
  opponentIsRace,
} from "@/utilities/matchcalculator";
import _groupBy from "lodash/groupBy";
import _round from "lodash/round";

export const useStatsStore = defineStore("stats", () => {
  const settings = useSettingsStore();
  const tag = computed(() => settings.data.battleTag);

  const searchResults = ref([]);
  const searching = ref(false);
  const latest = 20;

  const search = (name: string) =>
    `https://website-backend.w3champions.com/api/players/global-search?search=${encodeURIComponent(
      name,
    )}&pageSize=20`;

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

  const getMatchUrl = (id: string) =>
    `https://website-backend.w3champions.com/api/matches/${id}`;

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

      seasonActual = all;
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(rule))
        .filter((m: any) => isRace(tag.value, m, race));
      dayActual = all
        .filter((m: any) => moment(m.endTime).isAfter(today))
        .filter((m: any) => isRace(tag.value, m, race));

      const info = getInfo(tag.value, seasonActual);

      const season = {
        [Race.Human]: seasonActual.filter((m) =>
          isRace(tag.value, m, Race.Human),
        ),
        [Race.Orc]: seasonActual.filter((m) => isRace(tag.value, m, Race.Orc)),
        [Race.Undead]: seasonActual.filter((m) =>
          isRace(tag.value, m, Race.Undead),
        ),
        [Race.NightElf]: seasonActual.filter((m) =>
          isRace(tag.value, m, Race.NightElf),
        ),
        [Race.Random]: seasonActual.filter((m) =>
          isRace(tag.value, m, Race.Random),
        ),
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
                seasonActual.filter((m) => m?.durationInSeconds <= 120)
                  ?.length ?? 0,
              wins:
                seasonActual
                  .filter((m) => getwins(tag.value, m))
                  .filter((m) => m?.durationInSeconds <= 120)?.length ?? 0,
              loss:
                seasonActual
                  .filter((m) => getloss(tag.value, m))
                  .filter((m) => m?.durationInSeconds <= 120)?.length ?? 0,
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

  const ongoing = ref<IOngoing>();

  const getOpponentHistory = async (player: any, opponent: any) => {
    if (_isEmpty(opponent)) {
      return {
        wins: 0,
        loss: 0,
        total: 0,
        performance: [],
        last: [],
        heroes: [],
        games: {
          winDuration: 0,
          lossDuration: 0,
          isLamer: false,
        },
      };
    }

    try {
      const { data: historyResponse } = await axios.get(
        opponentHistoryUrl(tag.value, opponent.battleTag),
      );

      const matches = historyResponse?.matches ?? [];
      const performance = matches.map(
        (match: any) =>
          match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
          player.battleTag.toLowerCase(),
      );

      // Find hero usage from last 100 games in the season
      const season = await getAllSeasonGames(opponent.battleTag, latest, 100);
      const last = _take(
        season
          .filter((m) => m.durationInSeconds > 4 * 60)
          .filter((m) => isRace(opponent.battleTag, m, opponent.race))
          .filter((m) => opponentIsRace(opponent.battleTag, m, player.race)),
        10,
      );

      let m: any[] = [];
      for (let i = 0; i < last.length; i++) {
        const { data: ma } = await axios.get(getMatchUrl(last[i].id));
        m.push(ma);
      }

      let heroes: any = {};
      for (let i = 0; i < m.length; i++) {
        const score = m[i].playerScores.find(
          (s: any) =>
            s.battleTag.toLowerCase() === opponent.battleTag.toLowerCase(),
        );
        const key = score.heroes
          .map((h: any) => h.icon)
          // .sort()
          .join(",");

        if (heroes[key]) {
          heroes[key] += 1;
        } else {
          heroes[key] = 1;
        }
      }

      const wins = m
        .map((m: any) => m.match)
        .filter((x: any) => getwins(opponent.battleTag, x));
      const loss = m
        .map((m: any) => m.match)
        .filter((x: any) => getloss(opponent.battleTag, x));

      const winDuration = _round(
        wins.reduce((s, m) => s + m.durationInSeconds, 0) / wins.length / 60,
      );
      const lossDuration = _round(
        loss.reduce((s, m) => s + m.durationInSeconds, 0) / loss.length / 60,
      );

      const result = {
        performance,
        last: _take(performance, 5),
        wins: matches.filter((m: any) => getwins(player.battleTag, m)).length,
        loss: matches.filter((m: any) => getloss(player.battleTag, m)).length,
        total: historyResponse.count,
        heroes: _take(_sortBy(_toPairs(heroes), (v) => _last(v)).reverse(), 3),
        games: {
          winDuration,
          lossDuration,
          isLamer: winDuration >= 25 || lossDuration >= 25,
        },
      };
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const getOngoing = async (reset: boolean = false) => {
    let result = {
      id: null,
      start: null,
      active: false,
      player: { name: "", race: 0, battleTag: "", oldMmr: 0 },
      opponent: { name: "", race: 0, battleTag: "", oldMmr: 0 },
      map: "",
      server: {},
      history: {
        wins: 0,
        loss: 0,
        total: 0,
        performance: [],
        last: [],
        heroes: [],
        games: {
          winDuration: 0,
          lossDuration: 0,
          isLamer: false,
        },
      },
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
          history: (await getOpponentHistory(player, opponent)) as any,
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
    getOngoing(true);
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
    latest,
  };
});
