export const currentUrl = (tag: string) =>
  `https://website-backend.w3champions.com/api/matches/ongoing/${encodeURIComponent(
    tag,
  )}`;

export const opponentHistoryUrl = (
  tag: string,
  opponent: string,
  season: number,
) =>
  `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
    tag,
  )}&opponentId=${encodeURIComponent(opponent)}&pageSize=100&season=${season}`;

export const getMatchUrl = (id: string) =>
  `https://website-backend.w3champions.com/api/matches/${id}`;

export const search = (name: string) =>
  `https://website-backend.w3champions.com/api/players/global-search?search=${encodeURIComponent(
    name,
  )}&pageSize=20`;
