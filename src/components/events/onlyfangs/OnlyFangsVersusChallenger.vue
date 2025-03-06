<script setup lang="ts">
import { Race, raceIcon } from "@/stores/races";
import banner_challenger from "@assets/versus/banner_challenger.png";
import { ref } from "vue";
import w3ciconDark from "@/assets/w3c_dark.png";
import { twitch } from "@/stores/onlyfangs.ts";

const raceColor: any = "#daa520";

interface Props {
  loading?: boolean;
  battleTag: string;
  banner?: string;
  streaming?: boolean;
}
const props = defineProps<Props>();

const openTwitch = (battleTag: string) =>
  window.open(`https://www.twitch.tv/${twitch[battleTag]}`, "_blank");
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
        <div class="ml-1 text-left text-h5">
          {{ battleTag }}
        </div>
      </template>
    </v-list-item>

    <v-img height="250" :src="banner ?? banner_challenger" cover></v-img>

    <v-card-item class="py-6">
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
          {{
            props.loading
              ? `Calculating w3c ladder stats for ${battleTag}...`
              : `No w3c ladder stats available for ${battleTag} yet!`
          }}
        </div>
      </v-card-subtitle>
    </v-card-item>

    <v-card-actions class="mt-5">
      <v-row>
        <v-col cols="6" class="text-center">
          <v-btn
            style="opacity: 0.2"
            title="Open W3Champions Profile Page"
            color="transparent"
            variant="flat"
            ><img :src="w3ciconDark" height="22px"
          /></v-btn>
        </v-col>
        <v-col cols="6" class="text-center">
          <v-btn
            title="Open Twitch Page"
            :class="streaming ? 'elementToFadeInAndOut' : ''"
            prepend-icon="mdi-twitch"
            :color="streaming ? 'purple' : 'disabled'"
            variant="text"
            @click="() => openTwitch(battleTag)"
            >Twitch</v-btn
          >
        </v-col>
      </v-row>
    </v-card-actions>
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

.elementToFadeInAndOut {
  -webkit-animation: fadeinout 3s linear infinite;
  animation: fadeinout 3s linear infinite;
  opacity: 0;
}

@-webkit-keyframes fadeinout {
  50% {
    opacity: 1;
  }
}

@keyframes fadeinout {
  50% {
    opacity: 1;
  }
}
</style>
