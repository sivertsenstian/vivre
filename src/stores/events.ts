﻿import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IStatistics } from "@/utilities/types";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getPercentage,
  getplayer,
  getRaceStatistics,
  getTotal,
  getwins,
  isRace,
  numberOfGames,
} from "@/utilities/matchcalculator";
import moment from "moment/moment";
import { Race } from "@/stores/races";
import axios from "axios";
import _isNil from "lodash/isNil";
import { currentUrl, opponentHistoryUrl } from "@/utilities/api";
import _isEmpty from "lodash/isEmpty";
import _take from "lodash/take";
import _groupBy from "lodash/groupBy";
import _round from "lodash/round";

export const useEventsStore = defineStore("events", () => {
  // Happy Live Event Data
  const accounts = ["AuroraHappy#2668", "Happy#2384", "Cacxa26#2948"];
  const data = ref<any>({} as any);

  const loaded = ref(0);

  const ongoing = ref<any>({});

  const start = moment("07.10.2024", "DD.MM.YYYY").startOf("day");
  const today = moment().startOf("day");
  const daysSinceStart = today.diff(start, "days");
  const weekRule = moment().startOf("isoWeek");
  const monthRule = moment().startOf("month");
  const latest = 22;

  const getData = async (tag: string) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let monthActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getAllSeasonGames(tag, latest);

      const race = all?.[0]?.teams.find((t: any) =>
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === tag.toLowerCase(),
        ),
      )?.players?.[0]?.race;

      seasonActual = all;
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(weekRule))
        .filter((m: any) => isRace(tag, m, race));
      monthActual = all
        .filter((m: any) => moment(m.endTime).isAfter(monthRule))
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
        month: getRaceStatistics(tag, monthActual),
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

  const getOngoing = async (tag: string) => {
    let result = {
      id: null,
      start: null,
      active: false,
      player: { name: "", race: 0, battleTag: tag, oldMmr: 0 },
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
          history: await getOpponentHistory(player, opponent),
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
        mmr: {
          gain: 0,
          loss: 0,
        },
        expected: {
          win: null,
          loss: null,
        },
      };
    }

    try {
      const { data: historyResponse } = await axios.get(
        opponentHistoryUrl(player.battleTag, opponent.battleTag, latest),
      );

      const matches = historyResponse?.matches ?? [];
      const performance = matches.map(
        (match: any) =>
          match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
          player.battleTag.toLowerCase(),
      );

      const wins = matches.filter((m: any) => getwins(player.battleTag, m));
      const loss = matches.filter((m: any) => getloss(player.battleTag, m));

      return {
        performance,
        last: _take(performance, 18),
        wins: wins.length,
        loss: loss.length,
        total: historyResponse.count,
        heroes: {},
        mmr: {
          gain: _take(matches, 18)
            .filter((m: any) => getwins(player.battleTag, m))
            .reduce((s, m: any) => s + m.teams[0].players[0].mmrGain, 0),
          loss: _take(matches, 18)
            .filter((m: any) => getloss(player.battleTag, m))
            .reduce((s, m: any) => s + m.teams[0].players[0].mmrGain, 0),
        },
        expected: {
          win: wins?.[0]?.teams[0].players[0].mmrGain,
          loss: loss?.[0]?.teams[1].players[0].mmrGain,
        },
      } as any;
    } catch (error) {
      console.log(error);
    }
  };

  // Do it live!
  setInterval(() => {
    accounts.forEach(async (account: string) => {
      const result = await getData(account);
      data.value[account] = result;
      const o = await getOngoing(account);
      if (
        (o.active && !ongoing.value?.active) ||
        (account === ongoing.value?.player?.battleTag &&
          o.id !== ongoing.value?.id)
      ) {
        ongoing.value = o;
      }
    });
  }, 10000);

  const matches = computed(() => {
    return accounts
      .reduce(
        (s: any[], a: any) => [
          ...s,
          ...(data.value[a]?.season[Race.Undead].matches.filter((m: any) =>
            moment(m.endTime).isAfter(start),
          ) ?? []),
        ],
        [],
      )
      .sort((a: any, b: any) => moment(b.endTime).diff(moment(a.endTime)));
  });

  const bannedMatches = computed(() => {
    return accounts
      .reduce(
        (s: any[], a: any) => [
          ...s,
          ...(data.value[a]?.season[Race.Undead].matches.filter((m: any) =>
            moment(m.endTime).isBefore(start),
          ) ?? []),
        ],
        [],
      )
      .sort((a: any, b: any) => moment(b.endTime).diff(moment(a.endTime)));
  });

  const games = computed(() => {
    return {
      before: {
        total: bannedMatches.value.length,
        wins:
          accounts.reduce(
            (s: any[], a: string) => [
              ...s,
              ...bannedMatches.value.filter((m) => getwins(a, m)),
            ],
            [],
          ).length ?? 0,
        loss:
          accounts.reduce(
            (s: any[], a: string) => [
              ...s,
              ...bannedMatches.value.filter((m) => getloss(a, m)),
            ],
            [],
          ).length ?? 0,
      },
      after: {
        total: matches.value.length,
        wins:
          accounts.reduce(
            (s: any[], a: string) => [
              ...s,
              ...matches.value.filter((m) => getwins(a, m)),
            ],
            [],
          ).length ?? 0,
        loss:
          accounts.reduce(
            (s: any[], a: string) => [
              ...s,
              ...matches.value.filter((m) => getloss(a, m)),
            ],
            [],
          ).length ?? 0,
      },
    };
  });

  const highest = computed(() => {
    const i = accounts
      .map((a) => data.value[a].season.summary.mmr.current)
      .reduce((iMax, x, j, arr) => (x > arr[iMax] ? j : iMax), 0);
    return accounts[i];
  });

  accounts.forEach(async (account: string) => {
    const result = await getData(account);
    data.value[account] = result;
    loaded.value += 1;
  });

  // Race stats across accounts
  const race = computed(() => {
    const wins: any[] = accounts.reduce(
      (s: any[], a: string) => [
        ...s,
        ...matches.value.filter((m) => getwins(a, m)),
      ],
      [],
    );

    const loss: any[] = accounts.reduce(
      (s: any[], a: string) => [
        ...s,
        ...matches.value.filter((m) => getloss(a, m)),
      ],
      [],
    );

    const grouped = {
      wins: _groupBy(wins, (w) => w.teams[1].players[0].race),
      loss: _groupBy(loss, (l) => l.teams[0].players[0].race),
    };

    const pros = {
      wins: _groupBy(
        wins.filter((w: any) => w.teams[1].players[0].oldMmr >= 2500),
        (w) => w.teams[1].players[0].race,
      ),
      loss: _groupBy(
        loss.filter((l: any) => l.teams[0].players[0].currentMmr >= 2500),
        (l) => l.teams[0].players[0].race,
      ),
    };

    return {
      [Race.Random]: {
        total: getTotal(grouped, Race.Random),
        percentage: getPercentage(grouped, Race.Random),
        wins: grouped?.wins?.[Race.Random]?.length ?? 0,
        loss: grouped?.loss?.[Race.Random]?.length ?? 0,
      },
      [Race.Human]: {
        total: getTotal(grouped, Race.Human),
        percentage: getPercentage(grouped, Race.Human),
        wins: grouped?.wins?.[Race.Human]?.length ?? 0,
        loss: grouped?.loss?.[Race.Human]?.length ?? 0,
      },
      [Race.Orc]: {
        total: getTotal(grouped, Race.Orc),
        percentage: getPercentage(grouped, Race.Orc),
        wins: grouped?.wins?.[Race.Orc]?.length ?? 0,
        loss: grouped?.loss?.[Race.Orc]?.length ?? 0,
      },
      [Race.NightElf]: {
        total: getTotal(grouped, Race.NightElf),
        percentage: getPercentage(grouped, Race.NightElf),
        wins: grouped?.wins?.[Race.NightElf]?.length ?? 0,
        loss: grouped?.loss?.[Race.NightElf]?.length ?? 0,
      },
      [Race.Undead]: {
        total: getTotal(grouped, Race.Undead),
        percentage: getPercentage(grouped, Race.Undead),
        wins: grouped?.wins?.[Race.Undead]?.length ?? 0,
        loss: grouped?.loss?.[Race.Undead]?.length ?? 0,
      },
      pro: {
        // vs >= 2500 MMR Players
        [Race.Random]: {
          total: getTotal(pros, Race.Random),
          percentage: getPercentage(pros, Race.Random),
          wins: pros?.wins?.[Race.Random]?.length ?? 0,
          loss: pros?.loss?.[Race.Random]?.length ?? 0,
        },
        [Race.Human]: {
          total: getTotal(pros, Race.Human),
          percentage: getPercentage(pros, Race.Human),
          wins: pros?.wins?.[Race.Human]?.length ?? 0,
          loss: pros?.loss?.[Race.Human]?.length ?? 0,
        },
        [Race.Orc]: {
          total: getTotal(pros, Race.Orc),
          percentage: getPercentage(pros, Race.Orc),
          wins: pros?.wins?.[Race.Orc]?.length ?? 0,
          loss: pros?.loss?.[Race.Orc]?.length ?? 0,
        },
        [Race.NightElf]: {
          total: getTotal(pros, Race.NightElf),
          percentage: getPercentage(pros, Race.NightElf),
          wins: pros?.wins?.[Race.NightElf]?.length ?? 0,
          loss: pros?.loss?.[Race.NightElf]?.length ?? 0,
        },
        [Race.Undead]: {
          total: getTotal(pros, Race.Undead),
          percentage: getPercentage(pros, Race.Undead),
          wins: pros?.wins?.[Race.Undead]?.length ?? 0,
          loss: pros?.loss?.[Race.Undead]?.length ?? 0,
        },
      },
    };
  });

  const prediction = computed(() => {
    const r = accounts.reduce((result, account) => {
      const hmw = matches.value.filter((m) => getwins(account, m));
      const hml = matches.value.filter((m) => getloss(account, m));

      const c = hmw.length + hml.length;

      const averageWin = Math.abs(
        hmw.reduce((s, m) => {
          const gain = getplayer(account)(m).players[0].mmrGain;
          return gain > 0 ? s + gain : s;
        }, 0),
      );
      const averageLoss = Math.abs(
        hml.reduce((s, m) => {
          const gain = getplayer(account)(m).players[0].mmrGain;
          return gain < 0 ? s + gain : s;
        }, 0),
      );
      const averageGain =
        [...hmw, ...hml].reduce(
          (s, m) => s + getplayer(account)(m).players[0].mmrGain,
          0,
        ) / c;

      let calculatedDays = { count: 0, date: null } as any;
      if (loaded.value >= accounts.length) {
        const d = Math.ceil(
          numberOfGames(
            3000 - data.value[account].season.summary.mmr.current,
            averageGain,
          ) /
            (c / daysSinceStart),
        );
        calculatedDays = {
          count: d,
          date: moment().add(d, "days").startOf("day"),
        };
      }

      return {
        ...result,
        [account]: {
          days: calculatedDays,
          current: data.value?.[account]?.season.summary.mmr.current,
          count: c,
          winCount: hmw.length,
          lossCount: hml.length,
          win: _round(averageWin, 2),
          loss: _round(averageLoss, 2),
          gain: _round(averageGain, 2),
        },
      };
    }, {} as any);

    // Calculate prediction based on ALL accounts if continue playing ONLY on HIGHEST
    const all = accounts.reduce(
      (t: any, a: any) => {
        t.days = r[a].days;
        t.current = r[a].current > t.current ? r[a].current : t.current;
        t.count += r[a].count;
        t.winCount += r[a].winCount;
        t.lossCount += r[a].lossCount;
        t.win += r[a].win;
        t.loss += r[a].loss;
        t.gain += r[a].gain * (1 / 3);
        return t;
      },
      {
        days: { count: 0, date: null },
        current: 0,
        count: 0,
        winCount: 0,
        lossCount: 0,
        win: 0,
        loss: 0,
        gain: 0,
        total: true,
      },
    );
    all.gain = _round(all.gain, 2);
    let calculatedDays = { count: 0, date: null } as any;
    if (loaded.value >= accounts.length) {
      const d = Math.ceil(
        numberOfGames(3000 - all.current, all.gain) /
          (all.count / daysSinceStart),
      );
      calculatedDays = {
        count: d,
        date: moment().add(d, "days").startOf("day"),
      };
    }
    all.days = calculatedDays;
    r["All Accounts"] = all;

    // Calculate MR.PRESIDENTS official prediction
    const ape = accounts.reduce(
      (result, account) => {
        const hmw = _take(matches.value, 100).filter((m) =>
          getwins(account, m),
        );
        const hml = _take(matches.value, 100).filter((m) =>
          getloss(account, m),
        );

        const c = hmw.length + hml.length;

        const averageWin = Math.abs(
          hmw.reduce((s, m) => {
            const gain = getplayer(account)(m).players[0].mmrGain;
            return gain > 0 ? s + gain : s;
          }, 0),
        );
        const averageLoss = Math.abs(
          hml.reduce((s, m) => {
            const gain = getplayer(account)(m).players[0].mmrGain;
            return gain < 0 ? s + gain : s;
          }, 0),
        );
        const averageGain =
          c > 0
            ? [...hmw, ...hml].reduce(
                (s, m) => s + (getplayer(account)(m).players[0]?.mmrGain ?? 0),
                0,
              ) / c
            : 0;

        return {
          days: { count: 0, date: null },
          current: all.current,
          count: result.count + c,
          winCount: result.winCount + hmw.length,
          lossCount: result.lossCount + hml.length,
          win: result.win + averageWin,
          loss: result.loss + averageLoss,
          gain: result.gain + averageGain * (1 / 3),
          saul: true,
        };
      },
      {
        days: { count: 0, date: null },
        current: 0,
        count: 0,
        winCount: 0,
        lossCount: 0,
        win: 0,
        loss: 0,
        gain: 0,
        saul: true,
      } as any,
    );

    ape.gain = _round(ape.gain, 2);
    let apeCalculatedDays = { count: 0, date: null } as any;
    if (loaded.value >= accounts.length) {
      const d =
        (3000 - all.current) /
        (ape.gain * 0.85) /
        (Math.round(all.count / daysSinceStart) / accounts.length);

      apeCalculatedDays = {
        count: Math.floor(d),
        date: moment().add(d, "days").startOf("day"),
      };
    }
    ape.days = apeCalculatedDays;
    r["SaulPredictionMan"] = ape;

    return r;
  });

  return {
    data,
    accounts,
    games,
    bannedMatches,
    matches,
    ongoing,
    highest,
    loaded,
    race,
    prediction,
  };
});
