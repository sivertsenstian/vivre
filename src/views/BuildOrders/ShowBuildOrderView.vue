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

import type { IBuild, IBuildOrderState } from "@/utilities/types";
import { computed } from "vue";
import ViabilitySlider from "@/components/ViabilitySlider.vue";

import { MdPreview } from "md-editor-v3";
import MarkdownViewer from "@/components/MarkdownViewer.vue";

const open = (path: string) => window.open(path, "_blank");

const getLinkType = (path: string) => {
  const p = path.toLowerCase();
  if (["youtube", "youtu.be"].some((v) => p.includes(v))) {
    return "mdi-youtube";
  } else if (["w3champions.com"].some((v) => p.includes(v))) {
    return "mdi-controller";
  } else if (["twitch"].some((v) => p.includes(v))) {
    return "mdi-twitch";
  }
  return "mdi-link";
};

const getLinkColor = (path: string) => {
  const p = path.toLowerCase();
  if (["youtube", "youtu.be"].some((v) => p.includes(v))) {
    return "red";
  } else if (["w3champions.com"].some((v) => p.includes(v))) {
    return "yellow";
  } else if (["twitch"].some((v) => p.includes(v))) {
    return "purple";
  }
  return "secondary";
};

const isValidLink = (path: string) => {
  const p = path.toLowerCase();
  return ["youtube", "youtu.be", "w3champions.com", "twitch"].some((v) =>
    p.includes(v),
  );
};

const route = useRoute();
const router = useRouter();
const builds = useBuildsStore();

const db = useFirestore();
const buildorder = useDocument<IBuild>(
  doc(db, "buildorders", String(route.params.id)),
);

const order = computed(() => {
  let count: number[] = [];
  let c = 1;
  if (buildorder.value?.steps?.length) {
    for (let i = 0; i < buildorder.value.steps.length; i++) {
      count[i] = c;
      if (buildorder.value.steps[i].separator) {
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
                ><strong>Created:</strong>
                <span class="text-secondary ml-1">
                  {{
                    (buildorder.created?.toDate
                      ? moment(buildorder.created.toDate())
                      : moment(buildorder.created)
                    ).format("MM.DD.YYYY HH:mm")
                  }}
                </span></span
              >
              <span class="ml-5 text-subtitle-2"
                ><strong>By:</strong>
                <span class="text-secondary ml-1">
                  {{ buildorder.author ?? "Anonymous" }}
                </span></span
              >
              <span class="ml-5 text-subtitle-2"
                ><strong>Patch:</strong>
                <span class="text-secondary ml-1">
                  {{ buildorder.version ?? "Unspecified" }}
                </span></span
              >
            </v-col>
            <v-col cols="4" class="text-right">
              <v-btn
                :disabled="!builds.canEdit(buildorder.id)"
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

            <v-col cols="6">
              <v-row v-if="buildorder.games?.length">
                <v-col cols="6">
                  <div class="text-subtitle-2 font-weight-bold">
                    Helpful Links
                  </div>
                  <template v-for="(game, i) in buildorder.games">
                    <v-btn
                      v-if="isValidLink(game.id)"
                      @click="() => open(game.id)"
                      :title="`Open '${game.id}'`"
                      size="small"
                      :color="getLinkColor(game.id)"
                      :prepend-icon="getLinkType(game.id)"
                      variant="text"
                    />
                  </template>
                </v-col>
                <v-col cols="3" v-if="buildorder.viability">
                  <viability-slider readonly v-model="buildorder.viability"
                /></v-col>
                <v-col cols="3" v-if="buildorder.difficulty">
                  <span class="text-subtitle-2 font-weight-bold mr-1"
                    >Difficulty:
                  </span>
                  <v-chip
                    variant="tonal"
                    label
                    size="small"
                    :color="
                      buildorder.difficulty === builds.difficulties[0]
                        ? 'green'
                        : buildorder.difficulty === builds.difficulties[1]
                          ? 'orange'
                          : 'red'
                    "
                    prepend-icon="mdi-weight-lifter"
                  >
                    {{ buildorder.difficulty }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-row v-if="buildorder.tags">
                <v-col cols="12">
                  <v-chip-group column variant="tonal">
                    <v-chip
                      v-for="tag in buildorder.tags"
                      :text="tag"
                      prepend-icon="mdi-tag"
                      color="primary"
                      size="small"
                    >
                    </v-chip>
                  </v-chip-group>
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
                  <section class="description">
                    <markdown-viewer v-model="buildorder.description" />
                  </section>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12">
                  <section class="text-grey">No description..</section>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <v-sheet elevation="10" border class="py-5 px-8">
                    <div class="text-h5 font-weight-bold">
                      Build Order
                      <span class="text-grey"
                        >//
                        {{
                          buildorder.steps.filter((s) => !s.separator).length
                        }}
                        steps</span
                      >
                      <div
                        class="text-subtitle-2 ml-auto"
                        style="display: inline-block; float: right"
                      >
                        <img
                          style="vertical-align: middle"
                          width="20px"
                          :src="raceIcon[buildorder.player]"
                        />
                        {{ raceName[buildorder.player] }}
                        <span class="font-weight-bold"> vs </span>

                        <img
                          style="vertical-align: middle"
                          width="20px"
                          :src="raceIcon[buildorder.opponent]"
                        />
                        {{ raceName[buildorder.opponent] }}
                      </div>
                    </div>
                    <v-table class="steps" hover height="70vh" fixed-header>
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
                          :class="{
                            timing: step.timing,
                            separator: step.separator,
                          }"
                          :title="
                            step.timing ? 'This is an important timing!' : ''
                          "
                        >
                          <template v-if="!step.separator">
                            <td class="text-center">{{ order[i] }}</td>
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
                          </template>
                          <template v-else>
                            <td class="text-center">
                              <v-icon
                                color="primary"
                                variant=""
                                icon="mdi-shield-outline"
                              />
                            </td>
                            <td colspan="3" class="py-2">
                              <span
                                class="font-weight-bold"
                                style="vertical-align: middle"
                                >{{ step.instructions }}</span
                              >
                            </td>
                          </template>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>

<style>
table.steps {
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

  tbody tr.separator {
    td:first-child {
      border-left: 10px solid rgba(var(--v-theme-primary), 1);
    }
    background: rgba(var(--v-theme-primary), 0.1);
  }
}

.description {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
