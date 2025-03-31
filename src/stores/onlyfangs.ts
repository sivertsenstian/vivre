import { defineStore } from "pinia";
import moment from "moment";
import { computed, ref } from "vue";
import type { IStatistics } from "@/utilities/types.ts";
import _isNil from "lodash/isNil";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getRaceStatistics,
  getSeasonGamesBetween,
  getwins,
  isRace,
} from "@/utilities/matchcalculator.ts";
import { Race } from "@/stores/races.ts";
import axios from "axios";
import { currentUrl } from "@/utilities/api.ts";
import _map from "lodash/map";

const participants = [
  "Tasteless#1788",
  "Lowko#2287",
  "TheViper#2786",
  "T90#???",
  "BonjwaRedPanda#???",
  "Turin#???",
  "Lacari#1890",
  "Fuccboiii69#2102", // TommyKayLIVE
];

export const twitch: any = {
  [participants[0]]: "tastelesstv",
  [participants[1]]: "LowkoTV",
  [participants[2]]: "theviper",
  [participants[3]]: "t90official",
  [participants[4]]: "BonjwaRedPanda",
  [participants[5]]: "TurinRTS",
  [participants[6]]: "lacari",
  [participants[7]]: "TommyKayLIVE",
};

export const useOnlyFangsStore = defineStore("onlyfangs", () => {
  const streaming = ref<Record<string, boolean>>({
    [participants[0]]: false,
    [participants[1]]: false,
    [participants[2]]: false,
    [participants[3]]: false,
    [participants[4]]: false,
    [participants[5]]: false,
    [participants[6]]: false,
    [participants[7]]: false,
  });

  const laddering = ref<Record<string, boolean>>({
    [participants[0]]: false,
    [participants[1]]: false,
    [participants[2]]: false,
    [participants[3]]: false,
    [participants[4]]: false,
    [participants[5]]: false,
    [participants[6]]: false,
    [participants[7]]: false,
  });

  const ladder = ref<string[]>(participants);

  const challengers = ref<Record<string, IStatistics>>({});

  const modes = [
    "points",
    "mmr",
    "weeklyActivity",
    "monthlyActivity",
    "seasonActivity",
  ];

  const groups = ["individual"];

  const mode = ref<string>("mmr");
  const groupBy = ref<string>("individual");

  const tournamentGroups = [[], []];

  const tournamentStart = moment("2025-04-18T16:00:00Z");

  const season = 21;
  const initialized = ref(false);

  const start = moment("28.03.2025", "DD.MM.YYYY").utc(true).startOf("day");
  const end = moment("18.04.2025", "DD.MM.YYYY").utc(true).startOf("day");

  const dates = computed(() => ({
    start: start.utc(true).startOf("day"),
    end: end.utc(true).endOf("day"),
    today: moment().utc(true).endOf("day"),
    daysSinceStart: moment().utc(true).startOf("day").diff(start, "days") + 1,
    durationInDays: Math.abs(end.diff(start, "days")),
    daysRemaining: end.diff(moment().utc(true).startOf("day"), "days"),
    timeRemaining: end.diff(moment(), "milliseconds"),
  }));

  const weekRule = moment().startOf("isoWeek");
  const monthRule = moment().startOf("month");

  const getStreaming = async (tag: string) => {
    try {
      const { data: streamingResponse } = await axios.get(
        `https://decapi.me/twitch/uptime/${twitch[tag]}`,
      );

      return !streamingResponse.includes("offline");
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  const getOngoing = async (tag: string) => {
    try {
      const { data: onGoingResponse } = await axios.get(currentUrl(tag));
      if (!_isNil(onGoingResponse?.id) && onGoingResponse?.gameMode === 1) {
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

        return {
          id: onGoingResponse.id,
          start: moment(onGoingResponse.startTime) as any,
          active: true,
          player,
          opponent,
          map: onGoingResponse.mapName,
          server: onGoingResponse.serverInfo,
        };
      }
    } catch (error) {
      return console.log(error);
    }
    return undefined;
  };

  const getMatches = async (btag: string, from: any, to: any) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let monthActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getSeasonGamesBetween(btag, [21], from, to);
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
        .filter((m: any) => moment(m.endTime).isAfter(dates.value.today))
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
        } as any,
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

  const update = async (force = false) => {
    if (force) {
      await Promise.allSettled(
        ladder.value
          .filter((v) => !_isNil(v))
          .map(async (challenger) => {
            const c = await getMatches(
              challenger,
              dates.value.start,
              dates.value.end,
            );
            const o = await getOngoing(challenger);
            const t = await getStreaming(challenger);

            laddering.value[challenger] = o !== undefined;
            streaming.value[challenger] = t;

            challengers.value[challenger] = c.player;
          }),
      );
    } else {
      // Check to see who is online
      await Promise.allSettled(
        ladder.value
          .filter((v) => !_isNil(v))
          .map(async (c) => {
            streaming.value[c] = await getStreaming(c);
          }),
      );

      // Check to see who is laddering of the online players
      await Promise.allSettled(
        _map(streaming.value, async (v, c) => {
          if (v) {
            laddering.value[c] = (await getOngoing(c)) !== undefined;
          }
        }),
      );

      // Update stats for laddering players
      await Promise.allSettled(
        _map(laddering.value, async (v, c) => {
          if (v) {
            const m = await getMatches(c, dates.value.start, dates.value.end);
            challengers.value[c] = m.player;
          }
        }),
      );
    }

    initialized.value = true;
  };

  void update(true);
  setInterval(update, 30000);

  const subscription = ref<number | null>(null);

  const subscribe = () => {
    if (subscription.value === null) {
      subscription.value = setInterval(async () => {
        void update();
      }, 30000);
    }
  };

  const unsubscribe = () => {
    if (subscription.value !== null) {
      clearInterval(subscription.value);
      subscription.value = null;
    }
  };

  return {
    mode,
    modes,
    groupBy,
    groups,
    season,
    challengers,
    ladder,
    link: computed(() => window.btoa(JSON.stringify(ladder.value))),
    streaming,
    laddering,
    initialized,
    subscribe,
    unsubscribe,
    tournamentGroups,
    tournamentStart,
    participants,
    dates,
  };
});
