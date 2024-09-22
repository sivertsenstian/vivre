<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";
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
  start: "01.09.2024",
  end: "01.10.2024",
  teams: [
    {
      id: "chinesepaladin",
      name: "Chinese Paldin",
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
          roles: ["Coach", "Bajo Jajo"],
          quotes: [],
        },
        {
          battleTag: "jolin#31419",
          race: Race.NightElf,
          races: [Race.NightElf],
          roles: ["Coach", "Jabba"],
          quotes: [],
        },
      ],
      players: [
        { battleTag: "RaZeR#23389", race: Race.Undead },
        { battleTag: "sd1528681#2302", race: Race.NightElf },
        { battleTag: "ET3#31514", race: Race.Human },
        { battleTag: "vscan#3284", race: Race.Orc },
      ],
    },
    {
      id: "rageandape",
      name: "Rage & Ape: Attorneys at War",
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
          roles: ["Caster", "Coach"],
          quotes: [],
        },
      ],
      players: [
        { battleTag: "K0rbinian#21728", race: Race.Human },
        { battleTag: "sd1528681#2302", race: Race.NightElf },
        { battleTag: "ET3#31514", race: Race.Human },
        { battleTag: "vscan#3284", race: Race.Orc },
      ],
    },
    {
      id: "apelords",
      name: "Apelords",
      coaches: [
        {
          battleTag: "SaulApeMan#2163",
          race: Race.Random,
          races: [Race.Human, Race.Undead, Race.Orc, Race.NightElf],
          roles: ["Caster", "Coach", "Ape"],
          quotes: ["Makrura for you!", "Ladies and Gentlemen, welcome to GNL!"],
        },
        {
          battleTag: "spycreed#2536",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
        },
      ],
      players: [
        { battleTag: "Longjacket#2840", race: Race.Human },
        { battleTag: "RaZeR#23389", race: Race.Undead },
        { battleTag: "hengyi#31966", race: Race.Human },
        { battleTag: "hengyi#31966", race: Race.Human },
      ],
    },
    {
      id: "thebananapickers",
      name: "The Banana Pickers",
      coaches: [
        {
          battleTag: "gotquail#1103",
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
        { battleTag: "Longjacket#2840", race: Race.Human },
        { battleTag: "SneakyTurtle#2326919", race: Race.NightElf },
        { battleTag: "siyanleo#1295", race: Race.Orc },
        { battleTag: "FVB#1736", race: Race.Orc },
      ],
    },
    {
      id: "gigglinggoblins",
      name: "Giggling Goblins",
      coaches: [
        {
          battleTag: "NorthDrakkar#1745",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
        },
        {
          battleTag: "Ember#21963",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Coach"],
        },
      ],
      players: [
        { battleTag: "siyanleo#1295", race: Race.Orc },
        { battleTag: "jung#31458", race: Race.Human },
        { battleTag: "K0rbinian#21728", race: Race.Human },
        { battleTag: "sd1528681#2302", race: Race.NightElf },
      ],
    },
    {
      id: "gnlbears",
      name: "GNL Bears",
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
      players: [
        { battleTag: "ET3#31514", race: Race.Human },
        { battleTag: "vscan#3284", race: Race.Orc },
        { battleTag: "Longjacket#2840", race: Race.Human },
        { battleTag: "SneakyTurtle#2326919", race: Race.NightElf },
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
  if (_isEmpty(store.allData)) {
    return [];
  }
  return store.allData.map((t: any) => {
    return t.data.reduce((s: number, p: any) => {
      const d = p.season[p.race];
      return s + ((d?.wins ?? 0) * 3 + (d?.loss ?? 0));
    }, 0);
  });
});

const leader = computed(() => {
  const i = points.value.indexOf(Math.max(...points.value));
  return store.allData?.[i];
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
              <span>GNL Season {{ store.gnlData?.season }}</span>
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
              <span>GNL Season {{ store.gnlData?.season }}</span>
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
              <v-col v-for="team in store.gnlData.teams" cols="4">
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
                labels: _isEmpty(store.allData)
                  ? []
                  : store.allData?.map((t: any) => t.name),
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
