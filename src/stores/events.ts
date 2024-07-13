import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IStatistics } from "@/utilities/types";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getRaceStatistics,
  getwins,
  isRace,
  opponentIsRace,
} from "@/utilities/matchcalculator";
import moment from "moment/moment";
import { Race } from "@/stores/races";
import axios from "axios";
import _isNil from "lodash/isNil";
import { currentUrl, opponentHistoryUrl } from "@/utilities/api";
import _isEmpty from "lodash/isEmpty";
import _take from "lodash/take";

export const useEventsStore = defineStore("settings", () => {
  // Happy Live Event Data
  const accounts = ["AuroraHappy#2668", "Happy#2384", "Cacxa26#2948"];
  const data = ref<any>({} as any);

  const ongoing = ref<any>({});

  const start = moment([2024, 6, 9]);
  const today = moment().startOf("day");
  const rule = moment().startOf("isoWeek");

  const getData = async (tag: string) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getAllSeasonGames(tag, 19);

      const race = all?.[0]?.teams.find((t: any) =>
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
        ),
      )?.players?.[0]?.race;

      seasonActual = all;
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(rule))
        .filter((m: any) => isRace(tag, m, race));
      dayActual = all
        .filter((m: any) => moment(m.endTime).isAfter(today))
        .filter((m: any) => isRace(tag, m, race));

      const info = getInfo(tag, seasonActual);

      const season = {
        [Race.Human]: seasonActual.filter((m) => isRace(tag, m, Race.Human)),
        [Race.Orc]: seasonActual.filter((m) => isRace(tag, m, Race.Orc)),
        [Race.Undead]: seasonActual.filter((m) => isRace(tag, m, Race.Undead)),
        [Race.NightElf]: seasonActual.filter((m) =>
          isRace(tag, m, Race.NightElf),
        ),
        [Race.Random]: seasonActual.filter((m) => isRace(tag, m, Race.Random)),
      };

      result = {
        battleTag: info.battleTag,
        race: info.race,
        day: getRaceStatistics(tag, dayActual),
        week: getRaceStatistics(tag, weekActual),
        season: {
          summary: {
            ...getRaceStatistics(tag, seasonActual),
            suspiciousGames: {
              total:
                seasonActual.filter((m) => m?.durationInSeconds <= 240)
                  ?.length ?? 0,
              wins:
                seasonActual
                  .filter((m) => getwins(tag, m))
                  .filter((m) => m?.durationInSeconds <= 240)?.length ?? 0,
              loss:
                seasonActual
                  .filter((m) => getloss(tag, m))
                  .filter((m) => m?.durationInSeconds <= 240)?.length ?? 0,
            },
          },
          [Race.Random]: getRaceStatistics(tag, season[Race.Random]),
          [Race.Human]: getRaceStatistics(tag, season[Race.Human]),
          [Race.Orc]: getRaceStatistics(tag, season[Race.Orc]),
          [Race.Undead]: getRaceStatistics(tag, season[Race.Undead]),
          [Race.NightElf]: getRaceStatistics(tag, season[Race.NightElf]),
        },
      };
    } catch (error) {
      console.log(error);
    }

    return result;
  };

  const getOngoing = async (tag: string, reset = false) => {
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
      },
    };

    try {
      const { data: onGoingResponse } = await axios.get(currentUrl(tag));
      if (!_isNil(onGoingResponse?.id)) {
        const player = onGoingResponse.teams?.find((t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
          ),
        )?.players?.[0];
        const opponent = onGoingResponse.teams?.find((t: any) =>
          t.players.some(
            (p: any) => p.battleTag.toLowerCase() != tag.toLowerCase(),
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
          history:
            !reset && ongoing.value?.id
              ? (ongoing.value.history as any)
              : await getOpponentHistory(player, opponent),
        };
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  };

  const getOpponentHistory = async (player: any, opponent: any) => {
    if (_isEmpty(opponent)) {
      return {
        wins: 0,
        loss: 0,
        total: 0,
        performance: [],
        last: [],
        heroes: [],
      };
    }

    try {
      const { data: historyResponse } = await axios.get(
        opponentHistoryUrl(player.battleTag, opponent.battleTag, 19),
      );

      const matches = historyResponse?.matches ?? [];
      const performance = matches.map(
        (match: any) =>
          match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
          player.battleTag.toLowerCase(),
      );

      return {
        performance,
        last: _take(performance, 10),
        wins: matches.filter((m: any) => getwins(player.battleTag, m)).length,
        loss: matches.filter((m: any) => getloss(player.battleTag, m)).length,
        total: historyResponse.count,
        heroes: {},
        mmr: {
          gain: _take(matches, 10)
            .filter((m: any) => getwins(player.battleTag, m))
            .reduce((s, m: any) => s + m.teams[0].players[0].mmrGain, 0),
          loss: _take(matches, 10)
            .filter((m: any) => getloss(player.battleTag, m))
            .reduce((s, m: any) => s + m.teams[0].players[0].mmrGain, 0),
        },
      } as any;
    } catch (error) {
      console.log(error);
    }
  };

  // Do it live!
  accounts.forEach(async (account: string) => {
    const result = await getData(account);
    data.value[account] = result;

    const o = await getOngoing(account, true);
    if (o.active) {
      ongoing.value = o;
    }
  });

  setInterval(() => {
    accounts.forEach(async (account: string) => {
      const result = await getData(account);
      data.value[account] = result;

      const o = await getOngoing(account, true);
    });
  }, 10000);

  const matches = computed(() =>
    accounts.reduce(
      (s: any[], a: any) => [
        ...s,
        ...(data.value[a]?.season[Race.Undead].matches.filter((m: any) =>
          moment(m.endTime).isAfter(start),
        ) ?? []),
      ],
      [],
    ),
  );

  const highest = computed(() => {
    const i = accounts
      .map((a) => data.value[a].season.summary.mmr.current)
      .reduce((iMax, x, j, arr) => (x > arr[iMax] ? j : iMax), 0);
    return accounts[i];
  });

  return { data, accounts, matches, ongoing, highest };
});
