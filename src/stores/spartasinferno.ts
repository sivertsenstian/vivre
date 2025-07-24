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
import { useDocument, useFirestore } from "vuefire";
import { doc, setDoc } from "firebase/firestore";
import _isEmpty from "lodash/isEmpty";
import type { Moment } from "moment/moment";
import {
  calculateAchievementPoints,
  calculateLadderPoints,
  countAchievements,
  season_achievements,
} from "@/utilities/achievements.ts";
import { ladderGoal } from "@/stores/gnl.ts";

export const useSpartasInfernoStore = defineStore("spartasinferno", () => {
  const data = ref<any>({} as any);
  const timer = ref<number>();
  const start = ref<Moment>(moment());
  const end = ref<Moment>(moment());

  const db = useFirestore();
  const id = "b86ab1ad-adf3-4eac-bf9f-77869dcf6f4a";
  const { promise } = useDocument<any>(doc(db, "events", id));

  const dates = computed(() => ({
    start: start.value,
    end: end.value,
    today: moment().utc(true).endOf("day"),
    daysSinceStart:
      moment().utc(true).startOf("day").diff(start.value, "days") + 1,
    durationInDays: Math.abs(end.value.diff(start.value, "days")),
    daysRemaining: end.value.diff(moment().utc(true).startOf("day"), "days"),
    timeRemaining: end.value.diff(moment(), "milliseconds"),
  }));

  const initialize = async () => {
    const d = await promise.value;
    if (_isEmpty(data.value) || data.value.id !== d.id) {
      start.value = moment(d.start, "DD.MM.YYYY").utc(true).startOf("day");
      end.value = moment(d.end, "DD.MM.YYYY").utc(true).endOf("day");
      data.value = d;
    }

    clearTimeout(timer.value);
    await all();

    initialized.value = true;
  };

  const all = async () => {
    const d = data.value;
    start.value = moment(d.start, "DD.MM.YYYY").utc(true).startOf("day");
    end.value = moment(d.end, "DD.MM.YYYY").utc(true).endOf("day");

    await Promise.allSettled(
      d.players.map(async (player: any) => {
        player.data = await getData(
          player.battleTag,
          player.race,
          dates.value.start,
          dates.value.end,
        );
        getOngoing(player.battleTag).then((r: any) => (player.ongoing = r));
      }),
    );

    // for (let p = 0; p < d.players.length; p++) {
    //   const player = d.players[p];
    // }

    for (let p = 0; p < d.players.length; p++) {
      const player = d.players[p];

      const ladder_points = calculateLadderPoints(
        player.battleTag,
        player.data.player.season[player.race].matches,
      );
      const achievements = season_achievements[
        "spartas_inferno_season_1"
      ].calculate({
        battleTag: player.battleTag,
        data: player.data.player.season[player.race],
      });
      const awards = season_achievements[
        "spartas_inferno_season_1"
      ].calculate_awards(
        {
          battleTag: player.battleTag,
          data: player.data.player.season[player.race],
        },
        d.players,
      );

      const award_points = calculateAchievementPoints(awards);
      const achievement_points = calculateAchievementPoints(achievements);
      const totalPoints = ladder_points + achievement_points + award_points;

      player.points = ladder_points;
      player.achievementPoints = achievement_points;
      player.achievements = achievements;
      player.awards = awards;
      player.totalPoints = totalPoints;

      player.data.player.season[player.race].points = ladder_points;
      player.data.player.season[player.race].achievementPoints =
        achievement_points;
      player.data.player.season[player.race].achievements = achievements;
      player.data.player.season[player.race].awards = awards;
      player.data.player.season[player.race].totalPoints = totalPoints;
    }
  };

  const tournamentStart = moment("2025-06-23:00:00Z");

  const initialized = ref(false);

  const weekRule = moment().startOf("isoWeek");
  const monthRule = moment().startOf("month");

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

  const getData = async (btag: string, race: Race, from: any, to: any) => {
    let result: IStatistics = {} as any;
    let seasonActual = [];
    let monthActual = [];
    let weekActual = [];
    let dayActual = [];

    try {
      let all = await getSeasonGamesBetween(btag, [22], from, to);
      seasonActual = all;
      const info = getInfo(btag, seasonActual);

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
    await all();
    initialized.value = true;
  };

  const subscription = ref<number | null>(null);

  const subscribe = () => {
    if (subscription.value === null) {
      void initialize();
      // .then(() => {
      //   subscription.value = setInterval(async () => {
      //     void update();
      //   }, 30000);
      // });
    }
  };

  const unsubscribe = () => {
    if (subscription.value !== null) {
      clearInterval(subscription.value);
      subscription.value = null;
    }
  };

  const save = async (item: any) => {
    const db = useFirestore();
    try {
      await setDoc(doc(db, "events", item.id), item);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    initialized,
    subscribe,
    unsubscribe,
    tournamentStart,
    dates,
    save,
    data,
  };
});
