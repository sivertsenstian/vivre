<script setup lang="ts">
import { useBuildsStore } from "@/stores/builds";
import { Race, raceName } from "@/stores/races";
import { useRoute, useRouter } from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import { doc } from "firebase/firestore";
import { computed, ref } from "vue";
import ViabilitySlider from "@/components/ViabilitySlider.vue";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import draggable from "vuedraggable";
import UpsertStepAnnotation from "@/components/UpsertStepAnnotation.vue";

const builds = useBuildsStore();

const route = useRoute();
const router = useRouter();

const db = useFirestore();
const buildorder = useDocument(doc(db, "buildorders", String(route.params.id)));
builds.edit(buildorder);

const secret = ref<string>("");
const claimed = ref<boolean>();

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
                            <th class="text-left" style="width: 60%">Link</th>
                            <th class="text-left">Name (optional)</th>
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
                              <v-text-field
                                hide-details
                                density="compact"
                                variant="underlined"
                                v-model="item.name"
                                placeholder="e.g. 'Replay'"
                              ></v-text-field>
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
                        <th />
                        <th>#</th>
                        <th style="min-width: 75px">Time</th>
                        <th style="min-width: 75px">Food</th>
                        <th style="width: 60%">Instructions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <draggable
                      v-model="builds.data.edit.steps"
                      tag="tbody"
                      item-key="id"
                      handle=".handle"
                      :animation="200"
                      ghost-class="ghost"
                      :disabled="false"
                      group="description"
                    >
                      <template #item="{ element, index }">
                        <tr>
                          <td class="handle px-0">
                            <v-icon
                              size="small"
                              color="grey"
                              icon="mdi-drag-vertical"
                            />
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
                              v-if="!element.separator"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="element.food"
                              v-if="!element.separator"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              hide-details
                              density="compact"
                              variant="underlined"
                              v-model="element.instructions"
                            ></v-text-field>
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
                                size="small"
                              />
                              <v-btn
                                title="Use step as a separator or an event with only a header/instruction"
                                variant="text"
                                icon="mdi-shield-outline"
                                :color="element.separator ? 'primary' : 'grey'"
                                @click="element.separator = !element.separator"
                                size="small"
                              />
                              <upsert-step-annotation :step="element" edit />
                              <v-btn
                                title="Delete step"
                                icon="mdi-delete-outline"
                                color="red-lighten-2"
                                variant="text"
                                size="small"
                                @click="
                                  () => builds.removeStep('edit', element)
                                "
                              />
                            </v-btn-group>
                          </td>
                        </tr>
                      </template>
                    </draggable>
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
            <v-col
              cols="12"
              class="text-center text-grey mt-5"
              v-if="buildorder?.id"
            >
              <v-col cols="12">
                If this is <i>your</i> build order, you can attempt to claim it.
              </v-col>
              <v-col cols="4" offset="4">
                <v-text-field
                  hide-details
                  label="Secret"
                  density="compact"
                  variant="underlined"
                  v-model="secret"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="
                        async () =>
                          (claimed = await builds.claim(buildorder, secret))
                      "
                      color="success"
                      variant="tonal"
                      prepend-icon="mdi-shield-lock-open-outline"
                    >
                      Claim
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" v-show="claimed !== undefined">
                <span class="text-success" v-if="claimed">
                  <v-icon
                    icon="mdi-party-popper"
                    color="success"
                    class="mr-2"
                  />
                  <span style="vertical-align: middle">Build claimed</span>
                </span>
                <span class="text-error" v-else>
                  <v-icon icon="mdi-alert-circle" color="error" class="mr-2" />
                  <span style="vertical-align: middle"
                    >Unable to claim build</span
                  >
                </span>
              </v-col>
              <v-col cols="12">
                Please contact @Longjacket at the
                <a href="https://discord.gg/uJmQxG2" target="_blank"
                  >w3champions discord</a
                >
                to get your secret.
              </v-col>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>

<style>
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
