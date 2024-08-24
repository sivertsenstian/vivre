<script setup lang="ts">
import moment from "moment";
import { useBuildsStore } from "@/stores/builds";
import { Race, raceName, raceIcon } from "@/stores/races";
import { useRoute, useRouter } from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import { doc } from "firebase/firestore";

import upkeep from "@/assets/upkeep.png";
import type { IBuild } from "@/utilities/types";

const route = useRoute();
const router = useRouter();
const builds = useBuildsStore();

const db = useFirestore();
const buildorder = useDocument<IBuild>(
  doc(db, "buildorders", String(route.params.id)),
);
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet
        class="pa-8"
        elevation="10"
        style="min-height: 90vh"
        v-if="buildorder?.id"
      >
        <v-btn
          prepend-icon="mdi-arrow-left"
          color="secondary"
          variant="text"
          @click="() => router.push('/buildorders')"
          >Go Back</v-btn
        >
        <v-form>
          <v-container>
            <v-row
              ><v-col cols="12">
                <div class="text-h3 font-weight-bold">
                  {{ buildorder.name }}
                </div>
              </v-col>
              <v-col cols="8">
                <v-btn
                  @click="
                    builds.data.starred[buildorder.id]
                      ? builds.unstar(buildorder)
                      : builds.star(buildorder)
                  "
                  color="secondary"
                  :variant="
                    builds.data.starred[buildorder.id] ? 'flat' : 'outlined'
                  "
                  prepend-icon="mdi-star"
                  >{{ buildorder.stars }}</v-btn
                >
                <span class="ml-5 text-subtitle-2"
                  ><strong>Created</strong>:
                  <span class="text-secondary">{{
                    moment(buildorder.created).format("MM.DD.YYYY HH:mm")
                  }}</span></span
                >
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn
                  v-if="builds.data.owns[buildorder.id]"
                  prepend-icon="mdi-pen"
                  variant="text"
                  color="secondary"
                  @click="
                    () =>
                      buildorder?.id
                        ? router.push(`/buildorders/${buildorder.id}/edit`)
                        : null
                  "
                >
                  Edit Build
                </v-btn>
              </v-col>
              <v-col cols="12">
                <hr />
              </v-col>

              <v-col cols="5">
                <section
                  :style="{
                    color: buildorder.description ? 'inherit' : 'gray',
                    whiteSpace: 'pre-wrap',
                  }"
                >
                  {{
                    buildorder.description.length
                      ? buildorder.description
                      : "No description..."
                  }}
                </section>
              </v-col>
              <v-col cols="7">
                <v-row>
                  <v-col cols="12">
                    <v-sheet elevation="10" border class="py-5 px-8">
                      <div class="text-h5 font-weight-bold">Build Order</div>
                      <v-table hover>
                        <thead>
                          <tr>
                            <th class="text-left">#</th>
                            <th class="text-left">Time</th>
                            <th class="text-left">Instructions</th>
                            <th class="text-center">Food</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(step, i) in buildorder.steps">
                            <td>{{ i + 1 }}</td>
                            <td>{{ step.time }}</td>
                            <td>{{ step.instructions }}</td>
                            <td>
                              <div
                                style="
                                  display: flex;
                                  justify-content: center;
                                  align-items: center;
                                "
                              >
                                <img :src="upkeep" width="25px" />
                                <span class="ml-2">{{ step.food }}</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>

<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
