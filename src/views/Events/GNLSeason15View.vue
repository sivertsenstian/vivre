<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed } from "vue";
import { createGNLStore } from "@/stores/gnl";
import { Race } from "@/stores/races";
import ActivityTable from "@/components/ActivityTable.vue";
import GNLBanner from "@/components/gnl/GNLBanner.vue";
import _isEmpty from "lodash/isEmpty";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const useGNLStore = createGNLStore(
  15,
  [
    { battleTag: "SaulApeMan#2163", race: Race.Undead },
    { battleTag: "Barren#1153", race: Race.Undead },
    { battleTag: "gotQuail#1103", race: Race.Human },
  ],
  [
    { battleTag: "Longjacket#2840", race: Race.Human },
    { battleTag: "NiteKat#1209", race: Race.NightElf },
    // { battleTag: "BigBwana#11605", race: Race.Undead },
    // { battleTag: "Dzdrprm#2997", race: Race.Orc },
    { battleTag: "RaZeR#23389", race: Race.Undead },
    // { battleTag: "BFR#11734", race: Race.Orc },
    // { battleTag: "pischner#2950", race: Race.NightElf },
    // { battleTag: "Disproved#21742", race: Race.Undead },
    // { battleTag: "ffm#2836", race: Race.Human },
    { battleTag: "veS#1614", race: Race.Undead },
  ],
);
const store = useGNLStore();
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 1">
      <v-sheet
        class="pa-8"
        elevation="10"
        style="min-height: 90vh"
        v-if="!_isEmpty(store.data)">
        <v-row>
          <v-col cols="12" class="text-center"
            ><div class="text-h2">GNL Season {{ store.season }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col offset="4" cols="4" class="text-center">
            <div class="text-h4">Coaches</div>
            <hr />
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3" v-for="coach in store.coaches">
            <GNLBanner
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
            <GNLBanner
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
