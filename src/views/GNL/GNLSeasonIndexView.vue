<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";
import { teamGnlBanner, useGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const router = useRouter();
const store = useGNLStore();

const testPlayers = [
  {
    battleTag: "PxiaoLeiA#3755",
    race: Race.Human,
  },
  {
    battleTag: "JINlaohu#3583",
    race: Race.Undead,
  },
  {
    battleTag: "ThePretender#21867",
    race: Race.Orc,
  },
  {
    battleTag: "OOoooooD#21437",
    race: Race.Human,
  },
  {
    battleTag: "xiaoshuangsh#1847",
    race: Race.Undead,
  },
  {
    battleTag: "kaneyu1234#1962",
    race: Race.NightElf,
  },
  {
    battleTag: "Андромед#21688",
    race: Race.NightElf,
  },
  {
    battleTag: "xiangyuxmds#2611",
    race: Race.NightElf,
  },
  {
    battleTag: "Primera#21505",
    race: Race.Undead,
  },
  {
    battleTag: "PARALLAX#12547",
    race: Race.Human,
  },
  {
    battleTag: "blue#17652",
    race: Race.NightElf,
  },
  {
    battleTag: "RobotNinja#2136641",
    race: Race.NightElf,
  },
  {
    battleTag: "하늘#34992",
    race: Race.NightElf,
  },
  {
    battleTag: "Luchex#11919",
    race: Race.Human,
  },
  {
    battleTag: "MyNameIsJeff#22660",
    race: Race.Random,
  },
  {
    battleTag: "alienufo#21441",
    race: Race.Human,
  },
  {
    battleTag: "ShadowZS#21866",
    race: Race.Orc,
  },
  {
    battleTag: "yupu#11767",
    race: Race.NightElf,
  },
  {
    battleTag: "Theviro#11559",
    race: Race.Undead,
  },
  {
    battleTag: "NootNoot#11255",
    race: Race.Orc,
  },
  {
    battleTag: "JustDoiTpLs#2907",
    race: Race.Orc,
  },
  {
    battleTag: "MoldMerchant#2430",
    race: Race.Orc,
  },
  {
    battleTag: "Warsong#21562",
    race: Race.Orc,
  },
  {
    battleTag: "whiteboyz#11129",
    race: Race.Undead,
  },
  {
    battleTag: "Cola#12908",
    race: Race.Orc,
  },
  {
    battleTag: "WnDXi#1611",
    race: Race.Orc,
  },
  {
    battleTag: "Vain#1516",
    race: Race.NightElf,
  },
  {
    battleTag: "NICKT#6757",
    race: Race.Orc,
  },
  {
    battleTag: "pelado#11589",
    race: Race.NightElf,
  },
  {
    battleTag: "Fanfycn#3476",
    race: Race.Undead,
  },
  {
    battleTag: "Brekkie#21685",
    race: Race.NightElf,
  },
  {
    battleTag: "SatiiNi#21864",
    race: Race.Human,
  },
  {
    battleTag: "mynamejh#31958",
    race: Race.NightElf,
  },
  {
    battleTag: "Zimin#21871",
    race: Race.Random,
  },
  {
    battleTag: "JCVD#2439",
    race: Race.Undead,
  },
  {
    battleTag: "Rob#24463",
    race: Race.NightElf,
  },
  {
    battleTag: "FunnyName#21744",
    race: Race.Human,
  },
  {
    battleTag: "NewbeFrankie#3650",
    race: Race.Random,
  },
  {
    battleTag: "figo#11826",
    race: Race.Human,
  },
  {
    battleTag: "SuperNinja#1588214",
    race: Race.Orc,
  },
  {
    battleTag: "henji#4482",
    race: Race.NightElf,
  },
  {
    battleTag: "bynx#3763",
    race: Race.Human,
  },
  {
    battleTag: "KenT#2740",
    race: Race.NightElf,
  },
  {
    battleTag: "sCiMiTar#22984",
    race: Race.Random,
  },
  {
    battleTag: "any123#11262",
    race: Race.NightElf,
  },
  {
    battleTag: "Ronaldinho#21402",
    race: Race.Orc,
  },
  {
    battleTag: "SimYaël#2351",
    race: Race.Orc,
  },
  {
    battleTag: "LaRusso#11213",
    race: Race.NightElf,
  },
  {
    battleTag: "yuanbisheng#1216",
    race: Race.Orc,
  },
  {
    battleTag: "metil#11530",
    race: Race.Orc,
  },
  {
    battleTag: "Drex#21756",
    race: Race.Orc,
  },
  {
    battleTag: "vicsha#3691",
    race: Race.Human,
  },
  {
    battleTag: "KBSC24#2379",
    race: Race.Orc,
  },
  {
    battleTag: "okku#2255",
    race: Race.Undead,
  },
  {
    battleTag: "Apm50#1700",
    race: Race.Human,
  },
  {
    battleTag: "Iamrayzhang#3409",
    race: Race.Orc,
  },
  {
    battleTag: "daRe#2479",
    race: Race.Orc,
  },
  {
    battleTag: "小怪兽#31882",
    race: Race.Orc,
  },
  {
    battleTag: "laoxu#11417",
    race: Race.Random,
  },
  {
    battleTag: "Adenor#1539",
    race: Race.Random,
  },
  {
    battleTag: "SimYaël#2351",
    race: Race.Human,
  },
  {
    battleTag: "zhoupps#3268",
    race: Race.Human,
  },
  {
    battleTag: "yeshkinkot#21567",
    race: Race.Human,
  },
  {
    battleTag: "Ayur#2760",
    race: Race.Random,
  },
  {
    battleTag: "Reyenir#2169",
    race: Race.Random,
  },
  {
    battleTag: "Gyubh#1124",
    race: Race.Random,
  },
  {
    battleTag: "Necromanccer#2867",
    race: Race.Human,
  },
  {
    battleTag: "Tosh#2920",
    race: Race.Undead,
  },
  {
    battleTag: "Longjacket#2840",
    race: Race.Human,
  },
  {
    battleTag: "Kato#1245",
    race: Race.NightElf,
  },
  {
    battleTag: "Cola#12908",
    race: Race.Human,
  },
  {
    battleTag: "Kov#11865",
    race: Race.NightElf,
  },
  {
    battleTag: "PaiPai#11577",
    race: Race.NightElf,
  },
  {
    battleTag: "r1CHASSNlGGa#1759",
    race: Race.Random,
  },
  {
    battleTag: "Dibuji#2477",
    race: Race.Orc,
  },
  {
    battleTag: "Leshka#21750",
    race: Race.Orc,
  },
  {
    battleTag: "CrAzYMiCrO#2465",
    race: Race.Human,
  },
  {
    battleTag: "Qsoldier#3208",
    race: Race.Human,
  },
  {
    battleTag: "아샬라노레#31927",
    race: Race.Human,
  },
  {
    battleTag: "little#12277",
    race: Race.Human,
  },
  {
    battleTag: "Pbmatch#21881",
    race: Race.NightElf,
  },
  {
    battleTag: "NeonGhost#23343",
    race: Race.Human,
  },
  {
    battleTag: "uNiQuE#2654",
    race: Race.Undead,
  },
  {
    battleTag: "jeaboy#2314",
    race: Race.Orc,
  },
  {
    battleTag: "SlimShady#22935",
    race: Race.Orc,
  },
  {
    battleTag: "ShadowZS#21866",
    race: Race.Random,
  },
  {
    battleTag: "appleofagony#2677",
    race: Race.Random,
  },
  {
    battleTag: "Gaben#22392",
    race: Race.Human,
  },
  {
    battleTag: "saibotzinho#1319",
    race: Race.NightElf,
  },
  {
    battleTag: "Life#12460",
    race: Race.Orc,
  },
  {
    battleTag: "Sphinx#22547",
    race: Race.NightElf,
  },
  {
    battleTag: "Tanthalas#3421",
    race: Race.Orc,
  },
  {
    battleTag: "LLVR#2808",
    race: Race.Human,
  },
  {
    battleTag: "Pow#11520",
    race: Race.Human,
  },
  {
    battleTag: "DoNotWinMe#1357",
    race: Race.Human,
  },
  {
    battleTag: "Isendel#1786",
    race: Race.Human,
  },
  {
    battleTag: "pharaON#22353",
    race: Race.Undead,
  },
  {
    battleTag: "Fozzy0503#2578",
    race: Race.Human,
  },
  {
    battleTag: "fResHLiViT#2218",
    race: Race.Human,
  },
  {
    battleTag: "gigahertz#21517",
    race: Race.Random,
  },
];

const current = {
  id: uuidv4(),
  created: moment().toDate(),
  updated: moment().toDate(),
  season: 15,
  start: "01.09.2024",
  end: "01.10.2024",
  teams: [
    {
      id: "chinesepaladin",
      name: "Chinese Paldin",
      prefix: "",
      coaches: [
        {
          battleTag: "Wontu#1218",
          race: Race.NightElf,
          races: [Race.NightElf],
          roles: ["Coach"],
        },
        {
          battleTag: "Lucker#11299",
          race: Race.Orc,
          races: [Race.Orc],
          roles: ["Coach"],
        },
      ],
      players: _take(_skip(testPlayers, 67), 33),
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
          roles: ["Coach"],
          quotes: [],
        },
        {
          battleTag: "ToD#2792",
          race: Race.Human,
          races: [Race.Human],
          roles: ["Caster", "Coach", "French"],
          quotes: [],
        },
      ],
      players: _take(_skip(testPlayers, 25), 33),
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
      players: _take(testPlayers, 33),
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
      players: _take(_skip(testPlayers, 33), 33),
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
          roles: ["Coach", "Bajo Jajo Apprentice"],
        },
        {
          battleTag: "Ember#21963",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
        },
      ],
      players: _take(_skip(testPlayers, 66), 33),
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
          quotes: [],
        },
        {
          battleTag: "EmilyHuttson#1378",
          race: Race.Random,
          races: [Race.Human, Race.Orc, Race.NightElf, Race.Undead],
          roles: ["Coach", "Bajo Jajo Master"],
          quotes: [],
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
      players: _take(_skip(testPlayers, 49), 33),
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
    return (
      t.players?.reduce((s: number, p: any) => {
        const d = p.data;
        return s + ((d?.wins ?? 0) * 3 + (d?.loss ?? 0));
      }, 0) ?? 0
    );
  });
});

const leader = computed(() => {
  const i = points.value.indexOf(Math.max(...points.value));
  return store.data?.teams?.[i];
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
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-sheet
        v-if="!store.initialized"
        class="pa-12"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-h2">
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <hr />
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="8">
            <v-row>
              <v-col cols="4" v-for="_ in _range(0, 6)">
                <v-skeleton-loader type="image" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
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
        class="pa-12"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-h2">
              <span>GNL Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <v-btn
              v-if="true"
              color="success"
              @click="() => store.save(current)"
              >SAVE</v-btn
            >
            <hr />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col cols="8">
            <v-row>
              <v-col v-for="team in store.data?.teams ?? []" cols="4">
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
                          color: leader?.id === team.id ? 'yellow' : 'inherit',
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
          <v-col cols="4">
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
        <v-row>
          <v-col cols="12" class="text-center">
            <div class="text-h3">
              Welcome to the <span class="text-grey">un</span>Official GNL site
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
              store.dates.daysSinceStart / store.dates.durationInDays > 0.05 &&
              store.dates.daysSinceStart / store.dates.durationInDays < 0.9
            "
            icon="mdi-run-fast"
            color="warning"
            size="x-large"
            :style="`width: 0; heigth: 0; position: relative; 
            top: -50px;
              left: calc(${(store.dates.daysSinceStart / store.dates.durationInDays) * 100}%)
              `" />
          <v-col
            cols="12"
            class="text-center"
            v-if="store.dates.daysSinceStart >= 0">
            <div class="text-h4 font-weight-bold">
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
            <div class="text-h4 font-weight-bold">
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
