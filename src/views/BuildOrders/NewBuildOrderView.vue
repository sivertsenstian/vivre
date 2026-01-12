<script setup lang="ts">
import { useBuildsStore } from "@/stores/builds";
import { Race, raceName } from "@/stores/races";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import ViabilitySlider from "@/components/ViabilitySlider.vue";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import draggable from "vuedraggable";
import UpsertStepAnnotation from "@/components/UpsertStepAnnotation.vue";
import axios from "axios";
import * as parser from "@/utilities/buildorderparser";
import {
  formatTimeSpanDuration,
  getRaceFromBuildOrderItems,
  type IReplay,
} from "@/utilities/buildorderparser";
import _last from "lodash/last";
import moment from "moment";

const builds = useBuildsStore();

const router = useRouter();
const playerRaces = [Race.Human, Race.Orc, Race.NightElf, Race.Undead];
const opponentRaces = [
  Race.Random,
  Race.Human,
  Race.Orc,
  Race.NightElf,
  Race.Undead,
];

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

const getInitialFoodForRace = (race: Race) => {
  switch (race) {
    case Race.Human:
      return "5/12";
    case Race.Orc:
      return "5/11";
    case Race.Undead:
    case Race.NightElf:
      return "5/10";
    default:
      return "0/10";
  }
};

const updateFood = (race: Race) => {
  if (builds.data.new.steps.length === 1) {
    builds.data.new.steps[0].food = getInitialFoodForRace(race);
  }
};

const activeImportFile = ref<File>();
const activeImportReplay = ref<IReplay>();
const activeImportSlot = ref(0);
const activeImportTimeInMinutes = ref(6);
const isImporting = ref(false);

const activeImportReplayDuration = computed(() => {
  const lastStep = _last(
    activeImportReplay.value?.playerBuildOrders?.[activeImportSlot.value]
      ?.buildOrderItems ?? [],
  );
  return moment.duration(lastStep?.timeSpan);
});

const onImportBuild = async (event: any) => {
  isImporting.value = true;
  if (event?.target?.files?.[0]) {
    try {
      const file = event?.target?.files?.[0];
      const response = await axios.postForm(
        "https://w3tools.hexcoding.de/api/replay/parse",
        { file },
      );
      activeImportReplay.value = response.data;
    } catch (error) {
      console.error("Failed to parse replay...", error);
    } finally {
      isImporting.value = false;
    }
  } else {
    console.log("No file selected or file input cleared.");
  }
};
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
          <v-row
            ><v-col v-if="!activeImportFile?.name">
              <div class="text-h5 font-weight-bold">Create New Build Order</div>
            </v-col>
            <v-col v-else cols="2" />
            <v-col
              :cols="activeImportFile?.name ? 8 : 4"
              class="text-right"
              :style="{
                padding: activeImportFile?.name ? '50px' : '',
                border: activeImportFile?.name
                  ? '1px dashed rgba(var(--v-border-color), var(--v-border-opacity))'
                  : '',
              }">
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    hide-details
                    density="compact"
                    :loading="isImporting"
                    clearable
                    prepend-icon="mdi-file-upload"
                    variant="solo-filled"
                    color="primary"
                    accept=".w3g"
                    label="Select a replay to import build order from..."
                    @change="onImportBuild"
                    v-model="activeImportFile" />
                </v-col>
              </v-row>
              <v-row v-if="activeImportReplay?.replayName">
                <v-col cols="12" class="text-left">
                  <h3>
                    Importing Build Order Steps from '{{
                      activeImportReplay.replayName
                    }}'
                  </h3>
                  <hr />
                </v-col>
                <v-col cols="12" class="text-center font-italic font-sm">
                  Replay import powered by
                  <a href="https://w3tools.hexcoding.de" target="_blank"
                    >The Undead University</a
                  >
                  created by <span class="text-success">Mave</span>
                </v-col>
                <v-col cols="12" class="text-center">
                  You have selected a
                  <span class="text-yellow">{{
                    formatTimeSpanDuration(activeImportReplayDuration)
                  }}</span>
                  minute(s) long replay, containing the players:
                  <span class="text-primary">{{
                    activeImportReplay.playerBuildOrders
                      .map(
                        (p) =>
                          `${p.playerName} (${raceName[getRaceFromBuildOrderItems(p.buildOrderItems)]}) `,
                      )
                      .join(", ")
                  }}</span>
                </v-col>
                <v-col cols="6" xl="4">
                  <v-select
                    hide-details
                    :items="
                      activeImportReplay.playerBuildOrders.map((r, i) => ({
                        text: `${r.playerName} (${raceName[getRaceFromBuildOrderItems(r.buildOrderItems)]})`,
                        value: i,
                      }))
                    "
                    item-title="text"
                    item-value="value"
                    density="compact"
                    label="Import build order from"
                    v-model="activeImportSlot" />
                </v-col>
                <v-col cols="6" xl="4" class="text-left">
                  <v-slider
                    color="secondary"
                    label="Minutes to import"
                    append-icon="mdi-clock"
                    :step="1"
                    thumb-label
                    v-model="activeImportTimeInMinutes"
                    :min="1"
                    :max="activeImportReplayDuration.minutes() + 1"
                    class="align-center"
                    hide-details>
                    <template v-slot:thumb-label="{ modelValue }">
                      <span class="text-no-wrap">{{ modelValue }} minutes</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="12" xl="4" class="text-center">
                  <v-btn
                    class="mr-1"
                    :rounded="false"
                    variant="tonal"
                    color="error"
                    @click="
                      () => {
                        activeImportFile = undefined;
                        activeImportReplay = undefined;
                      }
                    ">
                    Cancel
                  </v-btn>
                  <v-btn
                    class="ml-1"
                    :rounded="false"
                    variant="tonal"
                    color="success"
                    :loading="isImporting"
                    @click="
                      async () => {
                        try {
                          isImporting = true;
                          const items =
                            activeImportReplay?.playerBuildOrders?.[
                              activeImportSlot
                            ]?.buildOrderItems ?? [];
                          const initialFood = getInitialFoodForRace(
                            getRaceFromBuildOrderItems(items),
                          );

                          const importedSteps = parser.parse(
                            activeImportTimeInMinutes,
                            items,
                            initialFood,
                          );
                          builds.data.new.steps = importedSteps;
                        } catch (error) {
                          console.log(
                            'Unable to import build order steps',
                            error,
                          );
                        } finally {
                          isImporting = false;
                          activeImportFile = undefined;
                          activeImportReplay = undefined;
                        }
                      }
                    ">
                    Import Steps
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2" class="text-right">
              <v-btn
                variant="text"
                color="error"
                @click="
                  () => {
                    builds.clear();
                    activeImportFile = undefined;
                    activeImportReplay = undefined;
                  }
                ">
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
                    required></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    hide-details
                    :items="
                      playerRaces.map((r) => ({
                        text: raceName[r],
                        value: r,
                      }))
                    "
                    item-title="text"
                    item-value="value"
                    density="compact"
                    label="Player"
                    v-model="builds.data.new.player"
                    @update:modelValue="updateFood" />
                </v-col>
                <v-col cols="6">
                  <v-select
                    hide-details
                    :items="
                      opponentRaces.map((r) => ({
                        text: raceName[r],
                        value: r,
                      }))
                    "
                    item-title="text"
                    item-value="value"
                    density="compact"
                    label="Opponent"
                    v-model="builds.data.new.opponent"></v-select>
                </v-col>

                <v-col cols="8">
                  <v-text-field
                    hide-details
                    density="compact"
                    v-model="builds.data.new.author"
                    label="Author (optional)"></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    hide-details
                    density="compact"
                    v-model="builds.data.new.version"
                    label="Patch (optional)"></v-text-field>
                </v-col>

                <v-col cols="8">
                  <viability-slider v-model="builds.data.new.viability" />
                </v-col>

                <v-col cols="4">
                  <v-select
                    hide-details
                    :items="builds.difficulties"
                    density="compact"
                    label="Difficulty (optional)"
                    v-model="builds.data.new.difficulty"></v-select>
                </v-col>

                <v-col cols="12">
                  <v-combobox
                    v-model="builds.data.new.tags"
                    label="Tags (optional)"
                    prepend-inner-icon="mdi-tag-heart"
                    chips
                    closable-chips
                    clearable
                    multiple
                    placeholder="Press [Enter] to create the tag...">
                  </v-combobox>
                </v-col>

                <v-col cols="12">
                  <v-row>
                    <v-col cols="12"
                      ><div class="text-h6 font-weight-bold">
                        Add helpful links (optional)
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-table fixed-header density="compact">
                        <thead>
                          <tr>
                            <th class="text-left" style="width: 10px">#</th>
                            <th class="text-left" style="width: 60%">Link</th>
                            <th class="text-left">Name (optional)</th>
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
                                placeholder="e.g. https://w3champions.com/match/66c1ca3e0ebc9196a2e60095"></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                hide-details
                                density="compact"
                                variant="underlined"
                                v-model="item.name"
                                placeholder="e.g. 'Replay'"></v-text-field>
                            </td>
                            <td>
                              <v-btn
                                title="Delete link"
                                icon="mdi-delete-outline"
                                color="red-lighten-2"
                                variant="text"
                                density="compact"
                                size="small"
                                @click="
                                  () => builds.removeGame('new', item.id)
                                " />
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
                        size="small">
                        Add Link
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" style="height: auto">
                  <markdown-editor v-model="builds.data.new.description" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="7">
              <v-row>
                <v-col cols="12"
                  ><div class="text-h6 font-weight-bold">Build order steps</div>
                </v-col>
                <v-col cols="12">
                  <v-table fixed-header density="compact">
                    <thead>
                      <tr>
                        <th />
                        <th>#</th>
                        <th style="min-width: 75px">Time</th>
                        <th style="min-width: 75px">Food</th>
                        <th style="width: 60%">Instructions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <draggable
                      v-model="builds.data.new.steps"
                      tag="tbody"
                      item-key="id"
                      handle=".handle"
                      :animation="200"
                      ghost-class="ghost"
                      :disabled="false"
                      group="description">
                      <template #item="{ element, index }">
                        <tr>
                          <td class="handle px-0">
                            <v-icon
                              size="small"
                              color="grey"
                              icon="mdi-drag-vertical" />
                          </td>
                          <td>
                            <span v-show="!element.separator">{{
                              order[index]
                            }}</span>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="element.time"
                              v-if="!element.separator"></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="element.food"
                              v-if="!element.separator"></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="element.instructions"></v-text-field>
                          </td>
                          <td>
                            <v-btn-group>
                              <v-btn
                                title="Highlight this step as important/timing"
                                variant="text"
                                icon="mdi-clock-outline"
                                :color="element.timing ? 'success' : 'grey'"
                                @click="element.timing = !element.timing"
                                :disabled="element.separator"
                                size="small" />
                              <v-btn
                                title="Use step as a separator or an event with only a header/instruction"
                                variant="text"
                                icon="mdi-shield-outline"
                                :color="element.separator ? 'primary' : 'grey'"
                                @click="element.separator = !element.separator"
                                size="small" />
                              <upsert-step-annotation :step="element" />
                              <v-btn
                                title="Delete step"
                                icon="mdi-delete-outline"
                                color="red-lighten-2"
                                variant="text"
                                size="small"
                                @click="
                                  () => builds.removeStep('new', element)
                                " />
                            </v-btn-group>
                          </td>
                        </tr>
                      </template>
                    </draggable>
                  </v-table>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn
                    @click="() => builds.addStep('new')"
                    color="success"
                    variant="tonal">
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
                @click="() => builds.save(builds.data.new)">
                Create Build Order
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>

<style scoped>
.handle {
  cursor: grab;
}

.sortable-chosen {
  .handle {
    cursor: grabbing !important;
  }
}
.ghost {
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>
