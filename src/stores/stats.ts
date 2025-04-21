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
  getRaceStatistics,
  getwins,
  isRace,
  opponentIsRace,
} from "@/utilities/matchcalculator";
import _round from "lodash/round";
import { search } from "@/utilities/api.ts";
import _groupBy from "lodash/groupBy";
import _forEach from "lodash/forEach";

export const useStatsStore = defineStore("stats", () => {
  const settings = useSettingsStore();
  const tag = computed(() => settings.data.battleTag);

  const searchResults = ref([]);
  const searching = ref(false);
  const latest = 21;

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

  const today = moment().startOf("day");
  const weekRule = moment().startOf("isoWeek");
  const monthRule = moment().startOf("month");

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
    ranking.value = { ...ranking.value, tag, loading: true };
    try {
      const { data: stats } = await axios.get(
        gameModeStatsUrl(tag.value, latest),
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
            ranking.value.tag === tag
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
            season: latest,
          };
        }
      });
    } finally {
      ranking.value = result;
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
      seasonActual = all;
      const info = getInfo(btag, seasonActual);
      const race = info.race ?? Race.Random;

      monthActual = all
        .filter((m: any) => moment(m.endTime).isAfter(monthRule))
        .filter((m: any) => isRace(btag, m, race));
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(weekRule))
        .filter((m: any) => isRace(btag, m, race));
      dayActual = all
        .filter((m: any) => moment(m.endTime).isAfter(today))
        .filter((m: any) => isRace(btag, m, race));

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
        race: race,
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
      if (!_isNil(tag.value)) {
        const { data: onGoingResponse } = await axios.get(
          currentUrl(tag.value),
        );
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
    const results = await getMatches(tag.value);
    player.value = results.player;
    daily.value = results.day;
    weekly.value = results.week;
    monthly.value = results.month;
    season.value = results.season;
    maps.value = await getMaps();

    void getOngoing(true);
    void getLeagueAndRanking();

    for (const challenger of settings.data.challengers.filter(
      (v) => !_isNil(v),
    )) {
      const c = await getMatches(challenger);
      challengers.value[challenger] = c.player;
    }
  });

  const subscription = ref<number | null>(null);

  const subscribe = () => {
    if (subscription.value === null) {
      subscription.value = setInterval(async () => {
        const results = await getMatches(tag.value);
        player.value = results.player;
        daily.value = results.day;
        weekly.value = results.week;
        monthly.value = results.month;
        season.value = results.season;

        void getOngoing();
        void getLeagueAndRanking();

        for (const challenger of settings.data.challengers.filter(
          (v) => !_isNil(v),
        )) {
          const c = await getMatches(challenger);
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
    latest,
    maps,
    subscribe,
    unsubscribe,
    ranking,
  };
});
