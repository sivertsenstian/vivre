<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, onMounted } from "vue";
import { teamKLIndexBanner, useKreisLigaStore } from "@/stores/kreisliga.ts";
import { Race } from "@/stores/races";
import VueCountdown from "@chenfengyuan/vue-countdown";
import kreis_logo from "@/assets/kreisliga/logo_Kreisliga.png";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const router = useRouter();
const store = useKreisLigaStore();

const current = {
  id: uuidv4(),
  created: moment().toDate(),
  updated: moment().toDate(),
  season: 5,
  start: "31.03.2025",
  end: "22.06.2025",
  teams: [
    {
      id: "vashjsvipers",
      name: "Vashj's Vipers",
      prefix: "",
      coaches: [
        {
          battleTag: "Quikeet#21349",
          race: Race.NightElf,
          races: [Race.NightElf, Race.Orc],
          roles: ["Coach", "Player"],
          quotes: ["Lieber widerlich als wieder nicht"],
        },
        {
          battleTag: "Exiled#21153",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Manager", "Tactical Genius"],
          quotes: [
            "Flutschi ist immer verletzt. Was erlaube Flutschi? Ich habe fertig",
          ],
        },
      ],
      players: [
        {
          battleTag: "Exiled#21153",
          race: 8,
        },
        {
          battleTag: "FlutshfinGER#21396",
          race: 1,
        },
        {
          battleTag: "quadgfan#1418",
          race: 2,
        },
        {
          battleTag: "Quikeet#21349",
          race: 4,
        },
        {
          battleTag: "Mataratzi#2446",
          race: 4,
        },
        {
          battleTag: "Coltaine#2624",
          race: 1,
        },
        {
          battleTag: "huRRicane90#21759",
          race: 2,
        },
        {
          battleTag: "stockhuebsch#2424",
          race: 2,
        },
        {
          battleTag: "Domi#22759",
          race: 2,
        },
        {
          battleTag: "Westii#21756",
          race: 8,
        },
      ],
    },
    {
      id: "azerothtitans",
      name: "Azeroth Titans",
      prefix: "",
      coaches: [
        {
          battleTag: "sp4rta#21828",
          race: Race.Undead,
          races: [Race.Undead],
          roles: ["Streamer", "Manager", "Beefcake"],
          quotes: ["Danke danke Danköööö"],
        },
      ],
      players: [
        {
          battleTag: "ThaGrinchy31#1490",
          race: 4,
        },
        {
          battleTag: "Cien#2931",
          race: 2,
        },
        {
          battleTag: "Eiklur#2765",
          race: 8,
        },
        {
          battleTag: "Tarmok#2559",
          race: 2,
        },
        {
          battleTag: "Maxim#25843",
          race: 4,
        },
        {
          battleTag: "Isekje#2550",
          race: 1,
        },
        {
          battleTag: "pleschwond#2931",
          race: 0,
        },
        {
          battleTag: "sp4rta#21828",
          race: 8,
        },
        {
          battleTag: "Haru#22993",
          race: 8,
        },
      ],
    },
    {
      id: "pandarens",
      name: "Pandarens",
      prefix: "",
      coaches: [
        {
          battleTag: "RobotNinja#2136641",
          race: Race.Human,
          races: [Race.Human, Race.Orc, Race.NightElf],
          roles: ["Coach", "Manager", "Streamer"],
          quotes: ["Orc IMBA. And Elf IMBA too!"],
        },
      ],
      players: [
        {
          battleTag: "RobotNinja#2136641",
          race: 1,
        },
        {
          battleTag: "Physix#21205",
          race: 1,
        },
        {
          battleTag: "drawkao#2342",
          race: 0,
        },
        {
          battleTag: "ThreeWayKay#2610",
          race: 1,
        },
        {
          battleTag: "Blackrayman#2399",
          race: 8,
        },
        {
          battleTag: "onidemoni#2572",
          race: 2,
        },
        {
          battleTag: "Ultrapro#2880",
          race: 8,
        },
        {
          battleTag: "cedde#2548",
          race: 4,
        },
        {
          battleTag: "KäferLukas#2748",
          race: 1,
        },
        {
          battleTag: "Suko#21747",
          race: 4,
        },
      ],
    },
    {
      id: "stormwindkickerz",
      name: "Stormwind Kickerz",
      prefix: "",
      coaches: [
        {
          battleTag: "WhiteFang28#2496",
          race: Race.Human,
          races: [Race.Human],
          roles: ["Coach", "Manager", "Streamer"],
          quotes: ["My enemies are many, my equals are none"],
        },
      ],
      players: [
        {
          battleTag: "WhiteFang28#2496",
          race: 1,
        },
        {
          battleTag: "KaGeMaN#1160",
          race: 1,
        },
        {
          battleTag: "SOULKEEPA#21303",
          race: 2,
        },
        {
          battleTag: "Knuffy#21436",
          race: 0,
        },
        {
          battleTag: "AntiLucker#2301",
          race: 2,
        },
        {
          battleTag: "Spray4fun#2803",
          race: 1,
        },
        {
          battleTag: "Dekker#2290",
          race: 8,
        },
        {
          battleTag: "donnerdaumen#1743",
          race: 4,
        },
        {
          battleTag: "kms3d#2526",
          race: 0,
        },
        {
          battleTag: "Rangold#2541",
          race: 1,
        },
        {
          battleTag: "wolke#21320",
          race: 1,
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
      suggestedMax: 12000,
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
  This page is a support tool to help motivate all the KREIS LIGA participants and teams to practice on the [w3c ladder](https://w3champions.com/) in between official games.
  If you are on a team, you can contribute to make sure that **your** team wins the Liga Ladder race!

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
      <v-btn v-if="false" color="success" @click="() => store.save(current)"
        >SAVE</v-btn
      >
      <v-sheet
        v-if="_isEmpty(store.data)"
        class="pa-md-12 pa-3"
        elevation="10"
        transition="fade-transition"
        style="min-height: 90vh">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-md-h2 text-h5">
              <span>Kreis Liga Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <hr />
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="12" md="7">
            <v-row>
              <v-col cols="6" md="6" v-for="_ in _range(0, 4)">
                <v-skeleton-loader type="image" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="5">
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
              <span>Kreis Liga Season {{ store.data?.season }}</span>
              <span class="text-grey mx-2">//</span>
              <span class="text-secondary">Overview</span>
            </div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col cols="12" md="8">
            <v-row>
              <v-col v-for="team in store.data?.teams ?? []" cols="6" md="6">
                <v-card
                  :class="`team ${leader?.id === team.id ? 'gold' : ''}`"
                  @click="() => router.push(`/kreisliga/${team.id}`)">
                  <v-img
                    :aspect-ratio="1"
                    :src="teamKLIndexBanner(team.id)"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="225px"
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
                    backgroundColor: 'rgba(218, 165, 32, 0.4)',
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
            <span v-if="store.dates.timeRemaining > 0" class="mr-auto"
              >Kreis Liga Ladder Games Played So Far!</span
            >
            <span v-else class="mr-auto"
              >Kreis Liga Ladder Games Were Played This Season!</span
            >
          </v-col></v-row
        >

        <v-row>
          <v-col
            cols="12"
            class="d-flex align-center"
            v-if="store.dates.timeRemaining > 0">
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
                store.dates.durationInDays - (store.dates.daysSinceStart - 1) <=
                0
                  ? 'success'
                  : 'warning'
              "
              :model-value="store.dates.daysSinceStart - 1"
              :max="store.dates.durationInDays"
              :height="45">
              <strong v-if="store.dates.daysSinceStart >= 0"
                >{{
                  Math.max(
                    0,
                    _round(
                      ((store.dates.daysSinceStart - 1) /
                        store.dates.durationInDays) *
                        100,
                    ),
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
              (store.dates.daysSinceStart - 1) / store.dates.durationInDays >
                0.01 &&
              (store.dates.daysSinceStart - 1) / store.dates.durationInDays <
                0.9
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
            v-if="
              store.dates.daysSinceStart > 0 && store.dates.timeRemaining > 0
            ">
            <div class="text-md-h4 text-h5 font-weight-bold">
              <span>
                <vue-countdown
                  :time="store.dates.timeRemaining"
                  v-slot="{ days, hours, minutes, seconds }">
                  {{ days }} day(s), {{ hours }} hour(s),
                  {{ minutes }} minute(s), {{ seconds }} second(s) left of the
                  league!
                </vue-countdown>
              </span>
              <span class="px-2">-</span>
              <span>Let's Go!</span>
            </div>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
            v-if="store.dates.daysSinceStart <= 0">
            <div class="text-md-h4 text-h5 font-weight-bold">
              <span
                >{{ Math.abs(store.dates.daysSinceStart - 1) }} day(s) until we
                roll</span
              >
              <span class="px-2">-</span>
              <span>HYPE!</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="text-center">
            <markdown-viewer v-model="model" />
          </v-col>
          <v-col cols="2" class="d-flex">
            <v-img class="my-auto" width="100%" :src="kreis_logo" />
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
