<script setup lang="ts">
import cr_missing from "@/assets/creeproutes/missing.png";
import {
  Race,
  creeproutes,
  raceIcon,
  CreepRouteCategory,
  category,
} from "@/stores/races";
import { useStorage } from "@vueuse/core";
import _isNil from "lodash/isNil";
import MapLink from "@/components/MapLink.vue";
import _isEmpty from "lodash/isEmpty";

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

const getRoute = (
  race: Race,
  category: CreepRouteCategory,
  opponent: Race,
  map: any,
) => {
  const r = creeproutes[race][category]?.[opponent][map];
  if (_isNil(r.img) || r.img.includes("missing")) {
    return creeproutes[race][CreepRouteCategory.Beginner]?.[Race.Random][map];
  }

  return r;
};
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
          <v-tab class="text-none" v-for="race in races" :value="race">
            <img
              style="vertical-align: middle"
              width="30px"
              :src="raceIcon[race]" />
            <span
              class="text-subtitle-2 ml-1 font-weight-bold"
              style="vertical-align: middle"
              >{{ creepRouteRace[race] }}</span
            >
          </v-tab>
        </v-tabs>
        <v-window v-model="raceTab">
          <v-window-item v-for="race in races" :value="race">
            <v-row>
              <v-col cols="12" class="text-center">
                <v-radio-group
                  class="d-flex justify-center"
                  inline
                  v-model="category"
                  label="Select creep route category. Standard is current meta, but might include more advanced creeping techniques!">
                  <v-radio
                    v-for="(k, v) in Object.keys(CreepRouteCategory).filter(
                      (x) => isNaN(Number(x)),
                    )"
                    :color="
                      _isEmpty(creeproutes[race][v]) ? 'disabled' : 'secondary'
                    "
                    :label="k"
                    :value="v"
                    density="comfortable" />
                </v-radio-group>
              </v-col>
              <v-col
                cols="12"
                md="11"
                class="mx-auto"
                style="min-height: 50vh"
                v-if="_isEmpty(creeproutes[race][category])">
                <v-row>
                  <v-col cols="12" class="text-center mt-5">
                    <img
                      :src="cr_missing"
                      width="300"
                      style="border: 1px solid white" />
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <h2 style="color: goldenrod; white-space: pre-line">
                      {{ CreepRouteCategory[category] }} creep routes for
                      {{ creepRouteRace[race] }} is currently being worked on!
                      Check out the beginner routes to get started, or tune in
                      later!
                    </h2>
                    <h3>
                      If you want to help: please contact @Longjacket on
                      <a href="https://discord.gg/uJmQxG2" target="_blank"
                        >w3champions</a
                      >
                      or
                      <a
                        href="https://discord.com/invite/7HUyQAKQ8p"
                        target="_blank"
                        >wc3 gym</a
                      >
                      discords!
                    </h3>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-else
                cols="12"
                md="11"
                class="mx-auto"
                v-for="(_, map) in creeproutes[race][category][Race.Random]">
                <v-row>
                  <v-col cols="12"
                    ><div class="text-h6"><map-link :name="map" /></div
                  ></v-col>
                  <v-col cols="12">
                    <v-row
                      v-if="
                        Object.keys(creeproutes[race][category]).length > 1
                      ">
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
                    </v-row>
                    <v-row v-else>
                      <v-col cols="12" class="text-center"
                        >vs.
                        <img
                          style="vertical-align: middle"
                          width="50px"
                          :src="raceIcon[Race.Random]"
                      /></v-col>
                    </v-row>
                  </v-col>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      offset-md="4"
                      class="text-center"
                      v-if="
                        Object.keys(creeproutes[race][category]).length === 1 &&
                        creeproutes[race]?.[category]?.[Race.Random]
                      ">
                      <v-row>
                        <v-col cols="12">
                          <img
                            :src="
                              creeproutes[race][category][Race.Random][map].img
                            "
                            width="100%"
                            style="border: 1px solid white" />
                        </v-col>
                        <v-col cols="12" class="p-0 text-center">
                          <v-btn
                            v-for="(game, i) in creeproutes[race][category][
                              Race.Random
                            ][map].games"
                            @click="
                              () =>
                                open(
                                  `https://www.w3champions.com/match/${game}`,
                                )
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
                    <v-col
                      cols="12"
                      md="3"
                      v-if="creeproutes[race]?.[category]?.[Race.Human]">
                      <v-row>
                        <v-col cols="12">
                          <img
                            :src="
                              getRoute(race, category, Race.Human, map)?.img
                            "
                            width="100%"
                            style="border: 1px solid white" />
                        </v-col>
                        <v-col cols="12" class="p-0 text-center">
                          <v-btn
                            v-for="(game, i) in getRoute(
                              race,
                              category,
                              Race.Human,
                              map,
                            ).games"
                            @click="
                              () =>
                                open(
                                  `https://www.w3champions.com/match/${game}`,
                                )
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
                    <v-col
                      cols="12"
                      md="3"
                      v-if="creeproutes[race]?.[category]?.[Race.Orc]">
                      <v-row>
                        <v-col cols="12">
                          <img
                            :src="getRoute(race, category, Race.Orc, map)?.img"
                            width="100%"
                            style="border: 1px solid white" />
                        </v-col>
                        <v-col cols="12" class="p-0 text-center">
                          <v-btn
                            v-for="(game, i) in getRoute(
                              race,
                              category,
                              Race.Orc,
                              map,
                            ).games"
                            @click="
                              () =>
                                open(
                                  `https://www.w3champions.com/match/${game}`,
                                )
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
                    <v-col
                      cols="12"
                      md="3"
                      v-if="creeproutes[race]?.[category]?.[Race.Undead]">
                      <v-row>
                        <v-col cols="12">
                          <img
                            :src="
                              getRoute(race, category, Race.Undead, map)?.img
                            "
                            width="100%"
                            style="border: 1px solid white"
                        /></v-col>

                        <v-col cols="12" class="p-0 text-center">
                          <v-btn
                            v-for="(game, i) in getRoute(
                              race,
                              category,
                              Race.Undead,
                              map,
                            ).games"
                            @click="
                              () =>
                                open(
                                  `https://www.w3champions.com/match/${game}`,
                                )
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
                    <v-col
                      cols="12"
                      md="3"
                      v-if="creeproutes[race]?.[category]?.[Race.NightElf]">
                      <v-row>
                        <v-col cols="12">
                          <img
                            :src="
                              getRoute(race, category, Race.NightElf, map)?.img
                            "
                            :alt="`Creep Route: ${race}//${map}`"
                            width="100%"
                            style="border: 1px solid white" />
                        </v-col>
                        <v-col cols="12" class="p-0 text-center">
                          <v-btn
                            v-for="(game, i) in getRoute(
                              race,
                              category,
                              Race.NightElf,
                              map,
                            ).games"
                            @click="
                              () =>
                                open(
                                  `https://www.w3champions.com/match/${game}`,
                                )
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
                </v-row>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-sheet>
    </v-container>
  </main>
</template>

<style>
div.v-selection-control-group.v-selection-control-group--inline {
  justify-content: center;
}
</style>
