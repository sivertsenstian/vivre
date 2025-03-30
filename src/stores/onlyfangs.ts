import { defineStore } from "pinia";
import moment from "moment";
import { computed, ref } from "vue";
import type { IStatistics } from "@/utilities/types.ts";
import _isNil from "lodash/isNil";
import {
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

export const twitch: any = {
  "Tyler1#11151": "loltyler1",
  "Ahmp#1107": "ahmpy",
  "Skippy1337#1171": "sodapoppin",
  "Guzu#21761": "guzu",
  "Dendi#22658": "dendi",
  "Geranimo#11740": "lolgeranimo",
  "sunglitters#21798": "sunglitters",
  "AnnieFuchsia#2169": "anniefuchsia",
};

export const useOnlyFangsStore = defineStore("onlyfangs", () => {
  const streaming = ref<Record<string, boolean>>({
    "Tyler1#11151": false,
    "Ahmp#1107": false,
    "Skippy1337#1171": false,
    "Guzu#21761": false,
    "Dendi#22658": false,
    "Geranimo#11740": false,
    "sunglitters#21798": false,
    "AnnieFuchsia#2169": false,
  });

  const laddering = ref<Record<string, boolean>>({
    "Tyler1#11151": false,
    "Ahmp#1107": false,
    "Skippy1337#1171": false,
    "Guzu#21761": false,
    "Dendi#22658": false,
    "Geranimo#11740": false,
    "sunglitters#21798": false,
    "AnnieFuchsia#2169": false,
  });

  const ladder = ref<string[]>([
    "Tyler1#11151",
    "Ahmp#1107",
    "Skippy1337#1171",
    "Guzu#21761",
    "Dendi#22658",
    "Geranimo#11740",
    "sunglitters#21798",
    "AnnieFuchsia#2169",
  ]);

  const challengers = ref<Record<string, IStatistics>>({});

  const modes = [
    "points",
    "mmr",
    "weeklyActivity",
    "monthlyActivity",
    "seasonActivity",
  ];

  const groups = ["individual", "tournament"];

  const mode = ref<string>("mmr");
  const groupBy = ref<string>("individual");

  const tournamentGroups = [
    ["Tyler1#11151", "Skippy1337#1171", "Dendi#22658", "AnnieFuchsia#2169"],
    ["Ahmp#1107", "Guzu#21761", "Geranimo#11740", "sunglitters#21798"],
  ];

  const tournamentStart = moment("2025-03-14T16:00:00Z");

  const season = 21;
  const start = moment("22.02.25", "DD.MM.YYYY");
  const end = moment("14.03.25:17:00:00", "DD.MM.YYYY:HH:mm:ss");
  const duration = Math.abs(end.diff(start, "days"));
  const initialized = ref(false);

  const today = end; //moment().startOf("day");
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

  const getMatches = async (btag: string) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let monthActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getSeasonGamesBetween(btag, [20, 21], start, end);
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
            const c = await getMatches(challenger);
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
            const m = await getMatches(c);
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
    duration,
    start,
    end,
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
  };
});
