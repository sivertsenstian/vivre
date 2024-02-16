import axios from 'axios'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import _groupBy from 'lodash/groupBy'
import _last from 'lodash/last'
import _first from 'lodash/first'
import _round from 'lodash/round'
import _range from 'lodash/range'
import moment from 'moment'
import { useSettingsStore } from './settings'

export enum Race {
  Random = 0,
  Human = 1,
  Orc = 2,
  NightElf = 4,
  Undead = 8
}

export const useStatsStore = defineStore('stats', () => {
  const settings = useSettingsStore()
  const tag = settings.data.battleTag

  const url = `https://website-backend.w3champions.com/api/matches/search?playerId=${encodeURIComponent(
    tag
  )}&gateway=20&offset=0&pageSize=100&gameMode=1&season=17`

  const daily = ref({ count: 0, matches: [] })
  const weekly = ref({ count: 0, matches: [] })

  const today = moment().startOf('day')
  const rule = moment().startOf('isoWeek')

  const player = ref({
    mmr: 0,
    performance: [] as boolean[],
    day: {
      total: 0,
      wins: 0,
      loss: 0,
      percentage: 0,
      mmr: {
        diff: 0
      },
      race: {
        [Race.Random]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.Human]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.Orc]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.NightElf]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.Undead]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        }
      }
    },
    week: {
      total: 0,
      wins: 0,
      loss: 0,
      percentage: 0,
      mmr: {
        diff: 0
      },
      race: {
        [Race.Random]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.Human]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.Orc]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.NightElf]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        },
        [Race.Undead]: {
          total: 0,
          wins: 0,
          loss: 0,
          percentage: 0
        }
      }
    }
  })

  const getMatches = async () => {
    try {
      const { data: response } = await axios.get(url)
      const weekActual = response.matches.filter((m: any) => moment(m.endTime).isAfter(rule))
      const dayActual = response.matches.filter((m: any) => moment(m.endTime).isAfter(today))

      const getwins = (m: any) =>
        m.teams.some(
          (t: any) =>
            t.won && t.players.some((p: any) => p.battleTag.toLowerCase() === tag.toLowerCase())
        )
      const getloss = (m: any) =>
        m.teams.some(
          (t: any) =>
            !t.won && t.players.some((p: any) => p.battleTag.toLowerCase() === tag.toLowerCase())
        )

      const week = {
        wins: weekActual.filter(getwins),
        loss: weekActual.filter(getloss),
        race: {
          wins: _groupBy(weekActual.filter(getwins), (w) => w.teams[1].players[0].race),
          loss: _groupBy(weekActual.filter(getloss), (l) => l.teams[0].players[0].race)
        }
      }

      const day = {
        wins: dayActual.filter(getwins),
        loss: dayActual.filter(getloss),
        race: {
          wins: _groupBy(dayActual.filter(getwins), (w) => w.teams[1].players[0].race),
          loss: _groupBy(dayActual.filter(getloss), (l) => l.teams[0].players[0].race)
        }
      }

      const getPercentage = (data: any, race: Race) => {
        return _round(
          ((data?.wins?.[race]?.length ?? 0) / Math.max(1, getTotal(data, race))) * 100,
          1
        )
      }

      const getTotal = (data: any, race: Race) => {
        return (data?.wins?.[race]?.length ?? 0) + (data?.loss?.[race]?.length ?? 0)
      }

      const info = _first<any>(weekActual)?.teams?.reduce(
        (r: any, t: any) =>
          t.players.some((p: any) => p.battleTag.toLowerCase() === tag.toLowerCase())
            ? t.players[0]
            : r,
        {}
      )
      const infoStartOfDay = _last<any>(dayActual)?.teams?.reduce(
        (r: any, t: any) =>
          t.players.some((p: any) => p.battleTag.toLowerCase() === tag.toLowerCase())
            ? t.players[0]
            : r,
        {}
      )
      const infoStartOfWeek = _last<any>(weekActual)?.teams?.reduce(
        (r: any, t: any) =>
          t.players.some((p: any) => p.battleTag.toLowerCase() === tag.toLowerCase())
            ? t.players[0]
            : r,
        {}
      )

      info.startOfWeekMmr = infoStartOfWeek.oldMmr
      info.startOfWeekDiffMmr = info.currentMmr - info.startOfWeekMmr

      info.startOfDayMmr = infoStartOfDay?.oldMmr ?? info.currentMmr
      info.startOfDayDiffMmr = info.currentMmr - info.startOfDayMmr

      const flip = () => {
        return Math.floor(Math.random() * 2) === 1
      }

      player.value = {
        mmr: info.currentMmr,
        performance: weekActual.map(
          (match: any) =>
            match?.teams?.[0]?.players?.[0]?.battleTag.toLowerCase() ===
            settings.data.battleTag.toLowerCase()
        ),
        day: {
          total: dayActual.length,
          wins: day.wins.length,
          loss: day.loss.length,
          percentage: 0,
          mmr: {
            diff: info.startOfDayDiffMmr
          },
          race: {
            [Race.Random]: {
              total: getTotal(day.race, Race.Random),
              percentage: getPercentage(day.race, Race.Random),
              wins: day.race?.wins?.[Race.Random]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Random]?.length ?? 0
            },
            [Race.Human]: {
              total: getTotal(day.race, Race.Human),
              percentage: getPercentage(day.race, Race.Human),
              wins: day.race?.wins?.[Race.Human]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Human]?.length ?? 0
            },
            [Race.Orc]: {
              total: getTotal(day.race, Race.Orc),
              percentage: getPercentage(day.race, Race.Orc),
              wins: day.race?.wins?.[Race.Orc]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Orc]?.length ?? 0
            },
            [Race.NightElf]: {
              total: getTotal(day.race, Race.NightElf),
              percentage: getPercentage(day.race, Race.NightElf),
              wins: day.race?.wins?.[Race.NightElf]?.length ?? 0,
              loss: day?.race?.loss?.[Race.NightElf]?.length ?? 0
            },
            [Race.Undead]: {
              total: getTotal(day.race, Race.Undead),
              percentage: getPercentage(day.race, Race.Undead),
              wins: day.race?.wins?.[Race.Undead]?.length ?? 0,
              loss: day?.race?.loss?.[Race.Undead]?.length ?? 0
            }
          }
        },
        week: {
          total: weekActual.length,
          wins: week.wins.length,
          loss: week.loss.length,
          percentage: 0,
          mmr: {
            diff: info.startOfWeekDiffMmr
          },
          race: {
            [Race.Random]: {
              total: getTotal(week.race, Race.Random),
              percentage: getPercentage(week.race, Race.Random),
              wins: week.race?.wins?.[Race.Random]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Random]?.length ?? 0
            },
            [Race.Human]: {
              total: getTotal(week.race, Race.Human),
              percentage: getPercentage(week.race, Race.Human),
              wins: week.race?.wins?.[Race.Human]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Human]?.length ?? 0
            },
            [Race.Orc]: {
              total: getTotal(week.race, Race.Orc),
              percentage: getPercentage(week.race, Race.Orc),
              wins: week.race?.wins?.[Race.Orc]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Orc]?.length ?? 0
            },
            [Race.NightElf]: {
              total: getTotal(week.race, Race.NightElf),
              percentage: getPercentage(week.race, Race.NightElf),
              wins: week.race?.wins?.[Race.NightElf]?.length ?? 0,
              loss: week?.race?.loss?.[Race.NightElf]?.length ?? 0
            },
            [Race.Undead]: {
              total: getTotal(week.race, Race.Undead),
              percentage: getPercentage(week.race, Race.Undead),
              wins: week.race?.wins?.[Race.Undead]?.length ?? 0,
              loss: week?.race?.loss?.[Race.Undead]?.length ?? 0
            }
          }
        }
      }

      daily.value = dayActual
      weekly.value = weekActual
    } catch (error) {
      console.log(error)
    }
  }

  getMatches()
  setInterval(() => {
    getMatches()
  }, 60000)

  return { weekly, daily, getMatches, player }
})
