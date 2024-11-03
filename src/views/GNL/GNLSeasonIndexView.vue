<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, onMounted } from "vue";
import { teamGnlBanner, useGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const router = useRouter();
const store = useGNLStore();

const current = {
  id: uuidv4(),
  created: moment().toDate(),
  updated: moment().toDate(),
  season: 15,
  start: "29.09.2024",
  end: "10.11.2024",
  teams: [
    {
      id: "luckystrike",
      name: "Lucky Strike",
      prefix: "",
      coaches: [
        {
          battleTag: "Wontu#1218",
          race: Race.NightElf,
          races: [Race.NightElf],
          roles: ["Coach"],
          quotes: ["I love Pit Lord and I hope I can make you love him too"],
        },
        {
          battleTag: "Lucker#11299",
          race: Race.Orc,
          races: [Race.Orc],
          roles: ["Coach"],
          quotes: ["Arriba, Arriba! Andale, Andale!"],
        },
      ],
      players: [
        {
          battleTag: "Tarmok#2559",
          race: 2,
        },
        {
          battleTag: "elravel#2772",
          race: 2,
        },
        {
          battleTag: "GwaiLo#1580",
          race: 1,
        },
        {
          battleTag: "ThaGrinchy31#1490",
          race: 4,
        },
        {
          battleTag: "lucker#11299",
          race: 2,
        },
        {
          battleTag: "АлексићВлада#2613",
          race: 1,
        },
        {
          battleTag: "Slyfer619#11514",
          race: 2,
        },
        {
          battleTag: "Wensleydale#11446",
          race: 1,
        },
        {
          battleTag: "Adventurer#144222263",
          race: 4,
        },
        {
          battleTag: "possa4ever#2888",
          race: 2,
        },
        {
          battleTag: "Shinobuakko#2904",
          race: 4,
        },
        {
          battleTag: "Mou#1245",
          race: 1,
        },
        {
          battleTag: "FEWA418#1895",
          race: 8,
        },
        {
          battleTag: "Blavon#21745",
          race: 0,
        },
        {
          battleTag: "TwinBlaDe",
          race: 4,
        },
        {
          battleTag: "Gone1#2163",
          race: 1,
        },
        {
          battleTag: "Erimav#2482",
          race: 0,
        },
        {
          battleTag: "CountDracula#21854",
          race: 8,
        },
        {
          battleTag: "Hisuich#2529",
          race: 0,
        },
        {
          battleTag: "zelderan#1884",
          race: 2,
        },
        {
          battleTag: "Icesoldier#11528",
          race: 1,
        },
        {
          battleTag: "Beijing#21618",
          race: 0,
        },
        {
          battleTag: "GIGA#2164",
          race: 2,
        },
        {
          battleTag: "ZnooW#21246",
          race: 2,
        },
        {
          battleTag: "drakeasdlfxk#1972",
          race: 4,
        },
        {
          battleTag: "implosion#31477",
          race: 4,
        },
        {
          battleTag: "Death#2934",
          race: 2,
        },
        {
          battleTag: "SPXQuywiX#1201",
          race: 0,
        },
        {
          battleTag: "Wifowmaker#2408",
          race: 2,
        },
      ],
    },
    {
      id: "rageandape",
      name: "Rage & Ape: Attorneys at War",
      prefix: "",
      coaches: [
        {
          battleTag: "floss2xdaily#1987",
          race: Race.Human,
          races: [Race.Human],
          roles: ["Coach", "Assistant Rigger"],
          quotes: [
            "Being bad never felt so good",
            "Hardstuck 1300, why do YOU think I'm a coach? 💰",
          ],
        },
        {
          battleTag: "ToD#2792",
          race: Race.Human,
          races: [Race.Human],
          roles: ["Caster", "Coach", "French"],
          quotes: [],
        },
      ],
      players: [
        {
          battleTag: "xardas#2606",
          race: 1,
        },
        {
          battleTag: "Foxy#23492",
          race: 2,
        },
        {
          battleTag: "Longjacket#2840",
          race: 1,
        },
        {
          battleTag: "mrmikemtl#1698",
          race: 0,
        },
        {
          battleTag: "PainTheRisen#1700",
          race: 4,
        },
        {
          battleTag: "TemplarFenix#1572",
          race: 8,
        },
        {
          battleTag: "Turkeltown#11257",
          race: 1,
        },
        {
          battleTag: "Cloning5#2785",
          race: 8,
        },
        {
          battleTag: "Savior#11574",
          race: 1,
        },
        {
          battleTag: "BaronVonSG#1774",
          race: 0,
        },
        {
          battleTag: "SaygeTV#1613",
          race: 4,
        },
        {
          battleTag: "joeymeister#21958",
          race: 2,
        },
        {
          battleTag: "mo2l#2314",
          race: 4,
        },
        {
          battleTag: "lykossnight #2433",
          race: 4,
        },
        {
          battleTag: "BuzzKill#11639",
          race: 4,
        },
        {
          battleTag: "Guns#21685",
          race: 2,
        },
        {
          battleTag: "dson#21234",
          race: 4,
        },
        {
          battleTag: "KageMan#1160",
          race: 1,
        },
        {
          battleTag: "Gortrist#1439",
          race: 8,
        },
        {
          battleTag: "Gengar#11321",
          race: 2,
        },
        {
          battleTag: "Floss2xdaily",
          race: 1,
        },
        {
          battleTag: "Remote#21761",
          race: 0,
        },
        {
          battleTag: "TLebbet#2684",
          race: 2,
        },
        {
          battleTag: "Barlenn#11791",
          race: 8,
        },
        {
          battleTag: "Genji#26575",
          race: 8,
        },
        {
          battleTag: "noizer#2444",
          race: 2,
        },
        {
          battleTag: "gypsy#11161",
          race: 1,
        },
        {
          battleTag: "Eisen#11506",
          race: 2,
        },
        {
          battleTag: "AoD#2933",
          race: 8,
        },
        {
          battleTag: "Madoka12#1159",
          race: 8,
        },
      ],
    },
    {
      id: "apelords",
      name: "Apelords",
      prefix: "Mr.",
      coaches: [
        {
          battleTag: "SaulApeMan#2163",
          race: Race.Random,
          races: [Race.Human, Race.Undead, Race.Orc, Race.NightElf],
          roles: ["Caster", "Coach", "Ape"],
          quotes: [
            "Makrura for you!",
            "Ladies and Gentlemen, welcome to GNL!",
            "Have you seen the size of my EXCEL SHEETS?",
          ],
        },
        {
          battleTag: "spycreed#2536",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach", "Gabagool"],
          quotes: ["Dont snipe Mr. Harstem!", "It's-a Me, Spycreed!"],
        },
      ],
      players: [
        {
          battleTag: "veS#1614",
          race: 8,
        },
        {
          battleTag: "ThreeWayKay#2610",
          race: 1,
        },
        {
          battleTag: "Mushman#11671",
          race: 1,
        },
        {
          battleTag: "Exiled#21153",
          race: 8,
        },
        {
          battleTag: "EvGamer#2120",
          race: 1,
        },
        {
          battleTag: "StrsNStripes#1943",
          race: 8,
        },
        {
          battleTag: "Jinvvar#2488",
          race: 2,
        },
        {
          battleTag: "DwieTwarze#2534",
          race: 4,
        },
        {
          battleTag: "LuZiFus#2669",
          race: 8,
        },
        {
          battleTag: "Nerlsz#2780",
          race: 0,
        },
        {
          battleTag: "DGraves#11954",
          race: 8,
        },
        {
          battleTag: "Bandelero#11787",
          race: 4,
        },
        {
          battleTag: "pvpdactyl#2341",
          race: 2,
        },
        {
          battleTag: "Wiking#21750",
          race: 1,
        },
        {
          battleTag: "ArtWarcraft#21663",
          race: 2,
        },
        {
          battleTag: "Zsidóármány#2125",
          race: 4,
        },
        {
          battleTag: "lowHIGHlow#2352",
          race: 2,
        },
        {
          battleTag: "ArchEnemy#11829",
          race: 8,
        },
        {
          battleTag: "Cenotaph#11854",
          race: 4,
        },
        {
          battleTag: "Freakwenzy#2840",
          race: 1,
        },
        {
          battleTag: "Dirge#21649",
          race: 8,
        },
        {
          battleTag: "smallSun#21670",
          race: 1,
        },
        {
          battleTag: "F4CKHEAD#2498",
          race: 4,
        },
        {
          battleTag: "Spray4fun#2803",
          race: 2,
        },
        {
          battleTag: "Mataratzi#2446",
          race: 4,
        },
        {
          battleTag: "Griffin#1965",
          race: 8,
        },
        {
          battleTag: "Supa#2123",
          race: 2,
        },
        {
          battleTag: "Sokół#21328",
          race: 1,
        },
        {
          battleTag: "be4r#21991",
          race: 1,
        },
      ],
    },
    {
      id: "mannertime",
      name: "Manner Time",
      prefix: "",
      coaches: [
        {
          battleTag: "gotQuail#1103",
          race: Race.Human,
          races: [Race.Human],
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "kennyg6050#1543",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
          quotes: [],
        },
      ],
      players: [
        {
          battleTag: "RaZeR#23389",
          race: 8,
        },
        {
          battleTag: "Naujanas#2161",
          race: 2,
        },
        {
          battleTag: "HighKnight#11952",
          race: 1,
        },
        {
          battleTag: "Curunir#21273",
          race: 1,
        },
        {
          battleTag: "thodoris254#1264",
          race: 1,
        },
        {
          battleTag: "SoftIceCream#11120",
          race: 1,
        },
        {
          battleTag: "Manadog#1752",
          race: 2,
        },
        {
          battleTag: "Champloo#1425",
          race: 4,
        },
        {
          battleTag: "thehitpack",
          race: 8,
        },
        {
          battleTag: "leviathan#14753",
          race: 2,
        },
        {
          battleTag: "BobSacamano#21950",
          race: 4,
        },
        {
          battleTag: "Adaminh0#2932",
          race: 4,
        },
        {
          battleTag: "GamingDC#1471",
          race: 1,
        },
        {
          battleTag: "Superrman#2941",
          race: 8,
        },
        {
          battleTag: "Wizzer#11863",
          race: 1,
        },
        {
          battleTag: "GonzoTramer#2346",
          race: 8,
        },
        {
          battleTag: "Kvydi#2153",
          race: 8,
        },
        {
          battleTag: "Adenor#1539",
          race: 0,
        },
        {
          battleTag: "ItzAlex#21692",
          race: 4,
        },
        {
          battleTag: "LongXi#2909",
          race: 1,
        },
        {
          battleTag: "Apezap#1478",
          race: 2,
        },
        {
          battleTag: "SacredAngels#2893",
          race: 2,
        },
        {
          battleTag: "pischner#2950",
          race: 4,
        },
        {
          battleTag: "Logic#1436",
          race: 1,
        },
        {
          battleTag: "Glarer#21552",
          race: 8,
        },
        {
          battleTag: "Sp4rta#2973",
          race: 8,
        },
        {
          battleTag: "KWat#1193",
          race: 2,
        },
        {
          battleTag: "Zanatas#11745",
          race: 8,
        },
        {
          battleTag: "fourthAge#1445",
          race: 2,
        },
        {
          battleTag: "Bandlez#1752",
          race: 2,
        },
      ],
    },
    {
      id: "gigglinggoblins",
      name: "Giggling Goblins",
      prefix: "",
      coaches: [
        {
          battleTag: "NorthDrakkar#1745",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach", "Buglover #1", "120 Fanboy"],
          quotes: ["Look! I found a cryptlord first game!"],
        },
        {
          battleTag: "Ember#21963",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
        },
      ],
      players: [
        {
          battleTag: "Killrog#21773",
          race: 1,
        },
        {
          battleTag: "Skywalker#2206",
          race: 0,
        },
        {
          battleTag: "Winwake#2314",
          race: 2,
        },
        {
          battleTag: "MasaCom#3609",
          race: 4,
        },
        {
          battleTag: "Waylander#2826",
          race: 0,
        },
        {
          battleTag: "Dekker#2290",
          race: 8,
        },
        {
          battleTag: "Leshka#21750",
          race: 4,
        },
        {
          battleTag: "shiNe#1396",
          race: 1,
        },
        {
          battleTag: "JAIMECAKE#2602",
          race: 2,
        },
        {
          battleTag: "cava#21665",
          race: 1,
        },
        {
          battleTag: "hellomotto#2918",
          race: 8,
        },
        {
          battleTag: "Hermeus#21468",
          race: 4,
        },
        {
          battleTag: "Sevenofnine#11332",
          race: 4,
        },
        {
          battleTag: "Zinithin#1702",
          race: 8,
        },
        {
          battleTag: "MrBakteria#21657",
          race: 1,
        },
        {
          battleTag: "StarscreamR#2663",
          race: 2,
        },
        {
          battleTag: "coremix#2488",
          race: 2,
        },
        {
          battleTag: "Tacoshell#1753",
          race: 2,
        },
        {
          battleTag: "WeaponX#21501",
          race: 1,
        },
        {
          battleTag: "Sway#1849",
          race: 4,
        },
        {
          battleTag: "gregzor#21270",
          race: 8,
        },
        {
          battleTag: "Steph#1351",
          race: 0,
        },
        {
          battleTag: "Loneshark#11407",
          race: 4,
        },
        {
          battleTag: "FlexFalcon#2318",
          race: 1,
        },
        {
          battleTag: "CryptoManiac#21499",
          race: 8,
        },
        {
          battleTag: "Agape#2173",
          race: 4,
        },
        {
          battleTag: "LinYuRong101#1714",
          race: 1,
        },
        {
          battleTag: "Jeppe#22909",
          race: 2,
        },
        {
          battleTag: "Munsoon#2468",
          race: 2,
        },
      ],
    },
    {
      id: "gnlbears",
      name: "GNL Bears",
      prefix: "",
      coaches: [
        {
          battleTag: "Barren#1153",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach", "Lawyer"],
          quotes: ["Focus Pocus!", "Hotpot"],
        },
        {
          battleTag: "EmilyHuttson#1378",
          race: Race.Random,
          races: [Race.Human, Race.Orc, Race.NightElf, Race.Undead],
          roles: ["Coach", "Bajo Jajo Master"],
          quotes: ["Have you tried Pitlord first?"],
        },
        {
          battleTag: "jolin#31419",
          race: Race.NightElf,
          races: [Race.NightElf],
          roles: ["Coach", "Jabba"],
          quotes: [
            "Who here?",
            "<Donut.jpg>",
            "Jabba will teach u chinese paladin",
          ],
        },
      ],
      players: [
        {
          battleTag: "SOULKEEPA#21303",
          race: 2,
        },
        {
          battleTag: "biskuit#21557",
          race: 2,
        },
        {
          battleTag: "ImaPanda#2127",
          race: 4,
        },
        {
          battleTag: "RobotNinja#2136641",
          race: 1,
        },
        {
          battleTag: "Starscream#11331",
          race: 8,
        },
        {
          battleTag: "cedde#2548",
          race: 4,
        },
        {
          battleTag: "noMADic#11242",
          race: 1,
        },
        {
          battleTag: "Dargrum#2289",
          race: 4,
        },
        {
          battleTag: "AllSupTTV#2359",
          race: 4,
        },
        {
          battleTag: "EASHIBBY#2644",
          race: 0,
        },
        {
          battleTag: "Crimson#1347",
          race: 4,
        },
        {
          battleTag: "RickeHult#2698",
          race: 8,
        },
        {
          battleTag: "Winters#1833",
          race: 4,
        },
        {
          battleTag: "AlexMejor#2851",
          race: 8,
        },
        {
          battleTag: "Reufury#6989",
          race: 2,
        },
        {
          battleTag: "Kaccel#2863",
          race: 1,
        },
        {
          battleTag: "Vallok#21620",
          race: 8,
        },
        {
          battleTag: "ArcMessenger#1214",
          race: 8,
        },
        {
          battleTag: "Ignotus5#1918",
          race: 1,
        },
        {
          battleTag: "Cheeseboy#1846",
          race: 4,
        },
        {
          battleTag: "aeiouandxyz#1744",
          race: 1,
        },
        {
          battleTag: "NotSure#11563",
          race: 1,
        },
        {
          battleTag: "P07470#11292",
          race: 2,
        },
        {
          battleTag: "LavaOgre#18463",
          race: 2,
        },
        {
          battleTag: "irritated#21154",
          race: 1,
        },
        {
          battleTag: "Disproved#21742",
          race: 8,
        },
        {
          battleTag: "Qraut#2653",
          race: 2,
        },
        {
          battleTag: "eworm#21209",
          race: 8,
        },
        {
          battleTag: "Shlumples#1394",
          race: 0,
        },
      ],
    },
  ],
};

// Chart stuff
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Tooltip,
  LineController,
} from "chart.js";
import "chartjs-adapter-moment";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { v4 as uuidv4 } from "uuid";
import moment from "moment/moment";
import { useRouter } from "vue-router";
import _round from "lodash/round";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import _range from "lodash/range";
import _isEmpty from "lodash/isEmpty";
import _take from "lodash/take";
import _skip from "lodash/drop";

ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  ChartDataLabels,
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      type: "category",
      stacked: true,
    },
    y: {
      grid: { display: false },
      min: 0,
      suggestedMax: 1000,
    },
  },
} as any;
// End

const points = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams.map((t: any) => {
    return t.players?.reduce((s: number, p: any) => {
      return s + (p.totalPoints ?? 0);
    }, 0);
  });
});

const games = computed(() => {
  if (_isEmpty(store.data?.teams)) {
    return [];
  }
  return store.data.teams.map((t: any) => {
    return t.players?.reduce((s: number, p: any) => {
      return s + (p.data?.total ?? 0);
    }, 0);
  });
});

const leader = computed(() => {
  const i = points.value.indexOf(Math.max(...points.value));
  return i > 0 ? store.data?.teams?.[i] : {};
});

// Text
const model = defineModel<string>({
  default: `
  # Information about the page
  This page is a support tool to help motivate all the GNL participants and teams to practice on the [w3c ladder](https://w3champions.com/) in between official GNL games.
  If you are on a team, you can contribute to make sure that **your** team wins the GNL Ladder race!

  Every win on the ladder awards **3** points, and every loss awards **1** point for the team that you represent. __Regardless of MMR__

  This overview page shows the current total ladder points for each team, with the current leader - and the individual team pages show both information
  about coaches and players! You can access the team pages in the menu on the left or by clicking the team icon above!

  Can you help your team win the ladder race? Are you the one to claim ladder RANK #1 on your team?
  Why delay? Go search for a ladder game right now and find out!
  `,
});

onMounted(() => {
  store.initialize();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-sheet
        v-if="_isEmpty(store.data)"
        class="pa-md-12 pa-3"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-md-h2 text-h5">
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <hr />
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="6" md="4" v-for="_ in _range(0, 6)">
                <v-skeleton-loader type="image" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader type="table" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="image" height="150" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="paragraph" />
          </v-col>
        </v-row>
      </v-sheet>

      <v-sheet
        v-else
        class="pa-md-12 pa-3"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-md-h2 text-h5">
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <v-btn
              v-if="false"
              color="success"
              @click="() => store.save(current)"
              >SAVE</v-btn
            >
            <hr />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col cols="12" md="8">
            <v-row>
              <v-col v-for="team in store.data?.teams ?? []" cols="6" md="4">
                <v-card
                  :class="`team ${leader?.id === team.id ? 'gold' : ''}`"
                  @click="() => router.push(`/gnl/${team.id}`)">
                  <v-img
                    :src="teamGnlBanner(team.id)"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    cover>
                    <v-card-title>
                      <span
                        :style="{
                          verticalAlign: 'middle',
                          color: leader?.id === team.id ? 'yellow' : 'white',
                        }">
                        <v-icon
                          v-if="leader?.id === team.id"
                          icon="mdi-trophy"
                          class="ml-1" />
                        {{ team.name }}
                      </span>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="4">
            <Bar
              height="250px"
              :data="{
                labels: _isEmpty(store.data.teams)
                  ? []
                  : store.data.teams?.map((t: any) => t.name),
                datasets: [
                  {
                    label: 'points',
                    backgroundColor: 'rgba(218, 165, 32, 0.3)',
                    borderColor: 'goldenrod',
                    borderWidth: 2,
                    barPercentage: 0.5,
                    data: points,
                    datalabels: {
                      clip: true,
                      clamp: true,
                      anchor: 'end',
                      align: 'end',
                      offset: 0,
                      color: 'goldenrod',
                    },
                  },
                  {
                    label: 'games',
                    backgroundColor: 'rgba(218, 165, 32, 0.3)',
                    borderColor: 'goldenrod',
                    borderWidth: 2,
                    barPercentage: 0.5,
                    data: games,
                    datalabels: {
                      clip: true,
                      clamp: true,
                      anchor: 'end',
                      align: 'end',
                      offset: 0,
                      color: 'goldenrod',
                    },
                  },
                ],
              }"
              :options="options" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-divider />
          </v-col>
        </v-row>

        <v-row
          ><v-col
            cols="12"
            class="text-center text-h6 text-uppercase d-flex align-center"
            ><span class="text-h4 text-green-accent-3 ml-auto mr-2">{{
              games.reduce((r: any, s: any) => r + s, 0)
            }}</span>
            <span class="mr-auto">GNL Ladder Games Played So Far!</span></v-col
          ></v-row
        >

        <v-row>
          <v-col cols="12" class="text-center">
            <div class="text-md-h3 text-h5">
              Welcome to the <span class="text-green-accent-4">un</span>Official
              GNL site
            </div>
          </v-col>
          <v-col cols="12" class="text-center">
            <section>
              Visit the
              <a
                target="_blank"
                href="https://warcraft-gym.com/gnl/schedule-week-1/"
                >OFFICIAL</a
              >
              site for match schedules, standings and leaderboards for the team
              matches!
            </section>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex align-center">
            <v-icon icon="mdi-run" size="x-large" />
            <span
              class="font-weight-bold"
              style="
                width: 0;
                height: 0;
                position: relative;
                top: 30px;
                right: 50px;
              ">
              {{ store.dates.start.format("DD.MM.YYYY") }}
            </span>
            <v-progress-linear
              striped
              style="border: 1px solid gray"
              :color="
                store.dates.durationInDays - store.dates.daysSinceStart <= 0
                  ? 'success'
                  : 'warning'
              "
              :model-value="store.dates.daysSinceStart"
              :max="store.dates.durationInDays"
              :height="45">
              <strong v-if="store.dates.daysSinceStart >= 0"
                >{{
                  _round(
                    (store.dates.daysSinceStart / store.dates.durationInDays) *
                      100,
                  )
                }}%</strong
              >
            </v-progress-linear>
            <v-icon icon="mdi-exit-run" size="x-large" />
            <v-icon icon="mdi-flag-checkered" size="x-large" />
            <span
              class="font-weight-bold"
              style="
                width: 0;
                height: 0;
                position: relative;
                top: 30px;
                right: 75px;
              ">
              {{ store.dates.end.format("DD.MM.YYYY") }}
            </span>
          </v-col>
          <v-icon
            v-if="
              store.dates.daysSinceStart / store.dates.durationInDays > 0.01 &&
              store.dates.daysSinceStart / store.dates.durationInDays < 0.9
            "
            icon="mdi-run-fast"
            color="warning"
            size="x-large"
            :style="`width: 0; heigth: 0; position: relative; 
            top: -50px;
              left: calc(${((store.dates.daysSinceStart + 1) / store.dates.durationInDays) * 100}%)
              `" />
          <v-col
            cols="12"
            class="text-center"
            v-if="store.dates.daysSinceStart >= 0">
            <div class="text-md-h4 text-h5 font-weight-bold">
              <span
                >{{
                  store.dates.durationInDays - store.dates.daysSinceStart
                }}
                days left of the league</span
              >
              <span class="px-2">-</span>
              <span>Let's Go!</span>
            </div>
          </v-col>
          <v-col cols="12" class="text-center" v-else>
            <div class="text-md-h4 text-h5 font-weight-bold">
              <span
                >{{ Math.abs(store.dates.daysSinceStart) }} days until we
                roll</span
              >
              <span class="px-2">-</span>
              <span>HYPE!</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <markdown-viewer v-model="model" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>

<style>
.team {
  border: 1px solid transparent;
  cursor: pointer;
  opacity: 0.8;
}
.team:hover {
  opacity: 1;
  border: 1px solid white;
}

.gold {
  background: radial-gradient(
      ellipse farthest-corner at right bottom,
      #fedb37 0%,
      #fdb931 8%,
      #9f7928 30%,
      #8a6e2f 40%,
      transparent 80%
    ),
    radial-gradient(
      ellipse farthest-corner at left top,
      #ffffff 0%,
      #ffffac 8%,
      #d1b464 25%,
      #5d4a1f 62.5%,
      #5d4a1f 100%
    );
}

.team.gold:hover {
  border-color: goldenrod;
}
</style>
