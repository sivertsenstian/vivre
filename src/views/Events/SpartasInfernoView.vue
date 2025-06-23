<script setup lang="ts">
import logo from "@/assets/events/spartas_inferno.jpg";

import VersusBanner from "@/components/events/spartasinferno/SpartasInfernoVersusBanner.vue";
import VersusChallenger from "@/components/events/spartasinferno/SpartasInfernoVersusChallenger.vue";
import { onMounted, onUnmounted, ref } from "vue";
import moment from "moment/moment";
import { useSpartasInfernoStore } from "@/stores/spartasinferno.ts";
import { v4 as uuidv4 } from "uuid";
import _orderBy from "lodash/orderBy";
import MarkdownViewer from "@/components/MarkdownViewer.vue";

const store = useSpartasInfernoStore();

const model = defineModel<string>({
  default: `
  ### DACH Ladder Challenge - hosted by Sp4rta // https://www.twitch.tv/sp4rta
  **DATE : 23.06.2025 - 23.07.2025**

  ### RULES:
  Every played game (2 minutes min) will add points to your score .
  Wins = 3 points, Losses = 1 point
  Points are earned with the race you chose in 1on1 mode .

  ### PRIZE
  You can win a unique w3c profile picture if you make it to the top 3.
  If you manage to do at least 20 games in the challenge you are part of the HOLY Giveaway ( Bubblegum Butterfly Tube worth 40€) .

  ### Good luck and let the grind begin!
  `,
});

const current = {
  id: uuidv4(),
  created: moment().toDate(),
  updated: moment().toDate(),
  season: 22,
  start: "23.06.2025",
  end: "23.07.2025",
  players: [
    {
      battleTag: "sp4rta#21828",
      race: 2,
    },
    {
      battleTag: "scimitar#22984",
      race: 1,
    },
    {
      battleTag: "schoschile#2595",
      race: 2,
    },
    {
      battleTag: "Exiled#21153",
      race: 8,
    },
    {
      battleTag: "SOULKEEPA#21303",
      race: 2,
    },
    {
      battleTag: "Horst#22597",
      race: 8,
    },
    {
      battleTag: "mo2l#2314",
      race: 4,
    },
    {
      battleTag: "Isekje#2550",
      race: 1,
    },
    {
      battleTag: "Eightyfour#21528",
      race: 8,
    },
    {
      battleTag: "F1nroD#21331",
      race: 8,
    },
    {
      battleTag: "Beijing#21618",
      race: 2,
    },
    {
      battleTag: "bearmacht#2161",
      race: 4,
    },
    {
      battleTag: "Käferlukas#2748",
      race: 1,
    },
    {
      battleTag: "Chomper#21102",
      race: 0,
    },
    {
      battleTag: "Pleschwond#2931",
      race: 0,
    },
    {
      battleTag: "Dekker#2290",
      race: 8,
    },
    {
      battleTag: "bigmurphy#2467",
      race: 8,
    },
    {
      battleTag: "HammBamm#21856",
      race: 1,
    },
    {
      battleTag: "Mataratzi#2446",
      race: 4,
    },
    {
      battleTag: "Kaef3r#2149",
      race: 2,
    },
    {
      battleTag: "RobotNinja#2136641",
      race: 1,
    },
    {
      battleTag: "xardas#2606",
      race: 1,
    },
    {
      battleTag: "Knuffy#21436",
      race: 0,
    },
    {
      battleTag: "Suko#21747",
      race: 4,
    },
    {
      battleTag: "Ultrapro#2880",
      race: 0,
    },
    {
      battleTag: "Moissan#21859",
      race: 8,
    },
    {
      battleTag: "Ripley#21126",
      race: 1,
    },
    {
      battleTag: "SushiCore#2867",
      race: 2,
    },
    {
      battleTag: "Blackrayman#2399",
      race: 8,
    },
    {
      battleTag: "Mueller#2503",
      race: 4,
    },
    {
      battleTag: "Pandabaernd#2818",
      race: 2,
    },
    {
      battleTag: "corrayo#2330",
      race: 2,
    },
    {
      battleTag: "Stormwhiler#2805",
      race: 2,
    },
    {
      battleTag: "Clo8#2442",
      race: 4,
    },
    {
      battleTag: "Animosity#11979",
      race: 8,
    },
    {
      battleTag: "Archeagle16#2463",
      race: 1,
    },
    {
      battleTag: "pisch4r#2950",
      race: 4,
    },
    {
      battleTag: "Reso#21165",
      race: 1,
    },
  ],
};

// const winner = computed(() => {
//   if (store.initialized) {
//     let points: any[] = [];
//     for (const challenger of store.ladder.filter((v) => !_isNil(v))) {
//       points.push({
//         id: challenger,
//         points: getPoints("mmr", store.challengers[challenger]),
//       });
//     }
//
//     return _sortBy(points, "points").reverse()?.[0]?.id;
//   }
//   return null;
// });

// Goal
const winnersubscription = ref();
const explode = ref(true);
const showWinner = ref(false);

onMounted(() => {
  winnersubscription.value = setInterval(() => {
    explode.value = !explode.value;
    showWinner.value =
      store.initialized &&
      store.tournamentStart.utc().diff(moment().utc(), "milliseconds") <= 0;
  }, 2000);

  store.subscribe();
});

onUnmounted(() => {
  clearInterval(winnersubscription.value);
  store.unsubscribe();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-btn v-if="false" color="success" @click="() => store.save(current)"
        >SAVE</v-btn
      >
      <v-sheet class="pa-6" elevation="10">
        <v-row>
          <v-col cols="12" class="text-center ma-0 pa-0">
            <v-img
              :src="logo"
              style="border: 1px solid darkgoldenrod"
              rounded="pill"
              alt="SPARTAS W3C LADDER RACE"
              class="mx-auto"
              max-width="1200px" />
            <div>
              <markdown-viewer v-model="model" />
            </div>
          </v-col>
          <v-col cols="12" class="text-left">
            <h3 class="py-2 whitespace-wrap">
              If you are enjoying this ladder event, please consider sponsoring
              my next coffee!
            </h3>
            <a href="https://www.buymeacoffee.com/longjacket" target="_blank"
              ><img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=longjacket&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff"
            /></a>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet class="pa-4 pb-10" :elevation="5">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
            v-for="(challenger, i) in _orderBy<any>(
              store.data.players,
              'totalPoints',
              'desc',
            )">
            <versus-banner
              v-if="challenger.data"
              :player="challenger.data.player"
              :season-start="store.dates.start"
              :dates="store.dates"
              highlight="points"
              :rank="i" />
            <versus-challenger
              v-else
              :battle-tag="challenger.battleTag"
              :race="challenger.race"
              loading />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
