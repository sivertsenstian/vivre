import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import _take from "lodash/take";
import _last from "lodash/last";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
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
  getplayer,
  getPlayerInformation,
  getRaceStatistics,
  getwins,
  isRace,
  opponentIsRace,
} from "@/utilities/matchcalculator";
import _round from "lodash/round";
import { search } from "@/utilities/api.ts";
import _groupBy from "lodash/groupBy";
import _forEach from "lodash/forEach";
import {
  current_season,
  current_week,
  current_month,
  today,
} from "@/utilities/constants.ts";

export const useStatsStore = defineStore("stats", () => {
  const settings = useSettingsStore();
  const settings_battleTag = computed(() => settings.data.battleTag);
  const settings_race = computed(() => settings.data.race);

  const searchResults = ref([]);
  const searching = ref(false);

  const currentUrl = (tag: string) =>
    `https://website-backend.w3champions.com/api/matches/ongoing/${encodeURIComponent(
      tag,
    )}`;

  const opponentHistoryUrl = (tag: string, opponent: string) =>
    `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
      tag,
    )}&opponentId=${encodeURIComponent(
      opponent,
    )}&pageSize=100&season=${current_season}`;

  const getMatchUrl = (id: string) =>
    `https://website-backend.w3champions.com/api/matches/${id}`;

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

  const player = ref<IStatistics>();
  const ranking = ref<any>();
  const challengers = ref<Record<string, IStatistics>>({});

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

  const gameModeStatsUrl = (tag: string, season: number) =>
    `https://website-backend.w3champions.com/api/players/${encodeURIComponent(
      tag,
    )}/game-mode-stats?gateway=20&season=${season}`;

  const getLeagueAndRanking = async () => {
    let result: any = {};
    ranking.value = {
      ...ranking.value,
      tag: settings_battleTag,
      loading: true,
    };
    try {
      const { data: stats } = await axios.get(
        gameModeStatsUrl(settings_battleTag.value, current_season),
      );
      const g = _groupBy(
        stats.filter((s: any) => s.gameMode === 1 && s.race !== null),
        (v) => v.race,
      );

      _forEach(g, ([s]) => {
        if (
          !_isNil(s) &&
          (_isNil(result[s.race]) || s.mmr >= result[s.race].mmr)
        ) {
          const progress = s.rankingPoints - Math.floor(s.rankingPoints);
          const previous =
            ranking.value.tag === settings_battleTag
              ? (ranking.value?.[s.race]?.levelProgress ?? progress)
              : progress;

          result[s.race] = {
            race: s.race,
            mmr: s.mmr,
            rank: s.rank,
            level: s.rankingPoints,
            levelLabel: Math.floor(s.rankingPoints),
            levelProgress: previous,
            levelProgressRecent: progress,
            league: s.leagueOrder,
            division: s.division,
            wins: s.wins,
            losses: s.losses,
            winrate: s.winrate,
            quantile: s.quantile,
            season: current_season,
          };
        }
      });
    } finally {
      ranking.value = result;
    }
  };

  const getMatches = async (battleTag: string, race: Race) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let monthActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getAllSeasonGames(battleTag, current_season);
      seasonActual = all;

      monthActual = all
        .filter((m: any) => moment(m.endTime).isAfter(current_month))
        .filter((m: any) => isRace(battleTag, m, race));
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(current_week))
        .filter((m: any) => isRace(battleTag, m, race));
      dayActual = all
        .filter((m: any) => moment(m.endTime).isAfter(today))
        .filter((m: any) => isRace(battleTag, m, race));

      const season = {
        [Race.Human]: seasonActual.filter((m) =>
          isRace(battleTag, m, Race.Human),
        ),
        [Race.Orc]: seasonActual.filter((m) => isRace(battleTag, m, Race.Orc)),
        [Race.Undead]: seasonActual.filter((m) =>
          isRace(battleTag, m, Race.Undead),
        ),
        [Race.NightElf]: seasonActual.filter((m) =>
          isRace(battleTag, m, Race.NightElf),
        ),
        [Race.Random]: seasonActual.filter((m) =>
          isRace(battleTag, m, Race.Random),
        ),
      };

      result = {
        battleTag: battleTag,
        race: race,
        day: getRaceStatistics(battleTag, dayActual),
        week: getRaceStatistics(battleTag, weekActual),
        month: getRaceStatistics(battleTag, monthActual),
        season: {
          summary: {
            ...getRaceStatistics(battleTag, seasonActual),
            suspiciousGames: {
              total:
                seasonActual.filter((m) => m?.durationInSeconds <= 120)
                  ?.length ?? 0,
              wins:
                seasonActual
                  .filter((m) => getwins(battleTag, m))
                  .filter((m) => m?.durationInSeconds <= 120)?.length ?? 0,
              loss:
                seasonActual
                  .filter((m) => getloss(battleTag, m))
                  .filter((m) => m?.durationInSeconds <= 120)?.length ?? 0,
            },
          },
          [Race.Random]: getRaceStatistics(battleTag, season[Race.Random]),
          [Race.Human]: getRaceStatistics(battleTag, season[Race.Human]),
          [Race.Orc]: getRaceStatistics(battleTag, season[Race.Orc]),
          [Race.Undead]: getRaceStatistics(battleTag, season[Race.Undead]),
          [Race.NightElf]: getRaceStatistics(battleTag, season[Race.NightElf]),
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
        opponentHistoryUrl(settings_battleTag.value, opponent.battleTag),
      );

      const matches = historyResponse?.matches ?? [];
      const performance = matches.map(
        (match: any) =>
          match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
          player.battleTag.toLowerCase(),
      );

      // Find hero usage from last 100 games in the season
      const season = await getAllSeasonGames(
        opponent.battleTag,
        current_season,
        100,
      );
      const relevant_matches = season
        .filter((m) => m.durationInSeconds > 4 * 60)
        .filter((m) => isRace(opponent.battleTag, m, opponent.race))
        .filter((m) => opponentIsRace(opponent.battleTag, m, player.race));

      let heroes: any = {};
      const getOpponent = getplayer(opponent.battleTag);
      for (let i = 0; i < relevant_matches.length; i++) {
        const m = relevant_matches[i];
        const score = getOpponent(m)?.players[0];
        const key = score.heroes.map((h: any) => h.icon).join(",");

        if (heroes[key]) {
          heroes[key] += 1;
        } else {
          heroes[key] = 1;
        }
      }

      const wins = relevant_matches
        .map((m: any) => m.match)
        .filter((x: any) => getwins(opponent.battleTag, x));
      const loss = relevant_matches
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
      if (!_isNil(settings_battleTag.value)) {
        const { data: onGoingResponse } = await axios.get(
          currentUrl(settings_battleTag.value),
        );
        if (!_isNil(onGoingResponse?.id)) {
          const player = onGoingResponse.teams?.find((t: any) =>
            t.players.some(
              (p: any) =>
                p.battleTag.toLowerCase() ===
                settings_battleTag.value.toLowerCase(),
            ),
          )?.players?.[0];
          const opponent = onGoingResponse.teams?.find((t: any) =>
            t.players.some(
              (p: any) =>
                p.battleTag.toLowerCase() !=
                settings_battleTag.value.toLowerCase(),
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      ongoing.value = result;
    }
  };

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
    const results = await getMatches(
      settings_battleTag.value,
      settings_race?.value ?? Race.Random,
    );
    player.value = results.player;
    daily.value = results.day;
    weekly.value = results.week;
    monthly.value = results.month;
    season.value = results.season;
    maps.value = await getMaps();

    if (player.value?.battleTag?.length) {
      void getOngoing(true);
      void getLeagueAndRanking();
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
          settings_battleTag.value,
          settings_race.value ?? Race.Random,
        );
        player.value = results.player;
        daily.value = results.day;
        weekly.value = results.week;
        monthly.value = results.month;
        season.value = results.season;

        if (player.value?.battleTag?.length) {
          void getOngoing(true);
          void getLeagueAndRanking();
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
      }, 10000);
    }
  };

  const unsubscribe = () => {
    if (subscription.value !== null) {
      clearInterval(subscription.value);
      subscription.value = null;
    }
  };

  return {
    season,
    weekly,
    daily,
    player,
    challengers,
    ongoing,
    getBattleTag,
    searchResults,
    searching,
    maps,
    subscribe,
    unsubscribe,
    ranking,
  };
});
