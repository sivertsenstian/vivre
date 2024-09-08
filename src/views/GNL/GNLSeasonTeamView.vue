<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";
import { createGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";
import ActivityTable from "@/components/ActivityTable.vue";
import GNLPlayerBanner from "@/components/gnl/GNLPLayerBanner.vue";
import GNLCoachBanner from "@/components/gnl/GNLCoachBanner.vue";
import _isEmpty from "lodash/isEmpty";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const route = useRoute();
const router = useRouter();


const teams = {
  'apelords': {
    'coaches': [{ battleTag: "SaulApeMan#2163", race: Race.Undead }],
    'players': [{ battleTag: "Longjacket#2840", race: Race.Human },
      { battleTag: "SneakyTurtle#2326919", race: Race.NightElf },
      { battleTag: "siyanleo#1295", race: Race.Orc },
      { battleTag: "FVB#1736", race: Race.Orc },
      { battleTag: "RaZeR#23389", race: Race.Undead },
      { battleTag: "hengyi#31966", race: Race.Human },
      { battleTag: "Stakr#21386", race: Race.NightElf },
      { battleTag: "jung#31458", race: Race.Human },
      { battleTag: "Lonestar#1441", race: Race.Orc },
      { battleTag: "K0rbinian#21728", race: Race.Human },
      { battleTag: "sd1528681#2302", race: Race.NightElf },
      { battleTag: "ET3#31514", race: Race.Human },
      { battleTag: "vscan#3284", race: Race.Orc }],
  },
  'thebananapickers': {
    'coaches': [{ battleTag: "gotQuail#1103", race: Race.Human }],
    'players': [{ battleTag: "Longjacket#2840", race: Race.Human },
      { battleTag: "SneakyTurtle#2326919", race: Race.NightElf },
      { battleTag: "siyanleo#1295", race: Race.Orc },
      { battleTag: "FVB#1736", race: Race.Orc },
      { battleTag: "RaZeR#23389", race: Race.Undead },
      { battleTag: "hengyi#31966", race: Race.Human },
      { battleTag: "Stakr#21386", race: Race.NightElf },
      { battleTag: "jung#31458", race: Race.Human },
      { battleTag: "Lonestar#1441", race: Race.Orc },
      { battleTag: "K0rbinian#21728", race: Race.Human },
      { battleTag: "sd1528681#2302", race: Race.NightElf },
      { battleTag: "ET3#31514", race: Race.Human },
      { battleTag: "vscan#3284", race: Race.Orc }],
  },
  'gigglinggoblins': {
    'coaches': [{ battleTag: "Barren#1153", race: Race.Undead }],
    'players': [{ battleTag: "Longjacket#2840", race: Race.Human },
      { battleTag: "SneakyTurtle#2326919", race: Race.NightElf },
      { battleTag: "siyanleo#1295", race: Race.Orc },
      { battleTag: "FVB#1736", race: Race.Orc },
      { battleTag: "RaZeR#23389", race: Race.Undead },
      { battleTag: "hengyi#31966", race: Race.Human },
      { battleTag: "Stakr#21386", race: Race.NightElf },
      { battleTag: "jung#31458", race: Race.Human },
      { battleTag: "Lonestar#1441", race: Race.Orc },
      { battleTag: "K0rbinian#21728", race: Race.Human },
      { battleTag: "sd1528681#2302", race: Race.NightElf },
      { battleTag: "ET3#31514", race: Race.Human },
      { battleTag: "vscan#3284", race: Race.Orc }],
  }
}

let store = null;

onBeforeRouteUpdate((to) => {
  
  console.log({to});
  const team = String(to.params.team).toLowerCase();
  console.log("CREATING TEAM " + team)
  
  const useGNLStore = createGNLStore(15, teams[team].coaches, teams[team].players )
  store = useGNLStore();
})

</script>
<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <pre>{{store}}</pre>
      <v-sheet
        class="pa-8"
        elevation="10"
        style="min-height: 90vh"
        v-if="!_isEmpty(store?.data)">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-h2">GNL Season {{ store.season }}</div> </v-col>
        </v-row>
        <v-row>
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Coaches</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3" v-for="coach in store.coaches">
            <GNLCoachBanner
              :data="store.data[coach.battleTag].season[coach.race]"
              :battle-tag="coach.battleTag"
              :race="coach.race"
              :current="
                store.data[coach.battleTag].season[coach.race].mmr.current
              "
              :label="coach.battleTag" />
          </v-col>
        </v-row>
        <v-row>
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Players</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3" v-for="player in store.players">
            <GNLPlayerBanner
              :data="store.data[player.battleTag].season[player.race]"
              :battle-tag="player.battleTag"
              :race="player.race"
              :current="
                store.data[player.battleTag].season[player.race].mmr.current
              "
              :label="player.battleTag" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ActivityTable
              :matches="
                store.data?.['SaulApeMan#2163']?.season[Race.Undead].matches
              "
              :dark="isDark" />
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
