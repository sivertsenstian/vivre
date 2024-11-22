<script setup lang="ts">
import { Race, raceIcon } from "@/stores/races";
import banner_challenger from "@assets/versus/banner_challenger.png";
import axios from "axios";
import { ref } from "vue";
import { search } from "@/utilities/api.ts";

const raceColor: any = "#daa520";
const model = defineModel<string | null>();

interface Props {
  loading?: boolean;
}
const props = defineProps<Props>();

const searchResults = ref([]);
const searching = ref(false);

const getBattleTag = async (input: string) => {
  if (input.length < 3) {
    return;
  }

  try {
    searching.value = true;
    const { data: results } = await axios.get(search(input));
    searchResults.value = results;
  } catch (error) {
    console.log(error);
  } finally {
    searching.value = false;
  }
};
</script>

<template>
  <v-card
    color="surface"
    class="text-center pa-0 card-shine-effect"
    :elevation="10">
    <v-list-item class="px-3" :style="`background: ${raceColor}`">
      <template v-slot:prepend>
        <img
          style="vertical-align: middle"
          width="40px"
          :src="raceIcon[Race.Random]" />
      </template>
      <template v-slot:title>
        <div class="ml-1 text-left text-h5">A New Challenger ?</div>
      </template>
    </v-list-item>

    <v-img height="250" :src="banner_challenger" cover></v-img>

    <v-card-item class="py-0">
      <v-card-title>
        <span
          class="text-h3 fontweight-bold"
          style="color: goldenrod; vertical-align: middle"
          ><v-progress-circular
            :size="50"
            model-value="65"
            :indeterminate="loading">
            <v-icon size="x-small" icon="mdi-sword" />
          </v-progress-circular>
        </span>
      </v-card-title>
      <v-card-subtitle>
        <div
          class="text-subtitle-2 mt-5 text-wrap"
          style="vertical-align: middle; color: goldenrod">
          Add a challenger from the w3c ladder to compete against!
        </div>
      </v-card-subtitle>
    </v-card-item>

    <v-card-item class="py-4">
      <v-autocomplete
        :items="searchResults"
        :loading="searching"
        @input="(e: any) => getBattleTag(e.target.value)"
        clearable
        v-model="model as any"
        class="mx-auto"
        density="comfortable"
        placeholder="Search W3C for player..."
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        item-title="battleTag"
        item-value="battleTag"
        auto-select-first />
    </v-card-item>
  </v-card>
</template>

<style scoped>
@keyframes pulse {
  0% {
    border-color: white;
  }

  50% {
    border-color: goldenrod;
  }

  100% {
    border-color: white;
  }
}

.card-shine-effect {
  --shine-deg: 45deg;
  position: relative;
  overflow: hidden;
  border-radius: 0.875rem;
  border: 1px solid rgb(15 23 42);
  background-color: rgb(9 9 11);
  padding: 4rem 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 28rem;

  background-repeat: no-repeat;
  background-position:
    -100% 0,
    0 0;

  background-image: linear-gradient(
    var(--shine-deg),
    transparent 20%,
    transparent 40%,
    rgb(68, 68, 68, 0.2) 50%,
    rgb(68, 68, 68, 0.2) 55%,
    transparent 70%,
    transparent 100%
  );

  background-size:
    250% 250%,
    100% 100%;
  transition: background-position 0s ease;
}

.card-shine-effect:hover {
  background-position:
    200%0,
    0 0;
  transition-duration: 1.5s;
}
</style>
