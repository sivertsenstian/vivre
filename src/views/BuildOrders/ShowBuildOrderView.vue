<script setup lang="ts">
import moment from "moment";
import { useBuildsStore } from "@/stores/builds";
import {
  Race,
  raceName,
  raceIcon,
  raceUpkeep,
  creeproutes,
} from "@/stores/races";
import { useRoute, useRouter } from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import { doc } from "firebase/firestore";

import type { IBuild } from "@/utilities/types";

const open = (path: string) => window.open(path, "_blank");

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
                  prepend-icon="mdi-thumb-up-outline"
                  >{{ buildorder.stars }}</v-btn
                >
                <span class="ml-5 text-subtitle-2"
                  ><strong>Created</strong>:
                  <span class="text-secondary">
                    {{
                      (buildorder.created?.toDate
                        ? moment(buildorder.created.toDate())
                        : moment(buildorder.created)
                      ).format("MM.DD.YYYY HH:mm")
                    }}
                  </span></span
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
                <v-row v-if="buildorder.games?.length">
                  <v-col cols="12">
                    <div class="text-subtitle-2 font-weight-bold">
                      Link to W3C games demonstrating build order
                    </div>
                    <v-btn
                      v-for="(game, i) in buildorder.games"
                      @click="
                        () =>
                          open(`https://www.w3champions.com/match/${game.id}`)
                      "
                      :text="`Game ${i + 1}`"
                      title="Go to match in w3champions demonstrating this build order"
                      size="small"
                      color="secondary"
                      prepend-icon="mdi-link"
                      variant="text"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="buildorder.description?.length">
                  <v-col cols="12">
                    <div class="text-subtitle-2 font-weight-bold">
                      Description
                    </div>
                    <hr />
                  </v-col>
                  <v-col cols="12">
                    <section style="white-space: pre-wrap">
                      {{ buildorder.description }}
                    </section>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="12">
                    <section class="text-grey">No description..</section>
                  </v-col>
                </v-row>
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
                          <tr
                            v-for="(step, i) in buildorder.steps"
                            :class="{ timing: step.timing }"
                            :title="
                              step.timing ? 'This is an important timing!' : ''
                            "
                          >
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
                                <img
                                  :src="raceUpkeep[buildorder.player]"
                                  width="25px"
                                />
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

tbody tr {
  td:first-child {
    border-left: 2px solid transparent;
  }
}

tbody tr.timing {
  td:first-child {
    border-left: 2px solid rgba(var(--v-theme-secondary), 1);
  }
  background: rgba(var(--v-theme-secondary), 0.1);
}
</style>
