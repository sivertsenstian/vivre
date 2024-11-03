import { defineStore } from "pinia";
import { ref } from "vue";
import { getInfo, getMostRecentGames } from "@/utilities/matchcalculator";
import moment from "moment/moment";
import _forEach from "lodash/forEach";

export const useEscapeStore = defineStore("escape", () => {
  const accounts = {
    Happy: ["AuroraHappy#2668", "Happy#2384", "Cacxa26#2948"],
    Fortitude: ["noname"],
    Starbuck: [
      "drǃbucki#2383",
      "fishingRod#21560",
      "StarBuck#2732",
      "RHotzenplotz#2626",
    ],
    Medusa: ["Medusa#31315"],
    Kaho: ["KAHO#31819"],
    Infi: ["IFFI#1561"],
    Colorful: ["ColorFul#4737"],
    Yumiko: ["HuyaYumiko#4873"],
    Leon: ["Leon#23655"],
    Sok: ["moosangsung#1804"],
    120: ["orange#14823"],
    Lawliet: ["LawLiet#3990"],
    Chaemiko: ["ZizonHuman#3182"],
    Focus: ["FoCuS#31324"],
    Labyrinth: ["LabyRinth#3113"],
    Moon: ["Moon#35134"],
  };
  const data = ref<any>({} as any);

  const loaded = ref(0);

  const start = moment("07.10.2024", "DD.MM.YYYY").startOf("day");
  const today = moment().startOf("day");
  const daysSinceStart = today.diff(start, "days");
  const rule = moment().startOf("isoWeek");
  const latest = 20;

  const getData = async (tag: string) => {
    let result = {};
    try {
      let all = await getMostRecentGames(tag, latest, 100);

      const info = getInfo(tag, all);

      result = {
        battleTag: info.battleTag,
        race: info.race,
        matches: all,
      };
    } catch (error) {
      console.log(error);
    }

    return result;
  };

  const calculate = () => {
    _forEach(accounts, async (accounts, player) => {
      const p = await Promise.all(
        accounts.map((account: string) => getData(account)),
      );
      data.value[player] = p.reduce(
        (s: any, v: any) => ({
          ...s,
          matches: [...s.matches, ...v.matches],
          weekly: {
            matches: [
              ...s.weekly.matches,
              ...v.matches.filter((m: any) => moment(m.endTime).isAfter(rule)),
            ],
            count:
              s.weekly.count +
              v.matches.filter((m: any) => moment(m.endTime).isAfter(rule))
                .length,
          },
        }),
        { player, accounts, matches: [], weekly: { count: 0, matches: [] } },
      );
    });
  };

  // Do it live!
  calculate();
  setInterval(() => {
    calculate();
  }, 10000);

  return {
    data,
    accounts,
    loaded,
  };
});
