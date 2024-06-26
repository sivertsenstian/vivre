import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import _take from "lodash/take";
import _groupBy from "lodash/groupBy";
import _last from "lodash/last";
import _first from "lodash/first";
import _round from "lodash/round";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import moment from "moment";
import { useSettingsStore } from "./settings";
import { Race } from "@/stores/races";

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

  const url = (tag: string, offset: number = 0) =>
    `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
      tag,
    )}&gateway=20&offset=${offset}&pageSize=100&gameMode=1&season=${latest}`;

  const currentUrl = (tag: string) =>
    `https://website-backend.w3champions.com/api/matches/ongoing/${encodeURIComponent(
      tag,
    )}`;

  const opponentHistoryUrl = (tag: string, opponent: string) =>
    `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
      tag,
    )}&opponentId=${encodeURIComponent(
      opponent,
    )}&pageSize=200&season=${latest}`;

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

  const today = moment().startOf("day");
  const rule = moment().startOf("isoWeek");

  const player = ref({
    battleTag: "",
    race: Race.Random,
    mmr: 0,
    performance: [] as boolean[],
    day: {
      total: 0,
      wins: 0,
      loss: 0,
      percentage: 0,
      mmr: {
        diff: 0,
      },
      race: {
        [Race.Random]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Human]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Orc]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.NightElf]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Undead]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
      },
    },
    week: {
      total: 0,
      wins: 0,
      loss: 0,
      percentage: 0,
      mmr: {
        diff: 0,
      },
      race: {
        [Race.Random]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Human]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Orc]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.NightElf]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Undead]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
      },
    },
    season: {
      total: 0,
      wins: 0,
      loss: 0,
      percentage: 0,
      mmr: {
        diff: 0,
      },
      race: {
        [Race.Random]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Human]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Orc]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.NightElf]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
        [Race.Undead]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0,
        },
      },
    },
  });

  const getwins = (m: any) =>
    m.teams.some(
      (t: any) =>
        t.won &&
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
        ),
    );
  const getloss = (m: any) =>
    m.teams.some(
      (t: any) =>
        !t.won &&
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
        ),
    );

  const getMatches = async () => {
    let result = {
      battleTag: "",
      race: Race.Random,
      mmr: 0,
      performance: [] as boolean[],
      day: {
        total: 0,
        wins: 0,
        loss: 0,
        percentage: 0,
        mmr: {
          diff: 0,
        },
        race: {
          [Race.Random]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Human]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Orc]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.NightElf]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Undead]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
        },
      },
      week: {
        total: 0,
        wins: 0,
        loss: 0,
        percentage: 0,
        mmr: {
          diff: 0,
        },
        race: {
          [Race.Random]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Human]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Orc]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.NightElf]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Undead]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
        },
      },
      season: {
        total: 0,
        wins: 0,
        loss: 0,
        percentage: 0,
        mmr: {
          diff: 0,
        },
        race: {
          [Race.Random]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Human]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Orc]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.NightElf]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
          [Race.Undead]: {
            total: 0,
            wins: 0,
            loss: 0,
            percentage: 0,
          },
        },
      },
    };

    let seasonActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all: any[] = [];
      let finished = false;
      let prev = all.length;
      let failsafe = 0;

      while (!finished && failsafe < 10) {
        const { data: response } = await axios.get(url(tag.value, all.length));

        all = [...all, ...response.matches];
        console.log([all.length, response.count, prev]);

        finished = all.length === response.count || all.length === prev;
        prev = all.length;
        failsafe++;
      }

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

      const season = {
        wins: seasonActual.filter(getwins),
        loss: seasonActual.filter(getloss),
        race: {
          [Race.NightElf]: {
            wins: seasonActual
              .filter(getwins)
              .filter((m: any) => isRace(m, Race.NightElf)),
            loss: seasonActual
              .filter(getloss)
              .filter((m: any) => isRace(m, Race.NightElf)),
          },
          wins: _groupBy(
            seasonActual.filter(getwins),
            (w) => w.teams[1].players[0].race,
          ),
          loss: _groupBy(
            seasonActual.filter(getloss),
            (l) => l.teams[0].players[0].race,
          ),
        },
      };

      const week = {
        wins: weekActual.filter(getwins),
        loss: weekActual.filter(getloss),
        race: {
          wins: _groupBy(
            weekActual.filter(getwins),
            (w) => w.teams[1].players[0].race,
          ),
          loss: _groupBy(
            weekActual.filter(getloss),
            (l) => l.teams[0].players[0].race,
          ),
        },
      };

      const day = {
        wins: dayActual.filter(getwins),
        loss: dayActual.filter(getloss),
        race: {
          wins: _groupBy(
            dayActual.filter(getwins),
            (w) => w.teams[1].players[0].race,
          ),
          loss: _groupBy(
            dayActual.filter(getloss),
            (l) => l.teams[0].players[0].race,
          ),
        },
      };

      const getPercentage = (data: any, race: Race) => {
        return _round(
          ((data?.wins?.[race]?.length ?? 0) /
            Math.max(1, getTotal(data, race))) *
            100,
          1,
        );
      };

      const getTotal = (data: any, race: Race) => {
        return (
          (data?.wins?.[race]?.length ?? 0) + (data?.loss?.[race]?.length ?? 0)
        );
      };

      const info = _first<any>(all)?.teams?.reduce(
        (r: any, t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
          )
            ? t.players[0]
            : r,
        {},
      );
      const infoStartOfDay = _last<any>(dayActual)?.teams?.reduce(
        (r: any, t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
          )
            ? t.players[0]
            : r,
        {},
      );
      const infoStartOfWeek = _last<any>(weekActual)?.teams?.reduce(
        (r: any, t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
          )
            ? t.players[0]
            : r,
        {},
      );
      const infoStartOfSeason = _last<any>(seasonActual)?.teams?.reduce(
        (r: any, t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() === tag.value.toLowerCase(),
          )
            ? t.players[0]
            : r,
        {},
      );

      info.startOfSeasonMmr = infoStartOfSeason?.oldMmr ?? info.currentMmr;
      info.startOfSeasonDiffMmr = info.currentMmr - info.startOfSeasonMmr;

      info.startOfWeekMmr = infoStartOfWeek?.oldMmr ?? info.currentMmr;
      info.startOfWeekDiffMmr = info.currentMmr - info.startOfWeekMmr;

      info.startOfDayMmr = infoStartOfDay?.oldMmr ?? info.currentMmr;
      info.startOfDayDiffMmr = info.currentMmr - info.startOfDayMmr;

      result = {
        battleTag: info.battleTag,
        race: info.race,
        mmr: info.currentMmr,
        performance: weekActual.map(
          (match: any) =>
            match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
            settings.data.battleTag.toLowerCase(),
        ),
        day: {
          total: dayActual.length,
          wins: day.wins.length,
          loss: day.loss.length,
          percentage: 0,
          mmr: {
            diff: info.startOfDayDiffMmr,
          },
          race: {
            [Race.Random]: {
              total: getTotal(day.race, Race.Random),
              percentage: getPercentage(day.race, Race.Random),
              wins: day.race?.wins?.[Race.Random]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Random]?.length ?? 0,
            },
            [Race.Human]: {
              total: getTotal(day.race, Race.Human),
              percentage: getPercentage(day.race, Race.Human),
              wins: day.race?.wins?.[Race.Human]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Human]?.length ?? 0,
            },
            [Race.Orc]: {
              total: getTotal(day.race, Race.Orc),
              percentage: getPercentage(day.race, Race.Orc),
              wins: day.race?.wins?.[Race.Orc]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Orc]?.length ?? 0,
            },
            [Race.NightElf]: {
              total: getTotal(day.race, Race.NightElf),
              percentage: getPercentage(day.race, Race.NightElf),
              wins: day.race?.wins?.[Race.NightElf]?.length ?? 0,
              loss: day?.race?.loss?.[Race.NightElf]?.length ?? 0,
            },
            [Race.Undead]: {
              total: getTotal(day.race, Race.Undead),
              percentage: getPercentage(day.race, Race.Undead),
              wins: day.race?.wins?.[Race.Undead]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Undead]?.length ?? 0,
            },
          },
        },
        week: {
          total: weekActual.length,
          wins: week.wins.length,
          loss: week.loss.length,
          percentage: 0,
          mmr: {
            diff: info.startOfWeekDiffMmr,
          },
          race: {
            [Race.Random]: {
              total: getTotal(week.race, Race.Random),
              percentage: getPercentage(week.race, Race.Random),
              wins: week.race?.wins?.[Race.Random]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Random]?.length ?? 0,
            },
            [Race.Human]: {
              total: getTotal(week.race, Race.Human),
              percentage: getPercentage(week.race, Race.Human),
              wins: week.race?.wins?.[Race.Human]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Human]?.length ?? 0,
            },
            [Race.Orc]: {
              total: getTotal(week.race, Race.Orc),
              percentage: getPercentage(week.race, Race.Orc),
              wins: week.race?.wins?.[Race.Orc]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Orc]?.length ?? 0,
            },
            [Race.NightElf]: {
              total: getTotal(week.race, Race.NightElf),
              percentage: getPercentage(week.race, Race.NightElf),
              wins: week.race?.wins?.[Race.NightElf]?.length ?? 0,
              loss: week?.race?.loss?.[Race.NightElf]?.length ?? 0,
            },
            [Race.Undead]: {
              total: getTotal(week.race, Race.Undead),
              percentage: getPercentage(week.race, Race.Undead),
              wins: week.race?.wins?.[Race.Undead]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Undead]?.length ?? 0,
            },
          },
        },
        season: {
          total: seasonActual.length,
          wins: season.wins.length,
          loss: season.loss.length,
          percentage: 0,
          mmr: {
            diff: info.startOfSeasonDiffMmr,
          },
          race: {
            [Race.Random]: {
              total: getTotal(season.race, Race.Random),
              percentage: getPercentage(season.race, Race.Random),
              wins: season.race?.wins?.[Race.Random]?.length ?? 0,
              loss: season?.race?.loss?.[Race.Random]?.length ?? 0,
            },
            [Race.Human]: {
              total: getTotal(season.race, Race.Human),
              percentage: getPercentage(season.race, Race.Human),
              wins: season.race?.wins?.[Race.Human]?.length ?? 0,
              loss: season?.race?.loss?.[Race.Human]?.length ?? 0,
            },
            [Race.Orc]: {
              total: getTotal(season.race, Race.Orc),
              percentage: getPercentage(season.race, Race.Orc),
              wins: season.race?.wins?.[Race.Orc]?.length ?? 0,
              loss: season?.race?.loss?.[Race.Orc]?.length ?? 0,
            },
            [Race.NightElf]: {
              total: getTotal(season.race, Race.NightElf),
              percentage: getPercentage(season.race, Race.NightElf),
              wins: season.race?.wins?.[Race.NightElf]?.length ?? 0,
              loss: season?.race?.loss?.[Race.NightElf]?.length ?? 0,
            },
            [Race.Undead]: {
              total: getTotal(season.race, Race.Undead),
              percentage: getPercentage(season.race, Race.Undead),
              wins: season.race?.wins?.[Race.Undead]?.length ?? 0,
              loss: season?.race?.loss?.[Race.Undead]?.length ?? 0,
            },
          },
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
    let history = { wins: 0, loss: 0, total: 0, performance: [], last: [] };

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

      history = {
        performance,
        last: _take(performance, 5),
        wins: matches.filter(getwins).length,
        loss: matches.filter(getloss).length,
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
  };
});
