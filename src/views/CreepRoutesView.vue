<script setup lang="ts">
import { Race, creeproutes, raceIcon, raceName } from "@/stores/races";

const open = (path: string) => window.open(path, "_blank");
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
        <v-row v-for="(v, player) in creeproutes">
          <v-col cols="12">
            <img
              style="vertical-align: middle"
              width="75px"
              :src="raceIcon[player]"
            />
            <span class="text-h4 ml-1" style="vertical-align: middle"
              >{{ raceName[player] }} - Standard</span
            >
          </v-col>
          <v-col cols="11" class="mx-auto" v-for="(_, map) in v[0]">
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
              <v-col cols="3"
                ><img
                  :src="creeproutes[player][Race.Human][map].img"
                  width="100%"
                  style="border: 1px solid white"
              /></v-col>
              <v-col cols="3"
                ><img
                  :src="creeproutes[player][Race.Orc][map].img"
                  width="100%"
                  style="border: 1px solid white"
              /></v-col>
              <v-col cols="3"
                ><img
                  :src="creeproutes[player][Race.Undead][map].img"
                  width="100%"
                  style="border: 1px solid white"
              /></v-col>
              <v-col cols="3">
                <v-row>
                  <v-col cols="12">
                    <img
                      :src="creeproutes[player][Race.NightElf][map].img"
                      width="100%"
                      style="border: 1px solid white"
                    />
                  </v-col>
                  <v-col cols="12" class="p-0 text-center">
                    <v-btn
                      v-for="(game, i) in creeproutes[player][Race.NightElf][
                        map
                      ].games"
                      @click="
                        () => open(`https://www.w3champions.com/match/${game}`)
                      "
                      :text="`Game ${i + 1}`"
                      title="Go to match in w3champions demonstrating this creep route"
                      size="x-small"
                      color="orange"
                      prepend-icon="mdi-link"
                      variant="text"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
