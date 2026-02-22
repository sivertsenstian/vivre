<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import _sample from 'lodash/sample';
import ConfettiExplosion from 'vue-confetti-explosion';
import moment from 'moment';
import Command from './components/Command.vue';
import {
  actionToName,
  Basic,
  createPuzzles,
  night_elf_actions,
} from './utilities/actions';
import { layouts } from './utilities/data';
import { useHotKeyStormStore } from '@/games/hotkeystorm/store.ts';
import InventoryCommand from '@/games/hotkeystorm/components/InventoryCommand.vue';
import { getIconUrl } from '@/utilities/api.ts';
import _keys from 'lodash/keys';
import RaceIcon from '@/components/RaceIcon.vue';
import { Race } from '@/stores/races.ts';
import correctAudio from './sounds/correct.mp3';
import solvedAudio from './sounds/solved.mp3';
import incorrectAudio from './sounds/incorrect.mp3';
import doneAudio from './sounds/done.mp3';
import startAudio from './sounds/start.mp3';
import EditInventoryInput from '@/games/hotkeystorm/components/EditInventoryInput.vue';

const store = useHotKeyStormStore();

const toInstruction = (actions: string[]) => {
  const a = actions?.map(actionToName).join(' ') ?? '';
  if (actions?.some((a) => a === 'TARGETDUMMY')) {
    return `Cast ${a}`;
  }

  return a;
};

const audio = {
  correct: new Audio(correctAudio),
  incorrect: new Audio(incorrectAudio),
  solved: new Audio(solvedAudio),
  done: new Audio(doneAudio),
  start: new Audio(startAudio),
};

const puzzles = _keys(night_elf_actions).map(createPuzzles).flat();
const timer = ref(moment.duration(2, 'minutes'));

enum Status {
  Play = 'Play',
  Waiting = 'Waiting',
  Finished = 'Finished',
}

enum Mode {
  Learning = 'Learning',
  Challenge = 'Challenge',
}

const status = ref(Status.Waiting);
const mode = ref(Mode.Challenge);
const hint = ref(false);

const editInventory = ref(false);

const puzzle = ref<any>({});
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
  hint.value = false;
  puzzle.value = _sample(
    puzzles.filter((t) =>
      t.actions?.some(
        (p: string, i: number) => p !== puzzle.value?.actions?.[i],
      ),
    ),
  );
};

const answer = computed(() => {
  return (
    puzzle.value?.actions?.map((a: string) =>
      store.getHotkeyFromAction(puzzle.value.name, a),
    ) ?? []
  );
});

const showTarget = computed(() => {
  return (
    queue.value?.every((q, i) => q === answer.value?.[i]) &&
    answer.value?.[queue.value?.length] === Basic.TargetDummy
  );
});

const step = () => {
  // Cancel Dodge MISS event on step
  if (dodgetimeout.value) {
    clearTimeout(dodgetimeout.value);
  }

  // SOLVED
  if (
    answer.value.length === queue.value.length &&
    queue.value.every((v, i) => v === answer.value[i])
  ) {
    audio.solved.play();

    solved.value = true;

    // Record for summary
    history.value.push({
      success: true,
      puzzle: puzzle.value,
      actual: queue.value,
      answer: answer.value,
    });

    setTimeout(() => {
      captured.value = undefined;
      queue.value = [];
      solved.value = false;

      next();

      if (mode.value === Mode.Challenge) {
        points.value += 1;
        if (points.value > highscore.value) {
          highscore.value = points.value;
        }
      }
    }, 500);
  }

  // INCORRECT
  if (queue.value.some((v, i) => v !== answer.value[i])) {
    audio.incorrect.play();

    history.value.push({
      success: false,
      puzzle: puzzle.value,
      actual: answer.value,
      answer: queue.value,
    });

    if (mode.value === Mode.Challenge) {
      setTimeout(() => {
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
      setTimeout(() => {
        hint.value = true;
        captured.value = undefined;
        queue.value = [];
      }, 500);
    }
  } else {
    audio.correct.play();
    // CORRECT
    if (mode.value === Mode.Challenge) {
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
  }
};

const captureInput = (event: KeyboardEvent) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (status.value !== Status.Play) {
    return;
  }

  if (['Control', 'Alt', 'Shift'].some((v) => v === event.key)) {
    return;
  }

  if (!interval.value && mode.value === Mode.Challenge) {
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

  capture += event.code.toLowerCase().startsWith('numpad')
    ? event.code.toUpperCase()
    : event.key.toUpperCase();

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
  if (status.value !== Status.Play) {
    return;
  }

  queue.value.push(Basic.Miss);
  step();
});

const interval = ref();

const stop = () => {
  // reset ?
  points.value = 0;
  captured.value = undefined;
  queue.value = [];
  combo.value = 0;
  comboGoal.value = 5;
  comboStreak.value = 0;

  audio.done.play();
  status.value = Status.Finished;
  clearInterval(interval.value);
  history.value = [];
  puzzle.value = {};
  timer.value = moment.duration(2, 'minutes');
  next();
};

const start = () => {
  audio.start.play();
  status.value = Status.Play;
  clearInterval(interval.value);
  timer.value = moment.duration(2, 'minutes');
  next();

  if (mode.value === Mode.Challenge) {
    interval.value = setInterval(() => {
      timer.value.subtract(1, 'second');
      if (timer.value.asSeconds() <= 0) {
        stop();
      }
    }, 1000);
  }
};

const restart = () => {
  stop();
  start();
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
    queue.value.push(Basic.TargetDummy);
  } else {
    queue.value.push(Basic.Miss);
  }

  step();
};

const dodgetimeout = ref();
const dodge = () => {
  if (dodgetimeout.value) {
    clearTimeout(dodgetimeout.value);
  }

  dodgetimeout.value = setTimeout(
    () => {
      queue.value.push(Basic.MissileDodge);
      dodgetimeout.value = setTimeout(() => {
        queue.value.push(Basic.Miss);
        setTimeout(step, 750);
      }, 750);
    },
    Math.floor(Math.random() * (2000 - 500 + 1)) + 500,
  );
};
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet
        class="pa-6"
        elevation="10"
        style="min-height: 85vh; overflow: hidden">
        <v-row>
          <v-col class="game-container" cols="8">
            <template v-if="status === Status.Play">
              <v-row>
                <v-col cols="12" class="text-center">
                  <h2 class="text-no-wrap">
                    <v-img
                      v-if="!puzzle.name?.toLowerCase().startsWith('item')"
                      :src="getIconUrl(puzzle.name)"
                      width="48"
                      class="mx-auto mb-2"
                      style="left: 8px" />
                    <span class="text-primary font-weight-bold"
                      >{{ puzzle.name }}:
                    </span>
                    <span class="text-secondary">{{
                      toInstruction(puzzle.actions)
                    }}</span>
                  </h2>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  class="text-center d-inline-flex justify-center align-center">
                  <div
                    v-for="(action, i) in puzzle.actions"
                    class="d-inline-flex">
                    <inventory-command
                      v-if="
                        puzzle.name?.toLowerCase().startsWith('item') &&
                        action !== Basic.TargetDummy &&
                        action !== Basic.MissileDodge
                      "
                      :name="puzzle.name"
                      :action="action"
                      :current="queue?.[i]" />
                    <command
                      v-else
                      :name="puzzle.name"
                      :action="action"
                      :current="queue?.[i]"
                      :queue="queue"
                      :callback="dodge" />
                  </div>
                  <div
                    v-if="showTarget"
                    @click="(e: any) => hit(e)"
                    :style="
                      Math.random() < 0.5
                        ? {
                            position: 'fixed',
                            display: 'block',
                            left: `${Math.floor(Math.random() * (400 - 100 + 1)) + 100}px`,
                            bottom: `calc(100vh - ${Math.floor(Math.random() * (650 - 100 + 1)) + 100}px`,
                          }
                        : {
                            position: 'fixed',
                            display: 'block',
                            left: `${Math.floor(Math.random() * (1050 - 750 + 1)) + 750}px`,
                            bottom: `calc(100vh - ${Math.floor(Math.random() * (650 - 100 + 1)) + 100}px`,
                          }
                    ">
                    <v-img src="/target.png" width="96" />
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-center">
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
                        v-if="key === Basic.TargetDummy || key === Basic.Miss"
                        icon="mdi-bullseye-arrow"
                        :color="
                          key === Basic.TargetDummy ? 'success' : 'error'
                        " />
                      <v-icon
                        style="font-size: 24px"
                        v-else-if="key === Basic.MissileDodge"
                        icon="mdi-clock"
                        color="success" />
                      <template v-else>{{ key }}</template>
                    </h2>
                  </div>
                  <ConfettiExplosion
                    v-if="solved"
                    :particleCount="50"
                    :particleSize="10"
                    :duration="2000"
                    :force="0.3"
                    :stageWidth="350"
                    :stageHeight="350"
                    style="position: relative; left: 50%; top: 50px"
                    :colors="[
                      'goldenrod',
                      'darkgoldenrod',
                      'silver',
                      'gold',
                    ]" />
                </v-col>
                <v-col cols="12" class="text-center" v-if="hint">
                  <span
                    class="text-orange font-weight-bold"
                    style="vertical-align: text-bottom"
                    >HINT:
                  </span>
                  <div
                    v-for="key in answer.filter((a) =>
                      [Basic.TargetDummy, Basic.Miss, Basic.MissileDodge].every(
                        (v) => a !== v,
                      ),
                    )"
                    class="d-inline-flex">
                    <h2 class="font-weight-bold ml-2 text-primary">
                      {{ key }}
                    </h2>
                  </div>
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-alert
                color="primary"
                class="text-center"
                variant="tonal"
                height="375">
                <v-icon icon="mdi-weather-lightning" style="font-size: 128px" />
                <h2 class="mt-2">
                  Welcome to
                  <span class="font-weight-bold text-orange">Hotkey Storm</span>
                  - The Hotkey training game!
                </h2>
                <h2 class="mt-2">
                  Can you reach the leaderboard and become APM king? Let's find
                  out!
                </h2>
                <h2 class="mt-2">
                  Configure your hotkeys and select a challenge on the right to
                  start practicing!
                </h2>
              </v-alert>
            </template>
          </v-col>
          <v-col
            cols="4"
            style="cursor: default; min-height: 90vh"
            @click="
              (e: any) => {
                e.preventDefault();
                e.stopImmediatePropagation();
              }
            ">
            <v-row>
              <template v-if="status === Status.Play">
                <v-col
                  cols="12"
                  :class="{
                    'text-center': true,
                    challenge: mode === Mode.Challenge,
                    learning: mode === Mode.Learning,
                  }"
                  ><h1 style="font-weight: bold">
                    <v-icon
                      icon="mdi-weather-lightning"
                      size="128"
                      :class="{ 'mr-6': true, solved: solved }" />
                    <span
                      style="
                        color: gold;
                        font-weight: bold;
                        font-size: 64px;
                        vertical-align: middle;
                      "
                      >{{ points }}</span
                    >
                  </h1>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="12" class="text-center"
                  ><h1 style="font-weight: bold; color: orange">
                    Hotkey Storm
                  </h1>
                </v-col>
                <v-col cols="7">
                  <v-select
                    hide-details
                    :items="layouts"
                    density="compact"
                    label="Hotkey layout"
                    v-model="store.data.selected"></v-select>
                </v-col>
                <v-col cols="5">
                  <v-btn
                    block
                    :variant="editInventory ? 'elevated' : 'tonal'"
                    rounded="0"
                    :color="editInventory ? 'success' : 'default'"
                    class="py-5"
                    @click="editInventory = !editInventory"
                    >{{
                      editInventory ? 'Save Changes' : 'Inventory Hotkeys'
                    }}</v-btn
                  >
                </v-col>
              </template>
            </v-row>
            <template v-if="!editInventory && status !== Status.Play">
              <v-row style="margin-bottom: 10vh">
                <v-col cols="6" class="text-center">
                  <table>
                    <tbody>
                      <tr>
                        <td style="width: 64px; height: 64px">
                          <v-btn
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%"
                            disabled>
                            <race-icon :race="Race.Human" :size="84" />
                          </v-btn>
                        </td>
                        <td style="width: 64px; height: 64px">
                          <v-btn
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%"
                            disabled>
                            <race-icon :race="Race.Orc" :size="84" />
                          </v-btn>
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 64px; height: 64px">
                          <v-btn
                            @click="start"
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%">
                            <race-icon :race="Race.NightElf" :size="84" />
                          </v-btn>
                        </td>
                        <td style="width: 64px; height: 64px">
                          <v-btn
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%"
                            disabled>
                            <race-icon :race="Race.Undead" :size="84" />
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 style="font-weight: bold">
                    Race
                    {{ mode === Mode.Challenge ? 'Challenge' : 'Practice' }}
                  </h3>
                </v-col>
                <v-col cols="6" class="text-center">
                  <v-btn
                    rounded="0"
                    variant="tonal"
                    style="width: 100%; height: 172px"
                    disabled>
                    <race-icon :race="Race.Random" :size="84" />
                  </v-btn>
                  <h3 class="font-weight-bold">
                    Custom
                    {{ mode === Mode.Challenge ? 'Challenge' : 'Practice' }}
                  </h3>
                </v-col>
                <v-col cols="12" class="text-center mt-5">
                  <h3
                    :class="{
                      'text-orange': mode === Mode.Challenge,
                      'text-success': mode === Mode.Learning,
                      'font-weight-bold': true,
                    }">
                    Select a
                    {{ mode === Mode.Challenge ? 'challenge' : 'practice' }} to
                    begin
                  </h3>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn
                    @click="
                      mode =
                        mode === Mode.Learning ? Mode.Challenge : Mode.Learning
                    "
                    size="large"
                    :color="mode === Mode.Learning ? 'warning' : 'success'"
                    >{{
                      mode === Mode.Learning
                        ? 'Activate Challenge Mode'
                        : 'Activate Practice Mode'
                    }}</v-btn
                  >
                </v-col>
              </v-row>
            </template>
            <template v-else-if="editInventory">
              <v-row>
                <v-col cols="12" class="text-center">
                  <h3>Override Inventory Hotkeys</h3>
                </v-col>
                <v-col cols="12">
                  <p style="color: grey; font-size: 11px">
                    You can override any inventory keys to mirror an external
                    app - and not by the customkeys hotkey layout file. Some
                    keys may not function properly due to limitations in how the
                    browser handles keyboard input.
                  </p>
                  <p style="color: grey; font-size: 11px" class="my-1">
                    This can occur when specific keys are reserved by the
                    browser itself - like CTRL + W (close tab), CTRL + T (open
                    new tab) and others..
                  </p>
                  <p
                    style="
                      color: orange;
                      font-size: 11px;
                      font-weight: bold;
                      text-align: center;
                    ">
                    There is currently no workaround for this - so avoid using
                    these as your inventory keys!
                  </p>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-table>
                    <thead>
                      <tr>
                        <td class="font-weight-bold">KEY</td>
                        <td style="width: 100px"></td>
                        <td class="font-weight-bold">KEY</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <edit-inventory-input code="itm1" />
                        </td>
                        <td
                          class="d-flex"
                          style="justify-content: center; align-items: center">
                          <v-img
                            src="/empty_inventory.jpg"
                            height="42"
                            width="42" />
                          <v-img
                            src="/empty_inventory.jpg"
                            height="42"
                            width="42" />
                        </td>
                        <td><edit-inventory-input code="itm2" /></td>
                      </tr>
                      <tr>
                        <td><edit-inventory-input code="itm3" /></td>
                        <td
                          class="d-flex"
                          style="justify-content: center; align-items: center">
                          <v-img
                            src="/empty_inventory.jpg"
                            height="42"
                            width="42" />
                          <v-img
                            src="/empty_inventory.jpg"
                            height="42"
                            width="42" />
                        </td>
                        <td><edit-inventory-input code="itm4" /></td>
                      </tr>
                      <tr>
                        <td><edit-inventory-input code="itm5" /></td>
                        <td
                          class="d-flex"
                          style="justify-content: center; align-items: center">
                          <v-img
                            src="/empty_inventory.jpg"
                            height="42"
                            width="42" />
                          <v-img
                            src="/empty_inventory.jpg"
                            height="42"
                            width="42" />
                        </td>
                        <td><edit-inventory-input code="itm6" /></td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </template>
            <v-row
              :class="{
                challenge: mode === Mode.Challenge,
                learning: mode === Mode.Learning,
              }">
              <v-col cols="12" class="text-center">
                <span
                  style="font-family: fantasy; font-size: 64px; color: gold">
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
            <v-row
              :class="{
                challenge: mode === Mode.Challenge,
                learning: mode === Mode.Learning,
              }">
              <v-col cols="12">
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
            <v-row v-if="status === Status.Play">
              <v-col cols="12" class="text-center">
                <v-btn-group class="mt-4" variant="outlined">
                  <v-btn color="warning" size="large" @click="restart"
                    >Restart</v-btn
                  >
                  <v-btn color="error" size="large" @click="stop">End</v-btn>
                </v-btn-group>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>
<style>
.game-container {
  height: auto;
  width: 100%;
  position: relative;
  top: 20vh;

  * {
    cursor: crosshair;
  }
}

.wrong {
  position: relative;
  animation: wrong 0.2s infinite;
}

@keyframes wrong {
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

.v-alert__content {
  overflow: visible;
}

.solved {
  animation: solved 2s infinite;
}

@keyframes solved {
  0% {
    color: gold;
  }

  50% {
    color: inherit;
  }

  100% {
    color: gold;
  }
}

.learning {
  opacity: 0.2;
  filter: grayscale(1);
}
</style>
