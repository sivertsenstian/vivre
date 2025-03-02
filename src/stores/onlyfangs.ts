import { defineStore } from "pinia";
import moment from "moment";
import { useSettingsStore } from "@/stores/settings.ts";
import { computed, ref, shallowRef } from "vue";
import type { IStatistics } from "@/utilities/types.ts";
import _isNil from "lodash/isNil";
import {
  getAllSeasonGames,
  getInfo,
  getloss,
  getRaceStatistics,
  getwins,
  isRace,
} from "@/utilities/matchcalculator.ts";
import { Race } from "@/stores/races.ts";
import { useRoute } from "vue-router";

export const useOnlyFangsStore = defineStore("onlyfangs", () => {
  const settings = useSettingsStore();
  const route = useRoute();

  const query = String(route.query.data ?? "");
  let l = [];
  try {
    l = JSON.parse(window.atob(query));
  } catch (e) {
    try {
      l = JSON.parse(window.atob(settings.data.ladder));
    } catch (e) {
      l = [
        "Tyler1#11151",
        "Ahmp#1107",
        "Skippy1337#1171",
        "Guzu#21761",
        "Dendi#22658",
        "Geranimo#11740",
      ];
    }
  }

  const ladder = ref<string[]>(l);

  const challengers = ref<Record<string, IStatistics>>({});

  const modes = [
    "points",
    "mmr",
    "weeklyActivity",
    "monthlyActivity",
    "seasonActivity",
  ];

  const mode = ref<string>("mmr");

  const latest = 20;
  const season = 20;
  const start = moment("22.02.25", "DD.MM.YYYY");
  const end = moment("14.03.25", "DD.MM.YYYY");
  const duration = Math.abs(end.diff(start, "days"));

  const today = moment().startOf("day");
  const weekRule = moment().startOf("isoWeek");
  const monthRule = moment().startOf("month");

  const getMatches = async (btag: string) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let monthActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getAllSeasonGames(btag, latest);

      const race = all?.[0]?.teams.find((t: any) =>
        t.players.some(
          (p: any) => p.battleTag.toLowerCase() === btag.toLowerCase(),
        ),
      )?.players?.[0]?.race;

      seasonActual = all;
      monthActual = all
        .filter((m: any) => moment(m.endTime).isAfter(monthRule))
        .filter((m: any) => isRace(btag, m, race));
      weekActual = all
        .filter((m: any) => moment(m.endTime).isAfter(weekRule))
        .filter((m: any) => isRace(btag, m, race));
      dayActual = all
        .filter((m: any) => moment(m.endTime).isAfter(today))
        .filter((m: any) => isRace(btag, m, race));

      const info = getInfo(btag, seasonActual);

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
        battleTag: info.battleTag,
        race: info.race,
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

  setInterval(async () => {
    for (const challenger of ladder.value.filter((v) => !_isNil(v))) {
      const c = await getMatches(challenger);
      challengers.value[challenger] = c.player;
    }
  }, 10000);

  return {
    mode,
    modes,
    season,
    duration,
    start,
    end,
    challengers,
    ladder,
    link: computed(() => window.btoa(JSON.stringify(ladder.value))),
  };
});
