import _isNil from "lodash/isNil";
import axios from "axios";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getplayer,
  getRaceStatistics,
  getwins,
  isRace,
  opponentIsRace,
} from "@/utilities/matchcalculator.ts";
import {
  current_month,
  current_season,
  current_week,
  today,
} from "@/utilities/constants.ts";
import _groupBy from "lodash/groupBy";
import _forEach from "lodash/forEach";
import _isEmpty from "lodash/isEmpty";
import _round from "lodash/round";
import _take from "lodash/take";
import _sortBy from "lodash/sortBy";
import _toPairs from "lodash/toPairs";
import _last from "lodash/last";
import moment from "moment/moment";
import { Race } from "@/stores/races.ts";
import type { IStatistics } from "@/utilities/types.ts";

// URLS
const gameModeStatsUrl = (tag: string, season: number) =>
  `https://website-backend.w3champions.com/api/players/${encodeURIComponent(
    tag,
  )}/game-mode-stats?gateway=20&season=${season}`;

const getMapsUrl = () =>
  "https://website-backend.w3champions.com/api/ladder/active-modes";

const opponentHistoryUrl = (tag: string, opponent: string) =>
  `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
    tag,
  )}&opponentId=${encodeURIComponent(
    opponent,
  )}&pageSize=100&season=${current_season}`;

export const currentUrl = (tag: string) =>
  `https://website-backend.w3champions.com/api/matches/ongoing/${encodeURIComponent(
    tag,
  )}`;

export const search = (name: string) =>
  `https://website-backend.w3champions.com/api/players/global-search?search=${encodeURIComponent(
    name,
  )}&pageSize=20`;

const matchesUrl = (
  tag: string,
  offset: number = 0,
  size: number = 100,
  season: number = current_season,
) =>
  `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
    tag,
  )}&gateway=20&offset=${offset}&pageSize=${size}&gameMode=1&season=${season}`;

// GET
export const getPlayerInformation = async (tag: string, season: number) => {
  if (!_isNil(tag) && tag.includes("#")) {
    const { data: response } = await axios.get(matchesUrl(tag, 0, 1, season));
    return getInfo(tag, response.matches);
  }
};

export const getBattleTag = async (input: string) => {
  if (input.length < 3) {
    return;
  }

  let result = [];
  try {
    const response = await axios.get(search(input));
    result = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    return result;
  }
};

export const getMaps = async () => {
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

export const getLeagueAndRanking = async (
  battleTag: string,
  season: number,
  p = {},
) => {
  let result: any = {};
  const ranking: any = {
    ...p,
    tag: battleTag,
    loading: true,
  };
  try {
    const { data: stats } = await axios.get(
      gameModeStatsUrl(battleTag, season),
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
          ranking.tag === battleTag
            ? (ranking?.[s.race]?.levelProgress ?? progress)
            : progress;

        result[s.race] = {
          race: Number(s.race),
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
    return result;
  }
};

export const getLeaguesAndRankings = async (
  battleTag: string,
  season: number,
) => {
  let all: any[] = [];
  try {
    for (let s = 0; s <= season; s++) {
      let result: any = {};
      const { data: stats } = await axios.get(gameModeStatsUrl(battleTag, s));
      const g = _groupBy(
        stats.filter((s: any) => s.gameMode === 1 && s.race !== null),
        (v) => v.race,
      );
      _forEach(g, ([s]) => {
        if (
          !_isNil(s) &&
          (_isNil(result[s.race]) || s.mmr >= result[s.race].mmr) &&
          s.rank > 0
        ) {
          result[s.race] = {
            race: Number(s.race),
            mmr: s.mmr,
            rank: s.rank,
            level: s.rankingPoints,
            levelLabel: Math.floor(s.rankingPoints),
            league: s.leagueOrder,
            division: s.division,
            wins: s.wins,
            losses: s.losses,
            winrate: s.winrate,
            quantile: s.quantile,
            season: s.season,
          };
        }
      });

      if (!_isEmpty(result)) {
        all.push(result);
      }
    }
  } finally {
    return all.reverse();
  }
};

export const getOpponentHistory = async (player: any, opponent: any) => {
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
      opponentHistoryUrl(player.battleTag, opponent.battleTag),
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

export const getOngoing = async (battleTag: string, reset: boolean = false) => {
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
    if (!_isNil(battleTag)) {
      const { data: onGoingResponse } = await axios.get(currentUrl(battleTag));
      if (!_isNil(onGoingResponse?.id)) {
        const player = onGoingResponse.teams?.find((t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() === battleTag.toLowerCase(),
          ),
        )?.players?.[0];
        const opponent = onGoingResponse.teams?.find((t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() != battleTag.toLowerCase(),
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
    return result;
  }
};

export const getMatches = async (battleTag: string, race: Race) => {
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
              seasonActual.filter((m) => m?.durationInSeconds <= 120)?.length ??
              0,
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

// Get coach profile picture URL from W3Champions API
export const getW3CProfilePicture = async (
  battleTag: string,
): Promise<string | null> => {
  try {
    const { data } = await axios.get(
      `https://website-backend.w3champions.com/api/personal-settings/${encodeURIComponent(battleTag)}`,
    );
    const profilePicture = data?.profilePicture;

    if (!profilePicture) return null;

    const { race, pictureId, isClassic } = profilePicture;
    const baseUrl = "https://w3champions.wc3.tools/prod/integration/icons";

    // Special avatars (race 32)
    if (race === 32) {
      return `${baseUrl}/specialAvatars/SPECIAL_${pictureId}.jpg?v=2`;
    }

    // Race-specific avatars
    const raceNames: { [key: number]: string } = {
      0: "RANDOM",
      1: "HUMAN",
      2: "ORC",
      4: "NIGHTELF",
      8: "UNDEAD",
      16: "TOTAL",
    };

    const raceName = raceNames[race] || "RANDOM";

    // Reforged (default) doesn't have a subfolder, classic does
    if (isClassic) {
      return `${baseUrl}/raceAvatars/classic/${raceName}_${pictureId}.jpg?v=2`;
    } else {
      return `${baseUrl}/raceAvatars/${raceName}_${pictureId}.jpg?v=2`;
    }
  } catch (error) {
    console.error(`Failed to fetch profile picture for ${battleTag}:`, error);
    return null;
  }
};
