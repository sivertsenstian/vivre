<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import _sample from "lodash/sample";
import ConfettiExplosion from "vue-confetti-explosion";
import _keys from "lodash/keys";

const toImg = (instruction: string) => {
  return `/icons/btn${String(instruction ?? "")
    .replace(/ /g, "")
    .replace(/\//g, "")
    .replace(/’/g, "")
    .replace(/'/g, "")
    .toLowerCase()}.jpg`;
};

const toInstruction = (puzzle: string[]) => {
  return puzzle?.join(" ") ?? "";
};

const hotkeys: any = {
  Wisp: {
    NightElfBuild: "Q",
    "Moon Well": "Q",
    "Hunters Hall": "E",
    "Ancient Of War": "W",
    "Altar Of Elders": "S",
    "Tree Of Life": "Z",
    "Ancient Protector": "A",
    "Ancient Of Lore": "D",
    "Ancient Of Wind": "F",
    "Chimaera Roost": "X",
    "Ancient Of Wonders": "C",
  },
  "Ancient Of War": {
    Archer: "Q",
    Huntress: "W",
    "Glaive Thrower": "E",
    Marksmanship: "Z",
    "Moon Glaive": "X",
    "Improved Bows": "A",
    Sentinel: "S",
    "Vorpal Blades": "D",
    Uproot: "R",
  },
  "Druid Of The Claw": {
    Roar: "R",
    Rejuvenation: "Q",
    "Bear Form": "W",
  },
};

const tests = [
  ..._keys(hotkeys.Wisp)
    .filter((k) => k !== "NightElfBuild")
    .map((k) => ({
      target: "Wisp",
      puzzle: ["NightElfBuild", k],
    })),
  ..._keys(hotkeys["Ancient Of War"]).map((k) => ({
    target: "Ancient Of War",
    puzzle: [k],
  })),
  ..._keys(hotkeys["Druid Of The Claw"]).map((k) => ({
    target: "Druid Of The Claw",
    puzzle: [k],
  })),
];

const test = ref<any>({});

const highscore = ref(0);
const points = ref(0);
const combo = ref(0);
const comboGoal = ref(5);
const solved = ref(false);

const queue = ref<string[]>([]);
const captured = ref<string>();

const next = () => {
  test.value = _sample(
    tests.filter((t) => t.puzzle.some((p, i) => p !== test.value?.puzzle?.[i])),
  );
};

const answer = computed(
  () =>
    test.value?.puzzle.map((p: string) => hotkeys[test.value.target][p]) ?? [],
);

const captureInput = (event: KeyboardEvent) => {
  event.preventDefault();

  captured.value = event.key.toUpperCase();
  queue.value.push(event.key.toUpperCase());

  // SOLVED
  if (
    answer.value.length === queue.value.length &&
    queue.value.every((v, i) => v === answer.value[i])
  ) {
    solved.value = true;
    setTimeout(() => {
      points.value += 1;
      captured.value = undefined;
      queue.value = [];
      solved.value = false;

      next();

      if (points.value > highscore.value) {
        highscore.value = points.value;
      }
    }, 500);
  }

  // INCORRECT
  if (queue.value.some((v, i) => v !== answer.value[i])) {
    setTimeout(() => {
      points.value = 0;
      captured.value = undefined;
      queue.value = [];
      combo.value = 0;
      comboGoal.value = 5;

      next();
    }, 500);
  } else {
    // CORRECT
    combo.value++;

    if (combo.value === comboGoal.value) {
      points.value *= 2;
      combo.value = 0;
      comboGoal.value *= 2;
    }
  }
};

window.addEventListener("keydown", (event) => event.preventDefault());
window.addEventListener("keyup", captureInput);

onMounted(() => {
  next();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet class="pa-6" elevation="10" style="min-height: 90vh">
        <v-row>
          <v-col cols="6" offset="3" class="text-center">
            <h1>Hotkey Storm, Earth & Fire!</h1>
          </v-col>
          <v-col cols="3" class="text-right">
            <h2 class="font-weight-bold">
              Highscore:
              <span class="text-orange font-weight-bold mt-2">{{
                highscore
              }}</span>
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" offset="4" class="text-center">
            <h2>
              Use <span class="text-primary">{{ test.target }}</span> to
              <span class="text-secondary">{{
                toInstruction(test.puzzle)
              }}</span>
            </h2>
            <v-img
              :src="toImg(test.target)"
              width="48"
              class="mx-auto mt-5"
              style="left: 8px" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" offset="4" class="text-center">
            <div v-for="(command, i) in test.puzzle" class="d-inline-flex">
              <v-img
                :src="toImg(command)"
                width="42"
                class="ml-4"
                :style="{
                  filter:
                    hotkeys?.[test.target]?.[command]?.toLowerCase() !==
                    queue?.[i]?.toLowerCase()
                      ? 'brightness(1.0)'
                      : 'brightness(1.5)',
                }" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" offset="4" class="text-center">
            <div v-if="!queue.length">
              <h2 class="text-grey elementToFadeInAndOut">
                waiting for key...
              </h2>
            </div>
            <div v-for="(key, i) in queue" class="d-inline-flex" v-else>
              <h2
                :class="{
                  'text-success': key === answer[i],
                  'text-error wrong': key !== answer[i],
                  'font-weight-bold ml-2': true,
                }">
                {{ key }}
              </h2>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center"
            ><h1 style="font-weight: bold">
              Points:
              <span style="color: gold; font-weight: bold">{{ points }}</span>
              <ConfettiExplosion
                v-if="solved"
                :particleCount="50"
                :particleSize="10"
                :duration="2000"
                :force="0.3"
                :stageWidth="350"
                :stageHeight="350"
                style="position: relative; left: 50%; bottom: 30px"
                :colors="['goldenrod', 'darkgoldenrod', 'silver', 'gold']" />
            </h1>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col offset="8" cols="4">
                <span class="text-grey font-weight-bold mr-2">{{ combo }}</span>
                <span class="text-grey">COMBO</span>
                <v-progress-linear
                  :height="20"
                  rounded="sm"
                  color="orange"
                  :model-value="combo"
                  :max="comboGoal" />
                <v-progress-linear
                  chunk-gap="10"
                  chunk-width="120"
                  style="margin-top: 5px"
                  :height="10"
                  color="green"
                  :model-value="comboGoal / 5 - 1"
                  :max="4" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12"> (TEST) Current Available Key Bindings (TEST)</v-col>
          <v-col cols="12">
            <pre>{{ hotkeys }}</pre>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
<style>
.wrong {
  position: relative;
  animation: pulse 0.2s infinite;
}

@keyframes pulse {
  0% {
    bottom: 3px;
  }

  50% {
    bottom: -3px;
  }

  100% {
    bottom: 3px;
  }
}

.elementToFadeInAndOut {
  -webkit-animation: fadeinout 4s linear infinite;
  animation: fadeinout 4s linear infinite;
  opacity: 0.4;
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
