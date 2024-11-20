<script setup lang="ts">
import { ref } from "vue";
import makrura from "@/assets/makrura.png";
import { countries } from "countries-list";

import { useMakruraStore } from "@/stores/makrura.ts";
import router from "@/router";
import _sortBy from "lodash/sortBy";
import _map from "lodash/map";

const store = useMakruraStore();

const secret = ref<string>("");
const claimed = ref<boolean>();

const confirm = (msg: string) => window.confirm(msg);

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const uploadProof = async (e: any, element: any) => {
  const file = e.target.files[0];
  element.image = await toBase64(file);
  await store.update(element);
};

const removeProof = async (element: any) => {
  element.image = "";
  await store.update(element);
};

const rules = [
  (value: any) => {
    return (
      !value ||
      !value.length ||
      value[0].size < 500000 ||
      "Size of proof should be less than 500 KB!"
    );
  },
];
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet
        class="pa-8"
        elevation="5"
        style="min-height: 90vh"
        v-if="store.canEdit()">
        <v-btn
          prepend-icon="mdi-arrow-left"
          color="secondary"
          variant="text"
          @click="() => router.push('/makrura')"
          >Go Back</v-btn
        >
        <v-form>
          <v-row
            ><v-col cols="12" class="mt-5">
              <v-row>
                <v-col cols="8">
                  <img
                    style="vertical-align: middle"
                    width="48"
                    :src="makrura" />
                  <span
                    class="text-h5 font-weight-bold"
                    style="vertical-align: middle">
                    Makrura World Wide - Administrator
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-progress-linear
                indeterminate
                :style="{
                  visibility:
                    store.busy || store.pending ? 'visible' : 'hidden',
                }" />
              <v-table fixed-header density="comfortable">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 10px">#</th>
                    <th>Owner</th>
                    <th style="min-width: 150px">Location</th>
                    <th>Country</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th class="text-center text-no-wrap" style="width: 25px">
                      On Holiday?
                    </th>
                    <th class="text-center">Proof</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tr
                  v-for="(element, index) in _sortBy(
                    store.items.filter((m: any) => !m.secret),
                    'created',
                  )">
                  <td class="text-center">
                    <strong style="position: relative; bottom: 10px">{{
                      index + 1
                    }}</strong>
                  </td>
                  <td>
                    <v-text-field
                      variant="filled"
                      @blur="() => store.update(element)"
                      v-model="element.owner"></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      variant="filled"
                      @blur="() => store.update(element)"
                      v-model="element.location"></v-text-field>
                  </td>
                  <td>
                    <v-autocomplete
                      :items="
                        _map(countries, (v, k) => {
                          return {
                            text: v.name,
                            value: k,
                          };
                        })
                      "
                      item-title="text"
                      item-value="value"
                      variant="filled"
                      label="Country"
                      v-model="element.country"
                      @update:modelValue="() => store.update(element)" />
                  </td>
                  <td>
                    <v-text-field
                      variant="filled"
                      @blur="() => store.update(element)"
                      v-model="element.position.latitude"></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      variant="filled"
                      @blur="() => store.update(element)"
                      v-model="element.position.longitude"></v-text-field>
                  </td>
                  <td class="text-center">
                    <v-checkbox-btn
                      style="position: relative; bottom: 10px"
                      variant="tonal"
                      color="secondary"
                      class="d-inline-flex"
                      v-model="element.visit"
                      @change="() => store.update(element)"></v-checkbox-btn>
                  </td>
                  <td style="text-align: center">
                    <v-file-input
                      @change="(e: any) => uploadProof(e, element)"
                      variant="filled"
                      :rules="rules"
                      prepend-icon=""
                      accept="image/.jpg">
                      <template v-slot:prepend>
                        <a
                          :href="element.image"
                          target="_blank"
                          v-if="element.image">
                          <img
                            :src="element.image"
                            width="26px"
                            height="26px" />
                        </a>
                        <v-icon
                          size="x-large"
                          icon="mdi-image-remove-outline"
                          v-else
                          color="gray" />
                      </template>
                    </v-file-input>
                  </td>
                  <td>
                    <v-btn-group style="position: relative; bottom: 10px">
                      <v-btn
                        title="Delete Proof"
                        icon="mdi-file-document-remove-outline"
                        color="red-lighten-3"
                        variant="text"
                        size="large"
                        @click="
                          () => {
                            const d = confirm(
                              `This will remove the PROOF for '${element.owner}'. Are you sure?`,
                            );
                            if (d) {
                              removeProof(element);
                            }
                          }
                        " />
                      <v-btn
                        title="Delete Owner"
                        icon="mdi-delete-alert-outline"
                        color="red-lighten-1"
                        variant="text"
                        size="large"
                        @click="
                          () => {
                            const d = confirm(
                              `This will remove the owner '${element.owner}'. Are you sure?`,
                            );
                            if (d) {
                              store.remove(element);
                            }
                          }
                        " />
                    </v-btn-group>
                  </td>
                </tr>
              </v-table>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-btn @click="store.add" color="success" variant="tonal">
                Add MAKRURA
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>

      <v-sheet class="pa-8" elevation="5" style="min-height: 90vh" v-else>
        <v-btn
          prepend-icon="mdi-arrow-left"
          color="secondary"
          variant="text"
          @click="() => router.push('/makrura')"
          >Go Back</v-btn
        >
        <v-form>
          <v-row
            ><v-col cols="8">
              <div class="text-h5 font-weight-bold">
                Makrura World Wide - Administrator
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-icon
                style="font-size: 200px; width: 200px; height: 200px"
                size="x-large"
                color="grey"
                icon="mdi-alert-decagram-outline" />
              <div class="text-h4 text-red-lighten-2 my-3">
                Unable to administrate MAKRURAS
              </div>
              <div class="text-h5 text-grey">
                You can only administrate MAKRURAS if you are THE PRESIDENT.
              </div>
            </v-col>
            <v-col cols="12" class="text-center text-grey mt-5">
              <v-col cols="12">
                If <i>you</i> are the president, you can attempt to claim it.
              </v-col>
              <v-col cols="4" offset="4">
                <v-text-field
                  hide-details
                  label="Secret"
                  density="compact"
                  variant="underlined"
                  v-model="secret">
                  <template v-slot:append>
                    <v-btn
                      @click="async () => (claimed = await store.claim(secret))"
                      color="success"
                      variant="tonal"
                      prepend-icon="mdi-shield-lock-open-outline">
                      Claim
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-container>
  </main>
</template>
