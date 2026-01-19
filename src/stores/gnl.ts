import { defineStore } from "pinia";
import type { IGNLAccount, IGNLStatistics, IRaceStatistics } from "@/utilities/types";
import moment from "moment";
import type { Moment } from "moment";
import {
  getRaceStatistics,
  getSeasonGamesBetween,
  isRace,
  iswin,
} from "@/utilities/matchcalculator";
import { computed, ref } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import gnl_team_cok from "@assets/gnl/teams/cok-transparent.png";
import gnl_team_index_cok from "@assets/gnl/teams/cok-transparent_index.png";
import gnl_team_apelords from "@assets/gnl/teams/apelords.jpg";
import gnl_team_fiends from "@assets/gnl/teams/fiends_with_benefits.png";
import gnl_team_index_fiends from "@assets/gnl/teams/fiends_with_benefits_index.png";
import gnl_team_gigglinggoblins from "@assets/gnl/teams/goblins.jpg";
import gnl_team_index_gigglinggoblins from "@assets/gnl/teams/goblins_index.png";
import gnl_team_gnlbears from "@assets/gnl/teams/bears.jpg";
import gnl_team_tttg from "@assets/gnl/teams/TTTG_LOGO.jpg";
import gnl_team_index_tttg from "@assets/gnl/teams/TTTG_LOGO_index.jpg";
import gnl_team_panda from "@assets/gnl/teams/chinese_panda.jpg";
import gnl_team_index_panda from "@assets/gnl/teams/chinese_panda_index.jpg";
import gnl_team_pitty from "@assets/gnl/teams/pitty.png";
import gnl_team_pitty_index from "@assets/gnl/teams/pitty_index.png";
import gnl_team_missing from "@/assets/creeproutes/missing.png";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _last from "lodash/last";
import _sortBy from "lodash/sortBy";
import axios from "axios";
import { currentUrl } from "@/utilities/api";
import { Race } from "@/stores/races";
import {
  calculateAchievementPoints,
  calculateLadderPoints,
  countAchievements,
  season_achievements,
} from "@/utilities/achievements.ts";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://backend.warcraft-gym.com';

// Convert backend race string to Race enum number
const raceStringToEnum = (raceStr: string): Race | null => {
  const raceMap: { [key: string]: Race } = {
    'HU': Race.Human,
    'OC': Race.Orc,
    'NE': Race.NightElf,
    'UD': Race.Undead,
    'RANDOM': Race.Random
  };
  return raceMap[raceStr] ?? null;
};

// Get coach profile picture URL from W3Champions API
const getCoachProfilePicture = async (battleTag: string): Promise<string | null> => {
  try {
    const { data } = await axios.get(`https://website-backend.w3champions.com/api/personal-settings/${encodeURIComponent(battleTag)}`);
    const profilePicture = data?.profilePicture;
    
    if (!profilePicture) return null;
    
    const { race, pictureId, isClassic } = profilePicture;
    const baseUrl = 'https://w3champions.wc3.tools/prod/integration/icons';
    
    // Special avatars (race 32)
    if (race === 32) {
      return `${baseUrl}/specialAvatars/SPECIAL_${pictureId}.jpg?v=2`;
    }
    
    // Race-specific avatars
    const raceNames: { [key: number]: string } = {
      0: 'RANDOM',
      1: 'HUMAN',
      2: 'ORC',
      4: 'NIGHTELF',
      8: 'UNDEAD',
      16: 'TOTAL'
    };
    
    const raceName = raceNames[race] || 'RANDOM';
    
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

const gnlBanners: { [key: string]: string } = {
  ["cok"]: gnl_team_cok,
  ["fiends"]: gnl_team_fiends,
  ["apelords"]: gnl_team_apelords,
  ["tttg"]: gnl_team_tttg,
  ["gigglinggoblins"]: gnl_team_gigglinggoblins,
  ["gnlbears"]: gnl_team_gnlbears,
  ["panda"]: gnl_team_panda,
  ["pitty"]: gnl_team_pitty,
};

const gnlIndexBanners: { [key: string]: string } = {
  ["cok"]: gnl_team_index_cok,
  ["fiends"]: gnl_team_index_fiends,
  ["apelords"]: gnl_team_apelords,
  ["tttg"]: gnl_team_index_tttg,
  ["gigglinggoblins"]: gnl_team_index_gigglinggoblins,
  ["gnlbears"]: gnl_team_gnlbears,
  ["panda"]: gnl_team_index_panda,
  ["pitty"]: gnl_team_pitty_index,
};

export const ladderGoal = 500;

// Get team banner from backend API - uses generic missing image as fallback
export const teamGnlBanner: any = (teamData: any) => {
  // teamData can be the full team object or just an ID
  const teamId = typeof teamData === 'object' ? teamData?.teamId : teamData;
  
  if (teamId) {
    return `${backendUrl}/teams/${teamId}/image`;
  }
  
  return gnl_team_missing;
};

export const teamGnlIndexBanner: any = (teamData: any) => {
  const teamId = typeof teamData === 'object' ? teamData?.teamId : teamData;
  
  if (teamId) {
    return `${backendUrl}/teams/${teamId}/image`;
  }
  
  return gnl_team_missing;
};

const calculateStreak = (player: any) => {
  if (player === null) {
    return 0;
  }

  let v1 = 0;
  let v2 = 0;

  for (let i = 0; i < player.data.matches.length; i++) {
    if (iswin(player.data.matches[i], player.battleTag)) {
      v2++;
    } else {
      v1 = v1 > v2 ? v1 : v2;
      v2 = 0;
    }
  }

  player.winStreak = v1;
  return v1;
};

const calculateDailyMMR = (player: any) => {
  if (player === null) {
    return 0;
  }

  let mmr1 = 0;
  let mmr2 = 0;
  let v1 = 0;
  let v2 = 0;

  for (let i = 0; i < player.data.matches.length; i++) {
    if (iswin(player.data.matches[i], player.battleTag)) {
      v2++;
      mmr2 += player.data.matches[i].teams[0].players[0].mmrGain;
    } else {
      v1 = v1 > v2 ? v1 : v2;
      mmr1 = v1 > v2 ? mmr1 : mmr2;
      v2 = 0;
      mmr2 = 0;
    }
  }

  player.mostMMRInADay = mmr1;
  return mmr1;
};

const calculateGamesOnDay = (player: any, date: Moment, key: string) => {
  if (player === null) {
    return 0;
  }

  const count = player.data.matches.filter(
    (m: any) => moment(m.endTime).dayOfYear() === date.dayOfYear(),
  ).length;

  player[key] = count;
  return count;
};

const getData = async (account: IGNLAccount, start: Moment, end: Moment, w3cSeason: number) => {
  // Default structure to ensure all properties exist
  let result: IRaceStatistics = {
    matches: [],
    total: 0,
    wins: 0,
    loss: 0,
    percentage: 0,
    mmr: { current: 0, initial: 0, max: 0, min: 0, diff: 0 },
    race: {}
  } as any;

  try {
    const recent: any = _last(_sortBy(account.data?.matches, "endTime"));
    const actualStart = _isNil(recent) ? start : moment(recent.endTime);

    const all = await getSeasonGamesBetween(
      account.battleTag,
      [w3cSeason],
      actualStart,
      end,
    );

    // Filter out free wins/loss and bugs
    const seasonActual = all.filter((m) => m.durationInSeconds > 2 * 60);

    // account.race is already a Race enum number (converted in fetchCurrentSeasonData)
    const raceEnum = account.race as Race;

    // Filter matches by player's designated race
    const raceFilteredMatches = seasonActual.filter((m) => isRace(account.battleTag, m, raceEnum));

    let statsResult;
    if (recent === undefined) {
      statsResult = getRaceStatistics(
        account.battleTag,
        raceFilteredMatches,
      );
    } else {
      const combinedMatches = [...raceFilteredMatches, ...account.data.matches];
      statsResult = getRaceStatistics(account.battleTag, combinedMatches);
    }

    // Use statsResult if available, otherwise keep default
    if (statsResult) {
      result = statsResult;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
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

export const useGNLStore = defineStore("gnl", () => {
  const timer = ref<number>();

  const data = ref<any>({} as any);

  const start = ref<Moment>(moment());
  const end = ref<Moment>(moment());

  const initialized = ref<boolean>(false);
  const current = ref<number>();
  const currentW3CSeason = ref<number>(21); // Default fallback

  const achievementStats = ref<{ [key: string]: number }>({});
  const playerStats = ref<{ [key: string]: any }>({});
  const numberOfPlayers = ref<number>(0);
  const orbs = ref<any[]>([]);

  const ladderGodCategory = ref<string>("all");
  const ladderGodCategories = [
    "all",
    "week 1",
    "week 2",
    "week 3",
    "week 4",
    "week 5",
    "week 6",
    "week 7",
    "week 8",
  ];

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

  const fetchCurrentSeasonData = async () => {
    try {
      // Fetch current W3C season from backend
      try {
        const { data: w3cConfig } = await axios.get(`${backendUrl}/config/settings/current_wc3_season`);
        if (w3cConfig?.value) {
          currentW3CSeason.value = parseInt(w3cConfig.value);
        }
      } catch (error) {
        console.warn("Failed to fetch current W3C season from backend, using default:", currentW3CSeason.value);
      }

      // Fetch current season info from config
      const { data: config } = await axios.get(`${backendUrl}/config/settings/current_gnl_season`);
      const currentSeasonId = config.value;

      // Fetch season details
      const { data: season } = await axios.get(`${backendUrl}/seasons/${currentSeasonId}`);
      
      // Fetch teams for this season
      const { data: teams } = await axios.get(`${backendUrl}/teams/season/${currentSeasonId}`);

      // Transform backend data to match expected structure
      return {
        id: season.id,
        season: season.name,
        start: moment(season.start_date).format("DD.MM.YYYY"),
        end: moment(season.end_date).format("DD.MM.YYYY"),
        teams: await Promise.all(teams.map(async (team: any) => {
          // Get players for current season from player_by_season object
          const seasonPlayers = team.player_by_season?.[currentSeasonId] || [];
          // Get coaches for current season from coaches_by_season object
          const seasonCoaches = team.coaches_by_season?.[currentSeasonId] || [];
          
          // Fetch profile pictures for all coaches
          const coachesWithPictures = await Promise.all(
            seasonCoaches.map(async (coach: any) => {
              const raceEnum = raceStringToEnum(coach.race);
              return {
                ...coach,
                race: raceEnum, // Convert backend race string to Race enum
                races: [raceEnum], // Expertise section expects an array of races
                roles: ['Coach'], // Hardcoded role for now
                profilePictureUrl: await getCoachProfilePicture(coach.battleTag)
              };
            })
          );
          
          return {
            id: team.name, // Use team short name as ID (matches existing logic)
            teamId: team.id, // Backend team ID for image fetching
            name: team.long_name || team.name,
            prefix: team.name || "", // Team short name as prefix
            coaches: coachesWithPictures,
            players: seasonPlayers.map((player: any) => ({
              battleTag: player.battleTag,
              race: raceStringToEnum(player.race), // Convert backend race string to Race enum
              prefix: player.prefix || undefined, // Only set if defined in backend
              data: { matches: [] }, // Will be populated by getData()
            })),
          };
        })),
      };
    } catch (error) {
      console.error("Failed to fetch GNL season data from backend:", error);
      throw error;
    }
  };

  const initialize = async () => {
    const d = await fetchCurrentSeasonData();
    if (_isEmpty(data.value) || data.value.id !== d.id) {
      start.value = moment(d.start, "DD.MM.YYYY").utc(true).startOf("day");
      end.value = moment(d.end, "DD.MM.YYYY").utc(true).endOf("day");
      data.value = d;
    }

    // Set initialized to true so the page renders with team structure
    // Player data will populate progressively in all()
    initialized.value = true;

    clearTimeout(timer.value);
    void all();
  };

  const refresh = async () => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => all(), 30000);
  };

  const all = async () => {
    const d = data.value;
    start.value = moment(d.start, "DD.MM.YYYY").utc(true).startOf("day");
    end.value = moment(d.end, "DD.MM.YYYY").utc(true).endOf("day");

    const teams =
      current.value === undefined
        ? d.teams
        : d.teams.filter(
            (t: any) => t.teamId === current.value,
          );

    let achievementCount = {};

    let mostGames: any = null,
      mostMMR: any = null,
      mostMMRInADay: any = null,
      winStreak: any = null,
      mostAchievements: any = null,
      mostGamesFirstDay: any = null,
      mostGamesSingleDay: any = null,
      mostGamesLastDay: any = null,
      bestNightElf: any = null,
      bestHuman: any = null,
      bestOrc: any = null,
      bestUndead: any = null,
      bestRandom: any = null;

    let ladderGoals: any[] = [];

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      team.achievements = {};
      for (let p = 0; p < team.players.length; p++) {
        const player = team.players[p];
        player.data = await getData(player, dates.value.start, dates.value.end, currentW3CSeason.value);
        if (current.value !== undefined) {
          getOngoing(player.battleTag).then((r: any) => (player.ongoing = r));
        } else {
          player.ongoing = undefined;
        }
        player.team = team.id;
        player.points = calculateLadderPoints(
          player.battleTag,
          player.data.matches,
        );
        player.achievements = season_achievements["gnl_season_16"].calculate(
          player,
          ladderGoal,
          d.teams,
        );
        player.achievementPoints = calculateAchievementPoints(
          player.achievements,
        );
        player.totalPoints = player.points + player.achievementPoints;

        if (current.value === undefined) {
          // stats
          countAchievements(team.achievements, player.achievements);
          countAchievements(achievementCount, player.achievements);
          numberOfPlayers.value++;

          if (player.points >= 500) {
            ladderGoals.push(player);
          }

          // Fun
          mostGames =
            player.data.total > (mostGames?.data.total ?? 0)
              ? player
              : mostGames;
          mostMMR =
            player.data.mmr.diff > (mostMMR?.data.mmr.diff ?? 0)
              ? player
              : mostMMR;
          mostAchievements =
            player.achievements.length >
            (mostAchievements?.achievements.length ?? 0)
              ? player
              : mostAchievements;

          winStreak =
            calculateStreak(player) > (winStreak?.winStreak ?? 0)
              ? player
              : winStreak;

          mostMMRInADay =
            calculateDailyMMR(player) > (mostMMRInADay?.mostMMRInADay ?? 0)
              ? player
              : mostMMRInADay;

          mostGamesFirstDay =
            calculateGamesOnDay(player, dates.value.start, "gamesFirstDay") >
            (mostGamesFirstDay?.gamesFirstDay ?? 0)
              ? player
              : mostGamesFirstDay;

          mostGamesLastDay =
            calculateGamesOnDay(player, dates.value.end, "gamesLastDay") >
            (mostGamesLastDay?.gamesLastDay ?? 0)
              ? player
              : mostGamesLastDay;

          if (player.battleTag === "NorthDrakkar#1745") {
            mostGamesSingleDay = player;
          }

          bestNightElf =
            player.race === Race.NightElf &&
            player.totalPoints > (bestNightElf?.totalPoints ?? 0)
              ? player
              : bestNightElf;

          bestHuman =
            player.race === Race.Human &&
            player.totalPoints > (bestHuman?.totalPoints ?? 0)
              ? player
              : bestHuman;

          bestOrc =
            player.race === Race.Orc &&
            player.totalPoints > (bestOrc?.totalPoints ?? 0)
              ? player
              : bestOrc;

          bestUndead =
            player.race === Race.Undead &&
            player.totalPoints > (bestUndead?.totalPoints ?? 0)
              ? player
              : bestUndead;

          bestRandom =
            player.race === Race.Random &&
            player.totalPoints > (bestRandom?.totalPoints ?? 0)
              ? player
              : bestRandom;
        }
      }
    }

    if (current.value === undefined) {
      achievementStats.value = achievementCount;
      initialized.value = true;

      playerStats.value = {
        mostGames,
        mostMMR,
        winStreak,
        mostMMRInADay,
        mostAchievements,
        mostGamesFirstDay,
        mostGamesLastDay,
        mostGamesSingleDay,
        bestNightElf,
        bestHuman,
        bestOrc,
        bestUndead,
        bestRandom,
      };

      orbs.value = ladderGoals;
    }
  };

  const save = async (item: any) => {
    const db = useFirestore();
    try {
      await setDoc(doc(db, "gnl", item.id), item);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    data,
    dates,
    save,
    current,

    achievementStats,
    playerStats,
    numberOfPlayers,
    orbs,

    ladderGodCategory,
    ladderGodCategories,

    initialized,
    initialize,
  };
});
