<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import _sample from 'lodash/sample';
import ConfettiExplosion from 'vue-confetti-explosion';
import _keys from 'lodash/keys';
import moment from 'moment';

const toImg = (instruction: string) => {
  return `/icons/btn${String(instruction ?? '')
    .replace(/ /g, '')
    .replace(/\//g, '')
    .replace(/’/g, '')
    .replace(/'/g, '')
    .toLowerCase()}.jpg`;
};

const toInstruction = (puzzle: string[]) => {
  return puzzle?.join(' ') ?? '';
};

const items: any = {
  L1: ['Scroll Of Town Portal'],
  R1: ['Staff Of Preservation', 'Rod Of Necromancy'],
  R2: ['Potion Of Healing', 'Scroll Of Healing'],
};

const hotkeys: any = {
  TargetDummy: 'TargetDummy',
  Inventory: {
    L1: 'ALT + Q',
    // L2: 'ALT + A',
    // L3: 'ALT + Z',
    R1: 'ALT + W',
    R2: 'ALT + S',
    // R3: 'ALT + X',
  },
  Wisp: {
    Renew: 'R',
    Detonate: 'E',
    NightElfBuild: 'Q',
    'Moon Well': 'Q',
    'Hunters Hall': 'E',
    'Ancient Of War': 'W',
    'Altar Of Elders': 'S',
    'Tree Of Life': 'Z',
    'Ancient Protector': 'A',
    'Ancient Of Lore': 'D',
    'Ancient Of Wind': 'F',
    'Chimaera Roost': 'X',
    'Ancient Of Wonders': 'C',
  },
  'Ancient Of War': {
    Archer: 'Q',
    Huntress: 'W',
    'Glaive Thrower': 'E',
    Marksmanship: 'Z',
    'Moon Glaive': 'X',
    'Improved Bows': 'A',
    Sentinel: 'S',
    'Vorpal Blades': 'D',
    Uproot: 'R',
  },
  'Druid Of The Claw': {
    Roar: 'R',
    Rejuvenation: 'Q',
    'Bear Form': 'W',
  },
  Dryad: { 'Abolish Magic': 'Q' },
  'Keeper Of The Grove': {
    'Entangling Roots': 'Q',
    'Force Of Nature': 'W',
    Tranquility: 'R',
  },
};

const getItemPuzzle = (item: string) => {
  switch (item) {
    case 'Scroll Of Town Portal':
    case 'Rod Of Necromancy':
    case 'Staff Of Preservation':
      return [item, 'TargetDummy'];
    default:
      return [item];
  }
};

const tests = [
  ..._keys(hotkeys.Wisp)
    .filter((k) => k !== 'NightElfBuild')
    .map((k) => ({
      target: 'Wisp',
      puzzle:
        k === 'Renew' || k === 'Detonate'
          ? [k, 'TargetDummy']
          : ['NightElfBuild', k],
    })),
  ..._keys(hotkeys['Ancient Of War']).map((k) => ({
    target: 'Ancient Of War',
    puzzle: [k],
  })),
  ..._keys(hotkeys['Druid Of The Claw']).map((k) => ({
    target: 'Druid Of The Claw',
    puzzle: k === 'Rejuvenation' ? [k, 'TargetDummy'] : [k],
  })),
  ..._keys(hotkeys['Dryad']).map((k) => ({
    target: 'Dryad',
    puzzle: [k, 'TargetDummy'],
  })),
  ..._keys(hotkeys['Keeper Of The Grove']).map((k) => ({
    target: 'Keeper Of The Grove',
    puzzle: k === 'Tranquility' ? [k] : [k, 'TargetDummy'],
  })),
  ..._keys(hotkeys['Inventory']).map((k) => ({
    target: 'Inventory',
    position: k,
    puzzle: getItemPuzzle(_sample(items?.[k])),
  })),
];

const timer = ref(moment.duration(3, 'minutes'));

const test = ref<any>({});
const history = ref<any[]>([]);

const highscore = ref(0);
const points = ref(0);
const combo = ref(0);
const comboGoal = ref(5);
const comboStreak = ref(0);
const solved = ref(false);
const reward = ref(0);

const queue = ref<string[]>([]);
const captured = ref<string>();

const next = () => {
  test.value = _sample(
    tests.filter((t) => t.puzzle.some((p, i) => p !== test.value?.puzzle?.[i])),
  );
};

const answer = computed(
  () =>
    test.value?.puzzle?.map(
      (p: string) =>
        hotkeys[test.value.target]?.[p] ??
        hotkeys[p] ??
        hotkeys.Inventory[test.value?.position],
    ) ?? [],
);

const showTarget = computed(() => {
  return (
    queue.value?.every((q, i) => q === answer.value?.[i]) &&
    answer.value?.[queue.value?.length] === 'TargetDummy'
  );
});

const step = () => {
  // SOLVED
  if (
    answer.value.length === queue.value.length &&
    queue.value.every((v, i) => v === answer.value[i])
  ) {
    solved.value = true;
    history.value.push({
      success: true,
      puzzle: test.value,
      actual: queue.value,
      answer: answer.value,
    });
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
    history.value.push({
      success: false,
      puzzle: test.value,
      actual: answer.value,
      answer: queue.value,
    });

    setTimeout(() => {
      points.value = 0;
      captured.value = undefined;
      queue.value = [];
      combo.value = 0;
      comboGoal.value = 5;
      comboStreak.value = 0;
      next();
    }, 500);
    timer.value.subtract(10, 'seconds');
    reward.value = -10;
    setTimeout(() => {
      reward.value = 0;
    }, 1000);
  } else {
    // CORRECT
    combo.value++;

    if (combo.value === comboGoal.value) {
      comboStreak.value++;
      let seconds;
      switch (comboStreak.value) {
        case 1:
          seconds = 3;
          comboGoal.value = 12;
          break;
        case 2:
          seconds = 5;
          comboGoal.value = 20;
          break;
        case 3:
          seconds = 7;
          comboGoal.value = 30;
          break;
        case 4:
          seconds = 7;
          comboGoal.value = 10;
          break;
        default:
          seconds = 10;
          comboGoal.value = 10;
          break;
      }
      reward.value = seconds;
      setTimeout(() => {
        reward.value = 0;
      }, 1000);
      combo.value = 0;
      timer.value.add(seconds, 'seconds');
    }
  }
};

const captureInput = (event: KeyboardEvent) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (['Control', 'Alt', 'Shift'].some((v) => v === event.key)) {
    return;
  }

  if (!interval.value) {
    start();
  }

  let capture = '';

  if (event.ctrlKey) {
    capture += 'CTRL + ';
  }

  if (event.altKey) {
    capture += 'ALT + ';
  }

  if (event.shiftKey) {
    capture += 'SHIFT + ';
  }

  capture += event.key.toUpperCase();

  captured.value = capture;
  queue.value.push(capture);

  step();
};

window.addEventListener('keydown', (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
});

window.addEventListener('keyup', captureInput);
window.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  queue.value.push('Miss');
  step();
});

const interval = ref();
const stop = () => {
  clearInterval(interval.value);
  history.value = [];
  test.value = {};
  timer.value = moment.duration(3, 'minutes');
  next();
};

const start = () => {
  clearInterval(interval.value);
  timer.value = moment.duration(3, 'minutes');
  interval.value = setInterval(() => {
    timer.value.subtract(1, 'second');
    if (timer.value.asSeconds() <= 0) {
      stop();
    }
  }, 1000);
};

const hit = (event: PointerEvent) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  // Get the position of the element relative to the viewport
  const rect = (event.target as any)?.getBoundingClientRect();

  // Calculate the relative coordinates
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (x >= 40 && x <= 60 && y >= 30 && y <= 50) {
    queue.value.push('TargetDummy');
  } else {
    queue.value.push('Miss');
  }

  step();
};

onMounted(() => {
  next();
});
</script>

<template>
  <main style="height: 100vh; overflow-y: auto" class="game">
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
            <h2 class="text-no-wrap">
              Use <span class="text-primary">{{ test.target }}</span> to
              <span class="text-secondary">{{
                toInstruction(test.puzzle)
              }}</span>
            </h2>
            <v-img
              v-if="test.target !== 'Inventory'"
              :src="toImg(test.target)"
              width="48"
              class="mx-auto mt-5"
              style="left: 8px" />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="4"
            offset="4"
            class="text-center d-inline-flex justify-center align-center">
            <div v-for="(command, i) in test.puzzle" class="d-inline-flex">
              <v-table
                class="pa-0"
                v-if="test.target === 'Inventory' && command !== 'TargetDummy'">
                <tbody>
                  <tr>
                    <td
                      style="border: 1px solid black; height: 42px; width: 42px"
                      class="pa-0 ma-0">
                      <v-img
                        v-if="test.position === 'L1'"
                        :src="toImg(command)"
                        width="42"
                        :style="{
                          filter:
                            (
                              hotkeys?.[test.target]?.[command] ??
                              hotkeys?.[command]
                            )?.toLowerCase() !== queue?.[i]?.toLowerCase()
                              ? 'brightness(1.0)'
                              : 'brightness(1.5)',
                        }" />
                      <v-img
                        v-else
                        src="/empty_inventory.jpg"
                        width="42"
                        height="42" />
                    </td>
                    <td
                      style="border: 1px solid black; height: 42px; width: 42px"
                      class="pa-0 ma-0">
                      <v-img
                        v-if="test.position === 'R1'"
                        :src="toImg(command)"
                        width="42"
                        :style="{
                          filter:
                            (
                              hotkeys?.[test.target]?.[command] ??
                              hotkeys?.[command]
                            )?.toLowerCase() !== queue?.[i]?.toLowerCase()
                              ? 'brightness(1.0)'
                              : 'brightness(1.5)',
                        }" />
                      <v-img
                        v-else
                        src="/empty_inventory.jpg"
                        width="42"
                        height="42" />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border: 1px solid black; height: 42px; width: 42px"
                      class="pa-0 ma-0">
                      <v-img
                        v-if="test.position === 'L2'"
                        :src="toImg(command)"
                        width="42"
                        :style="{
                          filter:
                            (
                              hotkeys?.[test.target]?.[command] ??
                              hotkeys?.[command]
                            )?.toLowerCase() !== queue?.[i]?.toLowerCase()
                              ? 'brightness(1.0)'
                              : 'brightness(1.5)',
                        }" />
                      <v-img
                        v-else
                        src="/empty_inventory.jpg"
                        width="42"
                        height="42" />
                    </td>
                    <td
                      style="border: 1px solid black; height: 42px; width: 42px"
                      class="pa-0 ma-0">
                      <v-img
                        v-if="test.position === 'R2'"
                        :src="toImg(command)"
                        width="42"
                        :style="{
                          filter:
                            (
                              hotkeys?.[test.target]?.[command] ??
                              hotkeys?.[command]
                            )?.toLowerCase() !== queue?.[i]?.toLowerCase()
                              ? 'brightness(1.0)'
                              : 'brightness(1.5)',
                        }" />
                      <v-img
                        v-else
                        src="/empty_inventory.jpg"
                        width="42"
                        height="42" />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="border: 1px solid black; height: 42px; width: 42px"
                      class="pa-0 ma-0">
                      <v-img
                        src="/empty_inventory.jpg"
                        width="42"
                        height="42" />
                    </td>
                    <td
                      style="border: 1px solid black; height: 42px; width: 42px"
                      class="pa-0 ma-0">
                      <v-img
                        src="/empty_inventory.jpg"
                        width="42"
                        height="42" />
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-img
                v-else
                :src="toImg(command)"
                width="42"
                class="ml-4 my-auto"
                :style="{
                  filter:
                    (
                      hotkeys?.[test.target]?.[command] ?? hotkeys?.[command]
                    )?.toLowerCase() !== queue?.[i]?.toLowerCase()
                      ? 'brightness(1.0)'
                      : 'brightness(1.5)',
                }" />
            </div>
            <div
              v-if="showTarget"
              @click="(e: any) => hit(e)"
              :style="
                Math.random() < 0.5
                  ? {
                      position: 'fixed',
                      display: 'block',
                      left: `${Math.floor(Math.random() * (500 - 250 + 1)) + 250}px`,
                      bottom: `calc(100vh - ${Math.floor(Math.random() * (500 - 250 + 1)) + 100}px`,
                    }
                  : {
                      position: 'fixed',
                      display: 'block',
                      right: `${Math.floor(Math.random() * (500 - 250 + 1)) + 250}px`,
                      top: `${Math.floor(Math.random() * (500 - 250 + 1)) + 100}px`,
                    }
              ">
              <v-img src="/target.png" width="96" />
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
                <v-icon
                  style="font-size: 24px"
                  v-if="key === 'TargetDummy' || key === 'Miss'"
                  icon="mdi-bullseye-arrow"
                  :color="key === 'TargetDummy' ? 'success' : 'error'" />
                <template v-else>{{ key }}</template>
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
              <v-col offset="8" cols="4" class="text-center">
                <span style="font-family: fantasy; font-size: 64px">
                  {{ (timer as any).format('mm : ss', { trim: false }) }}
                </span>
                <span
                  v-if="reward !== 0"
                  :class="{
                    'fade-out': true,
                    'text-success': reward > 0,
                    'text-error': reward < 0,
                  }"
                  style="
                    height: 0;
                    display: block;
                    font-size: 96px;
                    font-weight: bold;
                    font-family: fantasy;
                    position: relative;
                    right: 10px;
                    bottom: 210px;
                  ">
                  {{ reward < 0 ? '-' : '+' }}{{ reward }}
                </span>
              </v-col>
            </v-row>
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
                  :model-value="comboStreak"
                  :max="4" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12"> (TEST) Current Available Key Bindings (TEST)</v-col>
          <v-col cols="6">
            <pre>{{ hotkeys }}</pre>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
<style>
.game {
  cursor: crosshair;
}

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

.fade-out {
  -webkit-animation: fadeinout 1s linear 1;
  animation: fadeinout 1s linear 1;
  opacity: 0;
}

@-webkit-keyframes fadeout {
  100% {
    opacity: 1;
  }
}
</style>
