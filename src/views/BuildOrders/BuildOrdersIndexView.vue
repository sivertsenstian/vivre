<script setup lang="ts">
import moment from "moment";
import { useBuildsStore } from "@/stores/builds";
import { raceName, raceIcon, Race } from "@/stores/races";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import _take from "lodash/take";
import _skip from "lodash/drop";

import { useStorage } from "@vueuse/core";
import ViabilitySlider from "@/components/ViabilitySlider.vue";

const itemsPerPage = useStorage("vivre/itemsPerPage", 25);
const currentPage = useStorage("vivre/currentPage", 1);
const player = useStorage("vivre/filterPlayer", Race.Random);
const opponent = useStorage("vivre/filterOpponent", Race.Random);
const search = ref();

const builds = useBuildsStore();
const router = useRouter();

const races = [Race.Random, Race.Human, Race.Orc, Race.NightElf, Race.Undead];

// Render helpers
const getRating = (stars: number) => {
  if (stars <= 0) return "grey";
  else if (stars === 1) return `orange`;
  else if (stars < 5) return `orange-lighten-${stars - 1}`;
  else if (stars === 5) return `yellow`;
  else if (stars < 10) return `yellow-lighten-${stars - 5}`;
  else if (stars < 14) return `green-lighten-${4 - (stars - 10)}`;
  else return "green";
};

const items = computed(() => {
  let result = builds.buildorders;

  if (player.value > 0) {
    result = result.filter((b) => b.player === player.value);
  }

  if (opponent.value > 0) {
    result = result.filter(
      (b) => b.opponent === opponent.value || b.opponent === Race.Random,
    );
  }

  return result;
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet class="pa-8" elevation="5" style="min-height: 90vh">
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
            <v-row>
              <v-col cols="8">
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
                        player === race
                          ? (player = Race.Random)
                          : (player = race)
                    ">
                    <img
                      :src="raceIcon[race]"
                      :width="player === race ? '45px' : '35px'" />
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
                    ">
                    <img
                      :src="raceIcon[race]"
                      :width="opponent === race ? '45px' : '35px'" />
                  </v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col cols="4" class="align-content-end">
                <v-text-field
                  v-model="search"
                  label="Search..."
                  prepend-inner-icon="mdi-magnify"
                  variant="underlined"
                  hide-details
                  single-line
                  clearable
                  size="x-small"></v-text-field>
              </v-col>
            </v-row>
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :loading="builds.pending"
              :search="search"
              :page="currentPage"
              @update:page="(newPage: number) => (currentPage = newPage)"
              hover
              class="build-orders mt-3"
              @click:row="
                (_: any, row: any) => router.push(`/buildorders/${row.item.id}`)
              "
              :items="items"
              :headers="[
                { title: 'Name', value: 'name', key: 'name' },
                { title: 'Player', value: 'player', key: 'player' },
                { title: 'Opponent', value: 'opponent', key: 'opponent' },
                { title: 'Rating', value: 'stars', key: 'stars' },
                {
                  title: 'Difficulty',
                  value: 'difficulty',
                  key: 'difficulty',
                },
                {
                  title: 'Viability',
                  value: 'viability',
                  key: 'viability',
                },
                {
                  title: 'Tags',
                  value: 'tags',
                  key: 'tags',
                },
                {
                  title: 'Patch',
                  value: 'version',
                  key: 'version',
                },
                { title: 'Author', value: 'author', key: 'author' },
                {
                  title: 'Created',
                  value: 'created',
                  key: 'created',
                  sortRaw: (a, b) => {
                    const am = (
                      a?.created.toDate
                        ? moment(a.created.toDate())
                        : moment(a.created)
                    ).valueOf();

                    const bm = (
                      b?.created.toDate
                        ? moment(b.created.toDate())
                        : moment(b.created)
                    ).valueOf();
                    return am - bm;
                  },
                },
              ]"
              :sort-by="[{ key: 'stars', order: 'desc' }]">
              <template v-slot:top>
                <div
                  title="reset filters"
                  class="text-right text-grey filter"
                  v-if="[player, opponent].some((v) => v !== Race.Random)"
                  @click="
                    () => {
                      player = Race.Random;
                      opponent = Race.Random;
                    }
                  ">
                  <v-icon size="small" icon="mdi-filter" color="primary" />
                  <span class="ml-1" style="vertical-align: bottom"
                    >data is filtered</span
                  >
                </div>
                <div v-else>&nbsp;</div>
              </template>

              <template v-slot:item.player="{ value }">
                <div style="white-space: nowrap">
                  <img
                    style="vertical-align: middle"
                    width="25px"
                    :src="raceIcon[value]" />
                  {{ raceName[value] }}
                </div>
              </template>

              <template v-slot:item.opponent="{ value }">
                <div style="white-space: nowrap">
                  <img
                    style="vertical-align: middle"
                    width="25px"
                    :src="raceIcon[value]" />
                  {{ raceName[value] }}
                </div>
              </template>

              <template v-slot:item.stars="{ value }">
                <v-chip
                  variant="tonal"
                  label
                  size="small"
                  :color="getRating(value)"
                  append-icon="mdi-star">
                  {{ value }}
                </v-chip>
              </template>

              <template v-slot:item.difficulty="{ value }">
                <v-chip
                  v-if="value"
                  variant="tonal"
                  label
                  size="small"
                  :title="value"
                  :color="
                    value === builds.difficulties[0]
                      ? 'green'
                      : value === builds.difficulties[1]
                        ? 'orange'
                        : 'red'
                  ">
                  <v-icon icon="mdi-weight-lifter" />
                </v-chip>
              </template>

              <template v-slot:item.viability="{ value }">
                <viability-slider v-if="value" :icon="value" />
              </template>

              <template v-slot:item.tags="{ value }">
                <v-chip-group column variant="tonal">
                  <v-chip
                    v-for="tag in _take(value, 2)"
                    :text="String(tag)"
                    size="small">
                  </v-chip>
                  <v-chip
                    v-if="value?.length > 2"
                    :title="
                      _skip(value, 2)
                        .map((v) => `'${v}'`)
                        .join(', ')
                    "
                    :text="`+${value.length - 2} more`"
                    size="small">
                  </v-chip>
                </v-chip-group>
              </template>
              <template v-slot:item.created="{ value }">
                {{
                  (value?.toDate
                    ? moment(value.toDate())
                    : moment(value)
                  ).fromNow()
                }}
              </template>

              <template v-slot:loading>
                <v-skeleton-loader
                  :type="`table-row@${itemsPerPage}`"></v-skeleton-loader>
              </template>
            </v-data-table> </v-col
        ></v-row>
        <v-row>
          <v-col cols="12">
            <v-alert
              text="
29.08
-------
- Add 'Annotation' functionality to buildorder steps, making it possible to add additional context/information to the step/instruction
- Add search field to build order list and use more of the page
- Add author column to build order list

Previously
-------
- Add drag and drop support for build order steps in create and edit mode
- Add 'Viability' field to build, to indicate how close to meta/standard the build is
- Improve readability by using more of the horizontal screen space
- Add support for markdown in build order descriptions! Check this guide: https://www.markdownguide.org/basic-syntax/ if interested :)
- Add 'Any' as a possible (and default) opponent race
- Add Tags field
- Rework games => now 'Link' and supports any http link, youtube, w3c and twitch links have a unique icon!
- Add some of the new fields as columns to the index
- Food for initial step should now reflect the player race. This will only change on update if you have a single step
  as otherwise I would have to re-calculate all consequent steps.
- Add Difficulty, Author and Patch fields
- Add 'separator' to build steps - to be used to signify section changes or highlight events.


Thanks for testing out the build order builder!
It's still a work in progress, so issues might arise.
If you have any feedback - don't hesitate to contact me @Longjacket in the w3c or gym discord <3
"
              title="Recent changes"
              type="info"
              variant="tonal"
              style="white-space: pre-wrap; border: 1px solid"
              border-color="primary"></v-alert>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>

<style lang="css">
.build-orders div.text-grey.filter > span:hover {
  cursor: pointer;
  color: rgba(var(--v-theme-secondary), 1);
}

.v-alert__content {
  height: 250px;
  overflow-y: auto;
}
</style>
