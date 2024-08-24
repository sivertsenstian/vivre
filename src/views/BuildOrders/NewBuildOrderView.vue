<script setup lang="ts">
import { useBuildsStore } from "@/stores/builds";
import { Race, raceName, raceIcon } from "@/stores/races";
import { useRouter } from "vue-router";
import { computed } from "vue";

const builds = useBuildsStore();

const router = useRouter();
const races = [Race.Human, Race.Orc, Race.NightElf, Race.Undead];

const order = computed(() => {
  let count: number[] = [];
  let c = 1;
  if (builds.data.new.steps.length) {
    for (let i = 0; i < builds.data.new.steps.length; i++) {
      count[i] = c;
      if (builds.data.new.steps[i].separator) {
      } else {
        c++;
      }
    }
  }
  return count;
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet class="pa-8" elevation="5" style="min-height: 90vh">
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
                <div class="text-h5 font-weight-bold">
                  Create New Build Order
                </div>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn variant="text" color="error" @click="builds.clear">
                  Reset Build
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      hide-details
                      density="compact"
                      v-model="builds.data.new.name"
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
                      v-model="builds.data.new.player"
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
                      v-model="builds.data.new.opponent"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      hide-details
                      density="compact"
                      v-model="builds.data.new.author"
                      label="Author (optional)"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12"
                        ><div class="text-h6 font-weight-bold">
                          Add links to sample games (optional)
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <v-table fixed-header density="compact">
                          <thead>
                            <tr>
                              <th class="text-left" style="width: 10px">#</th>
                              <th class="text-left">Link or W3C Game Id</th>
                              <th class="text-center" style="width: 10px"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in builds.data.new.games">
                              <td>{{ index + 1 }}</td>
                              <td>
                                <v-text-field
                                  hide-details
                                  density="compact"
                                  variant="underlined"
                                  v-model="item.id"
                                  placeholder="e.g. https://w3champions.com/match/66c1ca3e0ebc9196a2e60095"
                                ></v-text-field>
                              </td>
                              <td>
                                <v-btn
                                  title="Delete step"
                                  icon="mdi-delete"
                                  color="red-lighten-2"
                                  variant="text"
                                  density="compact"
                                  @click="
                                    () => builds.removeGame('new', item.id)
                                  "
                                />
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-col>
                      <v-col cols="12" class="text-right">
                        <v-btn
                          @click="() => builds.addGame('new')"
                          color="success"
                          variant="tonal"
                          size="small"
                        >
                          Add Game
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      hide-details
                      density="compact"
                      label="Guide (optional)"
                      v-model="builds.data.new.description"
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
                          <th class="text-left" style="width: 20px">
                            Separator
                          </th>
                          <th class="text-center" style="width: 10px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in builds.data.new.steps">
                          <td>
                            <span v-show="!item.separator">{{
                              order[index]
                            }}</span>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="item.time"
                              v-if="!item.separator"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="item.food"
                              v-if="!item.separator"
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
                              v-if="!item.separator"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-checkbox
                              title="Mark this step as an important timing"
                              class="ml-3"
                              hide-details
                              density="compact"
                              v-model="item.timing"
                              v-if="!item.separator"
                            ></v-checkbox>
                          </td>
                          <td>
                            <v-checkbox
                              title="Use step as a separator or an event with only a header/instruction"
                              class="ml-3"
                              hide-details
                              density="compact"
                              v-model="item.separator"
                            ></v-checkbox>
                          </td>
                          <td>
                            <v-btn
                              title="Delete step"
                              icon="mdi-delete"
                              color="red-lighten-2"
                              variant="text"
                              density="compact"
                              @click="() => builds.removeStep('new', item)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      @click="() => builds.addStep('new')"
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
                  @click="() => builds.save(builds.data.new)"
                >
                  Create Build Order
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>
