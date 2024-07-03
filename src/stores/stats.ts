import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import _take from "lodash/take";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import moment from "moment";
import { useSettingsStore } from "./settings";
import { Race } from "@/stores/races";
import type { IStatistics } from "@/utilities/types";
import { getInfo, getRaceStatistics } from "@/utilities/matchcalculator";

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

  const player = ref<IStatistics>();

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
    let result: IStatistics = {} as any;
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
          summary: getRaceStatistics(tag.value, seasonActual),
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

  console.log({ player: player.value });

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
