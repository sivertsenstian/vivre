<script setup lang="ts">
import { useBuildsStore } from "@/stores/builds";
import { Race, raceName, raceIcon } from "@/stores/races";
import { useRoute, useRouter } from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import { doc } from "firebase/firestore";
import { computed } from "vue";
import ViabilitySlider from "@/components/ViabilitySlider.vue";
import MarkdownEditor from "@/components/MarkdownEditor.vue";

const builds = useBuildsStore();

const route = useRoute();
const router = useRouter();

const db = useFirestore();
const buildorder = useDocument(doc(db, "buildorders", String(route.params.id)));
builds.edit(buildorder);

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
  if (builds.data.edit.steps?.length) {
    for (let i = 0; i < builds.data.edit.steps.length; i++) {
      count[i] = c;
      if (builds.data.edit.steps[i].separator) {
      } else {
        c++;
      }
    }
  }
  return count;
});

const updateFood = (race: Race) => {
  if (builds.data.new.steps.length === 1) {
    switch (race) {
      case Race.Human: {
        builds.data.new.steps[0].food = "5/12";
        break;
      }
      case Race.Orc: {
        builds.data.new.steps[0].food = "5/11";
        break;
      }
      case Race.Undead:
      case Race.NightElf: {
        builds.data.new.steps[0].food = "5/10";
        break;
      }
      default: {
        builds.data.new.steps[0].food = "0/10";
        break;
      }
    }
  }
};
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
          builds.canEdit(String(route.params.id))
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
                    label="Name"
                  ></v-text-field>
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
                    v-model="builds.data.edit.player"
                    @update:modelValue="updateFood"
                  />
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
                    v-model="builds.data.edit.opponent"
                  ></v-select>
                </v-col>

                <v-col cols="8">
                  <v-text-field
                    hide-details
                    density="compact"
                    v-model="builds.data.edit.author"
                    label="Author (optional)"
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    hide-details
                    density="compact"
                    v-model="builds.data.edit.version"
                    label="Patch (optional)"
                  ></v-text-field>
                </v-col>

                <v-col cols="8">
                  <viability-slider v-model="builds.data.edit.viability" />
                </v-col>

                <v-col cols="4">
                  <v-select
                    hide-details
                    :items="builds.difficulties"
                    density="compact"
                    label="Difficulty (optional)"
                    v-model="builds.data.edit.difficulty"
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-combobox
                    v-model="builds.data.edit.tags"
                    label="Tags (optional)"
                    prepend-inner-icon="mdi-tag-heart"
                    chips
                    closable-chips
                    clearable
                    multiple
                    placeholder="Press [Enter] to create the tag..."
                  >
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
                            <th class="text-left">Link</th>
                            <th class="text-center" style="width: 10px"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in builds.data.edit.games">
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
                                  () => builds.removeGame('edit', item.id)
                                "
                              />
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                    <v-col cols="12" class="text-right">
                      <v-btn
                        @click="() => builds.addGame('edit')"
                        color="success"
                        variant="tonal"
                        size="small"
                      >
                        Add Link
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" style="height: auto">
                  <markdown-editor v-model="builds.data.edit.description" />
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
                        <th class="text-left">#</th>
                        <th class="text-left">Time</th>
                        <th class="text-left">Food</th>
                        <th class="text-left" style="width: 50%">
                          Instructions
                        </th>
                        <th class="text-left">Hotkey</th>
                        <th class="text-left" style="width: 20px">Timing</th>
                        <th class="text-left" style="width: 20px">Separator</th>
                        <th class="text-center" style="width: 10px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in builds.data.edit.steps">
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
        </v-form>
      </v-sheet>
      <v-sheet
        class="pa-8"
        elevation="5"
        style="min-height: 90vh"
        v-if="
          builds.data &&
          builds.data.edit?.id &&
          !builds.canEdit(String(route.params.id))
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
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>
