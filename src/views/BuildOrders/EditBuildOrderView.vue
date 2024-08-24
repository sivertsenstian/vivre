<script setup lang="ts">
import { useBuildsStore } from "@/stores/builds";
import { Race, raceName, raceIcon } from "@/stores/races";
import { useRoute, useRouter } from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import { doc } from "firebase/firestore";

const builds = useBuildsStore();

const route = useRoute();
const router = useRouter();

const db = useFirestore();
const buildorder = useDocument(doc(db, "buildorders", String(route.params.id)));
builds.edit(buildorder);

const races = [Race.Human, Race.Orc, Race.NightElf, Race.Undead];
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet
        class="pa-8"
        elevation="5"
        style="min-height: 90vh"
        v-if="
          builds.data &&
          builds.data.edit?.id &&
          builds.data.owns[builds.data.edit.id]
        "
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
              ><v-col cols="8">
                <div class="text-h5 font-weight-bold">Edit Build Order</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      hide-details
                      density="compact"
                      v-model="builds.data.edit.name"
                      :counter="10"
                      label="Name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      hide-details
                      :items="
                        races.map((r) => ({ text: raceName[r], value: r }))
                      "
                      item-title="text"
                      item-value="value"
                      density="compact"
                      label="Player"
                      v-model="builds.data.edit.player"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      hide-details
                      :items="
                        races.map((r) => ({ text: raceName[r], value: r }))
                      "
                      item-title="text"
                      item-value="value"
                      density="compact"
                      label="Opponent"
                      v-model="builds.data.edit.opponent"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      hide-details
                      density="compact"
                      label="Guide (optional)"
                      v-model="builds.data.edit.description"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="7">
                <v-row>
                  <v-col cols="12"
                    ><div class="text-h6 font-weight-bold">
                      Build order steps
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-table fixed-header density="compact">
                      <thead>
                        <tr>
                          <th class="text-left">#</th>
                          <th class="text-left">Time</th>
                          <th class="text-left">Food</th>
                          <th class="text-left" style="width: 50%">
                            Instructions
                          </th>
                          <th class="text-left">Hotkey</th>
                          <th class="text-left" style="width: 20px">Timing</th>
                          <th class="text-center" style="width: 10px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in builds.data.edit.steps">
                          <td>{{ index + 1 }}</td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="item.time"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="item.food"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="item.instructions"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="item.hotkey"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-checkbox
                              title="Mark this step as an important timing"
                              class="ml-3"
                              hide-details
                              density="compact"
                              v-model="item.timing"
                            ></v-checkbox>
                          </td>
                          <td>
                            <v-btn
                              title="Delete step"
                              icon="mdi-delete"
                              color="red-lighten-2"
                              variant="text"
                              density="compact"
                              @click="() => builds.removeStep('edit', item)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      @click="() => builds.addStep('edit')"
                      color="success"
                      variant="tonal"
                    >
                      Add Step
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="3" class="mx-auto">
                <v-btn
                  color="success"
                  variant="tonal"
                  block
                  :loading="builds.busy"
                  @click="() => builds.update(builds.data.edit)"
                >
                  Update Build Order
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
      <v-sheet
        class="pa-8"
        elevation="5"
        style="min-height: 90vh"
        v-if="
          builds.data &&
          builds.data.edit?.id &&
          !builds.data.owns[builds.data.edit.id]
        "
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
              ><v-col cols="8">
                <div class="text-h5 font-weight-bold">Edit Build Order</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-icon
                  style="font-size: 200px; width: 200px; height: 200px"
                  size="x-large"
                  color="grey"
                  icon="mdi-alert-decagram-outline"
                />
                <div class="text-h4 text-red-lighten-2 my-3">
                  Unable to edit build '{{ buildorder?.name }}'
                </div>
                <div class="text-h5 text-grey">
                  You can only edit builds you have created.
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>
