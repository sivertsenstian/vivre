<script setup lang="ts">
import { Race, creeproutes, raceIcon } from "@/stores/races";
import { useStorage } from "@vueuse/core";

const creepRouteRace: any = {
  [Race.Human]: "Human",
  [Race.Orc]: "Orc",
  [Race.Undead]: "Undead",
  [Race.NightElf]: "Night Elf",
  [Race.Random]: "Random",
};

const open = (path: string) => window.open(path, "_blank");

const raceTab = useStorage("vivre/raceCreepRoutes", Race.Human);

const races = [Race.Human, Race.Orc, Race.NightElf, Race.Undead];

console.log({ creeproutes });
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid>
      <v-sheet class="pa-8" elevation="5">
        <v-row>
          <v-col cols="12">
            <div class="text-h3">Creep Routes</div>
            <hr />
          </v-col>
        </v-row>
        <v-tabs
          fixed-tabs
          v-model="raceTab"
          slider-color="#daa520"
          class="mb-2">
          <v-tab
            class="text-none"
            v-for="race in races"
            :value="race"
            :disabled="[Race.Orc, Race.NightElf].some((v) => v === race)">
            <img
              style="vertical-align: middle"
              width="30px"
              :src="raceIcon[race]" />
            <span
              class="text-subtitle-2 ml-1 font-weight-bold"
              style="vertical-align: middle"
              >{{ creepRouteRace[race] }} - Standard</span
            >
          </v-tab>
        </v-tabs>
        <v-window v-model="raceTab">
          <v-window-item v-for="race in races" :value="race">
            <v-row>
              <v-col cols="12"> </v-col>
              <v-col
                cols="11"
                class="mx-auto"
                v-for="(_, map) in creeproutes[race][0]">
                <v-row>
                  <v-col cols="12"
                    ><div class="text-h6">{{ map }}</div></v-col
                  >
                  <v-col cols="3" class="text-center"
                    >vs.
                    <img
                      style="vertical-align: middle"
                      width="50px"
                      :src="raceIcon[Race.Human]"
                  /></v-col>
                  <v-col cols="3" class="text-center"
                    >vs.
                    <img
                      style="vertical-align: middle"
                      width="50px"
                      :src="raceIcon[Race.Orc]"
                  /></v-col>
                  <v-col cols="3" class="text-center"
                    >vs.
                    <img
                      style="vertical-align: middle"
                      width="50px"
                      :src="raceIcon[Race.Undead]"
                  /></v-col>
                  <v-col cols="3" class="text-center"
                    >vs.
                    <img
                      style="vertical-align: middle"
                      width="50px"
                      :src="raceIcon[Race.NightElf]"
                  /></v-col>
                  <v-col cols="3">
                    <v-row>
                      <v-col cols="12">
                        <img
                          :src="creeproutes[race][Race.Human][map].img"
                          width="100%"
                          style="border: 1px solid white" />
                      </v-col>
                      <v-col cols="12" class="p-0 text-center">
                        <v-btn
                          v-for="(game, i) in creeproutes[race][Race.Human][map]
                            .games"
                          @click="
                            () =>
                              open(`https://www.w3champions.com/match/${game}`)
                          "
                          :text="`Game ${i + 1}`"
                          title="Go to match in w3champions demonstrating this creep route"
                          size="x-small"
                          color="orange"
                          prepend-icon="mdi-link"
                          variant="text" />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="3">
                    <v-row>
                      <v-col cols="12">
                        <img
                          :src="creeproutes[race][Race.Orc][map].img"
                          width="100%"
                          style="border: 1px solid white" />
                      </v-col>
                      <v-col cols="12" class="p-0 text-center">
                        <v-btn
                          v-for="(game, i) in creeproutes[race][Race.Orc][map]
                            .games"
                          @click="
                            () =>
                              open(`https://www.w3champions.com/match/${game}`)
                          "
                          :text="`Game ${i + 1}`"
                          title="Go to match in w3champions demonstrating this creep route"
                          size="x-small"
                          color="orange"
                          prepend-icon="mdi-link"
                          variant="text" />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="3">
                    <v-row>
                      <v-col cols="12">
                        <img
                          :src="creeproutes[race][Race.Undead][map].img"
                          width="100%"
                          style="border: 1px solid white"
                      /></v-col>

                      <v-col cols="12" class="p-0 text-center">
                        <v-btn
                          v-for="(game, i) in creeproutes[race][Race.Undead][
                            map
                          ].games"
                          @click="
                            () =>
                              open(`https://www.w3champions.com/match/${game}`)
                          "
                          :text="`Game ${i + 1}`"
                          title="Go to match in w3champions demonstrating this creep route"
                          size="x-small"
                          color="orange"
                          prepend-icon="mdi-link"
                          variant="text" />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="3">
                    <v-row>
                      <v-col cols="12">
                        <img
                          :src="creeproutes[race][Race.NightElf][map].img"
                          :alt="`Creep Route: ${race}//${map}`"
                          width="100%"
                          style="border: 1px solid white" />
                      </v-col>
                      <v-col cols="12" class="p-0 text-center">
                        <v-btn
                          v-for="(game, i) in creeproutes[race][Race.NightElf][
                            map
                          ].games"
                          @click="
                            () =>
                              open(`https://www.w3champions.com/match/${game}`)
                          "
                          :text="`Game ${i + 1}`"
                          title="Go to match in w3champions demonstrating this creep route"
                          size="x-small"
                          color="orange"
                          prepend-icon="mdi-link"
                          variant="text" />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-sheet>
    </v-container>
  </main>
</template>
