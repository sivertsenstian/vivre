<script setup lang="ts">
import { useBuildsStore } from "@/stores/builds";
import { Race, raceName, raceIcon } from "@/stores/races";
import { ref } from "vue";

const builds = useBuildsStore();

const races = [Race.Human, Race.Orc, Race.NightElf, Race.Undead];

const tab = ref("existing");
</script>

<template>
  <main>
    <v-container fluid>
      <v-sheet class="pa-8" elevation="5" style="min-height: 90vh">
        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-2">
          <v-tab value="existing">Available build orders</v-tab>
          <v-tab value="new">New build order</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="existing">
            <v-container>
              <v-row
                ><v-col cols="12">
                  <div class="text-h5">Your Active Build Orders</div>
                  <hr /></v-col
              ></v-row>
              <v-row
                ><v-col cols="12">
                  <div class="text-h5">Available Build Orders</div>
                  <hr /></v-col
              ></v-row>
              <v-row>
                <v-col cols="12"> </v-col>
              </v-row>
            </v-container>
          </v-window-item>

          <v-window-item value="new">
            <v-form>
              <v-container>
                <v-row
                  ><v-col cols="12">
                    <div class="text-h4">New Build Order</div>
                    <hr /></v-col
                ></v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      hide-details
                      density="compact"
                      v-model="builds.data.new.name"
                      :counter="10"
                      label="name"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
                    <v-select
                      hide-details
                      :items="races"
                      density="compact"
                      label="Player"
                      item-text=""
                      v-model="builds.data.new.player"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props"
                          ><img :src="raceIcon[item.raw]" width="50px;"
                        /></v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      hide-details
                      :items="races"
                      density="compact"
                      label="Opponent"
                      v-model="builds.data.new.opponent"
                    ></v-select>
                  </v-col>

                  <v-col cols="12"
                    ><div class="text-h6">Steps:</div>
                    <hr
                  /></v-col>
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
                        <tr
                          v-for="(item, index) in builds.data.new.steps"
                          :key="item.id"
                        >
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
                              class="ml-3"
                              hide-details
                              density="compact"
                              v-model="item.timing"
                            ></v-checkbox>
                          </td>
                          <td>
                            <v-btn
                              icon="mdi-delete"
                              variant="flat"
                              density="compact"
                              @click="() => builds.removeStep(item)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  <v-col cols="12" class="text-right">
                    <v-btn @click="builds.addStep"> Add Step </v-btn>
                  </v-col>
                  <v-col cols="8">
                    <v-btn color="success" block @click="builds.save">
                      Save Build
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn color="error" block @click="builds.clear">
                      Clear Build
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-window-item>
        </v-window>
      </v-sheet>
    </v-container>
  </main>
</template>
