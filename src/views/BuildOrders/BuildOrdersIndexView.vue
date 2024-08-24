<script setup lang="ts">
import moment from "moment";
import { useBuildsStore } from "@/stores/builds";
import { raceName, raceIcon, Race } from "@/stores/races";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

const builds = useBuildsStore();
const router = useRouter();

const races = [Race.Random, Race.Human, Race.Orc, Race.NightElf, Race.Undead];

// Render helpers
const getRating = (stars: number) => {
  if (stars < 0) return "red";
  else if (stars < 10) return "orange";
  else return "green";
};

const player = ref(Race.Random);
const opponent = ref(Race.Random);

const items = computed(() => {
  let result = builds.buildorders;

  if (player.value > 0) {
    result = builds.buildorders.filter((b) => b.player === player.value);
  }

  if (opponent.value > 0) {
    result = builds.buildorders.filter((b) => b.opponent === opponent.value);
  }

  return result;
});
</script>

<template>
  <main>
    <v-container fluid>
      <v-sheet class="pa-8" elevation="5" style="min-height: 90vh">
        <v-container>
          <v-row
            ><v-col cols="12" class="mt-5">
              <v-row>
                <v-col cols="8">
                  <div class="text-h5 font-weight-bold">
                    Warcraft 3 Build Orders
                  </div>
                </v-col>
                <v-col cols="4" class="text-right">
                  <v-btn
                    color="primary"
                    variant="tonal"
                    @click="() => router.push('/buildorders/new')"
                    >Create Build Order</v-btn
                  >
                </v-col>
              </v-row>
              <div class="text-subtitle-2 font-weight-bold mt-6 mb-2">
                Matchup: {{ raceName[player] }} vs. {{ raceName[opponent] }}
              </div>
              <v-btn-toggle rounded="0" variant="plain">
                <v-btn
                  v-for="race in races"
                  :title="raceName[race]"
                  compact
                  size="small"
                  :active="false"
                  :variant="player === race ? 'text' : 'plain'"
                  :style="{
                    padding: 0,
                  }"
                  @click="
                    () =>
                      player === race ? (player = Race.Random) : (player = race)
                  "
                >
                  <img
                    :src="raceIcon[race]"
                    :width="player === race ? '45px' : '35px'"
                  />
                </v-btn>
              </v-btn-toggle>
              <span class="text-overline font-weight-bold mx-3">VS</span>
              <v-btn-toggle rounded="0" variant="plain">
                <v-btn
                  v-for="race in races"
                  :title="raceName[race]"
                  compact
                  size="small"
                  :active="false"
                  :variant="opponent === race ? 'text' : 'plain'"
                  :style="{
                    padding: 0,
                  }"
                  @click="
                    () =>
                      opponent === race
                        ? (opponent = Race.Random)
                        : (opponent = race)
                  "
                >
                  <img
                    :src="raceIcon[race]"
                    :width="opponent === race ? '45px' : '35px'"
                  />
                </v-btn>
              </v-btn-toggle>
              <v-data-table
                hover
                class="mt-3"
                @click:row="
                  (_: any, row: any) =>
                    router.push(`/buildorders/${row.item.id}`)
                "
                :items="items"
                :headers="[
                  { title: 'Name', value: 'name', key: 'name' },
                  { title: 'Player', value: 'player', key: 'player' },
                  { title: 'Opponent', value: 'opponent', key: 'opponent' },
                  { title: 'Rating', value: 'stars', key: 'stars' },
                  { title: 'Created', value: 'created', key: 'created' },
                ]"
                :sort-by="[{ key: 'stars', order: 'desc' }]"
              >
                <template v-slot:item.player="{ value }">
                  <img
                    style="vertical-align: middle"
                    width="25px"
                    :src="raceIcon[value]"
                  />
                  {{ raceName[value] }}
                </template>

                <template v-slot:item.opponent="{ value }">
                  <img
                    style="vertical-align: middle"
                    width="25px"
                    :src="raceIcon[value]"
                  />
                  {{ raceName[value] }}
                </template>

                <template v-slot:item.stars="{ value }">
                  <v-chip variant="tonal" label :color="getRating(value)">
                    {{ value }}
                  </v-chip>
                </template>

                <template v-slot:item.created="{ value }">
                  {{ moment(value).fromNow() }}
                </template>
              </v-data-table>
            </v-col></v-row
          >
          <v-row>
            <v-col cols="12"> </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-container>
  </main>
</template>
