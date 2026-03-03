<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import _sample from 'lodash/sample';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import ConfettiExplosion from 'vue-confetti-explosion';
import moment from 'moment';
import Command from './components/Command.vue';
import HeroSelectCommand from './components/HeroSelectCommand.vue';
import InventoryCommand from '@/games/hotkeystorm/components/InventoryCommand.vue';
import NumberAnimation from 'vue-number-animation';
import {
  actionToName,
  Basic,
  createPuzzles,
  HotKeyType,
  night_elf_actions,
  undead_actions,
  orc_actions,
  human_actions,
  neutral_actions,
  all_actions,
} from './utilities/actions';
import { layouts } from './utilities/data';
import { useHotKeyStormStore } from '@/games/hotkeystorm/store.ts';
import { getIconUrl } from '@/utilities/api.ts';
import _keys from 'lodash/keys';
import RaceIcon from '@/components/RaceIcon.vue';
import { Race } from '@/stores/races.ts';
import correctAudio from './sounds/correct.mp3';
import solvedAudio from './sounds/solved.mp3';
import incorrectAudio from './sounds/incorrect.mp3';
import doneAudio from './sounds/done.mp3';
import startAudio from './sounds/start.mp3';
import music from './sounds/music.mp3';
import highscoreAudio from './sounds/highscore.mp3';
import successAudio from './sounds/success.mp3';
import EditInventoryInput from '@/games/hotkeystorm/components/EditInventoryInput.vue';
import custom_challenge from '@/assets/challenges.png';
import race_neutral from '@/assets/race/neutral.png';
import _round from 'lodash/round';
import _first from 'lodash/first';
import * as challenges from './utilities/challenges.ts';
import _forEach from 'lodash/forEach';

const store = useHotKeyStormStore();

const toName = (puzzle: any) => {
  if (puzzle.name?.toLowerCase()?.startsWith('item')) {
    return 'Inventory';
  }
  return puzzle.name;
};

const toOrdinalSuffix = (i: number) => {
  let j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + 'st';
  }
  if (j === 2 && k !== 12) {
    return i + 'nd';
  }
  if (j === 3 && k !== 13) {
    return i + 'rd';
  }
  return i + 'th';
};

const toInstruction = (puzzle: any) => {
  const a =
    puzzle?.actions?.map((v: any) => actionToName(puzzle, v)).join(' ') ?? '';

  switch (puzzle.type) {
    case HotKeyType.BasicAbility:
    case HotKeyType.Target:
      return `Cast ${a}`;
    case HotKeyType.ReverseTarget:
      return `Click ${puzzle?.actions?.map((v: any) => actionToName(puzzle, v)).join(' and ') ?? ''}`;
    case HotKeyType.MultiTarget:
      return `Cast ${actionToName(puzzle, puzzle?.actions?.[0])} on multiple targets`;
    case HotKeyType.BasicUpgrade:
      return `Research ${a}`;
    case HotKeyType.BasicBuy:
      return `Purchase ${a}`;
    case HotKeyType.BasicItem:
      return `Use ${a}`;
    case HotKeyType.BasicBuild:
      return `Build ${a}`;
    case HotKeyType.BasicSelect:
      return `Select ${a}`;
    case HotKeyType.Use:
      return `Quickcast ${actionToName(puzzle, puzzle?.actions?.[0])}`;
    default:
      return a;
  }
};

const sounds: any = {
  correct: new Audio(correctAudio),
  incorrect: new Audio(incorrectAudio),
  solved: new Audio(solvedAudio),
  done: new Audio(doneAudio),
  start: new Audio(startAudio),
  highscore: new Audio(highscoreAudio),
  music: new Audio(music),
  success: new Audio(successAudio),
};

const audio = computed(() => {
  return store.data.muted ? null : sounds;
});

const challenger = ref<string>('');
const challenge = ref<string>('');
const selectedPuzzles = ref<any[]>([]);
const puzzles = ref<any[]>([]);
const sample = ref(false);
const timer = ref(moment.duration(2, 'minutes'));
const historytimer = ref(moment.duration(0, 'seconds'));
const shift = ref(false);

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
const showHighscore = ref(false);
const showCustomChallenges = ref(false);
const madeTopTen = ref(false);

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
  clearTimeout(dodgetimeout.value);

  if (_isEmpty(puzzles.value)) {
    puzzles.value = [...selectedPuzzles.value];
  }

  const selected = sample.value
    ? _sample(puzzles.value)
    : _first(puzzles.value);

  // Drop puzzle after it has been selected to prevent it from being selected again
  puzzles.value = puzzles.value.filter((p: any) => !_isEqual(p, selected));
  puzzle.value = selected;
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
    audio.value?.solved.play();
    solved.value = true;

    if (mode.value === Mode.Challenge) {
      // Record for summary
      history.value.push({
        success: true,
        time: historytimer.value.asSeconds(),
        puzzle: puzzle.value,
        attempt: queue.value,
        answer: answer.value,
        combo: combo.value,
      });
    }

    // Minor celebration if practice round finished!
    if (mode.value === Mode.Learning && puzzles.value.length === 0) {
      audio.value?.success.play();
    }

    setTimeout(() => {
      captured.value = undefined;
      queue.value = [];
      solved.value = false;
      historytimer.value = moment.duration(0, 'seconds');

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
    audio.value?.incorrect.play();

    if (mode.value === Mode.Challenge) {
      history.value.push({
        success: false,
        time: historytimer.value.asSeconds(),
        puzzle: puzzle.value,
        attempt: queue.value,
        answer: answer.value,
        combo: combo.value,
      });

      setTimeout(() => {
        captured.value = undefined;
        queue.value = [];
        combo.value = 0;
        comboGoal.value = 5;
        comboStreak.value = 0;
        historytimer.value = moment.duration(0, 'seconds');

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
    audio.value?.correct.play();
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
            seconds = 10;
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
  if (status.value !== Status.Play) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

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

  shift.value = false;
};

window.addEventListener('keydown', (event) => {
  if (status.value !== Status.Play) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (event.shiftKey) {
    shift.value = true;
  }
});

window.addEventListener('keyup', captureInput);
window.addEventListener('click', (event) => {
  if (status.value !== Status.Play) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  queue.value.push(Basic.Miss);
  step();
});

const interval = ref();

const stop = (cancel: boolean = false) => {
  captured.value = undefined;
  queue.value = [];
  combo.value = 0;
  comboGoal.value = 5;
  comboStreak.value = 0;

  clearTimeout(dodgetimeout.value);
  clearInterval(interval.value);
  puzzle.value = {};
  puzzles.value = [];
  timer.value = moment.duration(2, 'minutes');
  historytimer.value = moment.duration(0, 'seconds');

  if (!cancel) {
    if (mode.value === Mode.Challenge) {
      audio.value?.done.play();
      status.value = Status.Finished;
      if (store.inTopTen(points.value, challenge.value)) {
        setTimeout(() => {
          audio.value?.highscore.play();
          store.highscoreFilter = challenge.value;
          madeTopTen.value = true;
        }, 500);
      }
    } else {
      status.value = Status.Waiting;
    }
  }
};

const start = () => {
  audio.value?.start.play();
  status.value = Status.Play;
  clearInterval(interval.value);
  history.value = [];
  points.value = 0;

  setTimeout(() => {
    timer.value = moment.duration(2, 'minutes');
    historytimer.value = moment.duration(0, 'seconds');
    next();
  }, 500);

  if (mode.value === Mode.Challenge) {
    interval.value = setInterval(() => {
      timer.value.subtract(1, 'second');
      historytimer.value.add(1, 'second');
      if (timer.value.asSeconds() <= 0) {
        stop();
      }
    }, 1000);
  }
};

const restart = () => {
  stop(true);
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

    // If user is holding shift with multiple targets count a hit as auto-execute of the next
    if (
      shift.value &&
      queue.value.length < answer.value.length - 1 &&
      puzzle.value.type === HotKeyType.MultiTarget
    ) {
      queue.value.push(answer.value[0]);
    }
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
    Math.floor(Math.random() * (1500 - 500 + 1)) + 500,
  );
};

const volumeChanged = (volume: number) => {
  _forEach(audio.value, (sound) => {
    sound.volume = volume / 100;
  });
};

onMounted(() => {
  if (!store.data.notShowHighScoreOnLoad) {
    showHighscore.value = true;
    store.data.notShowHighScoreOnLoad = true;
  }

  if (_isNil(store.data.volume)) {
    store.data.volume = 50;
  }

  volumeChanged(store.data.volume);
});

watch(showHighscore, (v, _) => {
  if (v) {
    if (audio.value) {
      audio.value.music.loop = true;
    }
    audio.value?.music.play();
  } else {
    audio.value?.music.pause();
    if (audio.value) {
      audio.value.music.currentTime = 0;
    }
  }
});

const activeHotkeyFile = ref<File>();
const isUploading = ref(false);

const toBase64 = (file: File) =>
  new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve((reader.result as any)?.split(',')?.[1] ?? '');
    reader.onerror = reject;
  });

const onUploadHotkeys = async (event: any) => {
  isUploading.value = true;
  if (event?.target?.files?.[0]) {
    try {
      const file = event?.target?.files?.[0];
      const data = await toBase64(file);
      store.data.custom = data;
    } catch (error) {
      console.error('Failed to parse replay...', error);
    } finally {
      isUploading.value = false;
    }
  } else {
    console.log('No file selected or file input cleared.');
  }
};
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid>
      <v-sheet class="pa-6" style="min-height: 85vh; overflow: hidden">
        <v-row v-if="status !== Status.Finished">
          <v-col class="game-container" cols="8">
            <v-row v-if="status !== Status.Play">
              <v-col cols="12" class="text-center">
                <v-dialog
                  v-model="showHighscore"
                  max-width="800"
                  height="800"
                  transition="dialog-bottom-transition">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      class="highscore-button"
                      v-bind="activatorProps"
                      text="VIEW HIGH SCORES"
                      variant="plain"></v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-container class="arcade-container">
                      <h1 class="text-center mb-5 arcade-title">HIGH SCORES</h1>
                      <v-table
                        density="compact"
                        theme="dark"
                        class="arcade-table">
                        <thead>
                          <tr>
                            <td
                              :class="{
                                'text-no-wrap filter': true,
                                active: tab === store.highscoreFilter,
                              }"
                              v-for="tab in store.highscoreTabs"
                              @click="store.highscoreFilter = tab">
                              {{ tab }}
                            </td>
                          </tr>
                        </thead>
                      </v-table>
                      <v-table
                        theme="dark"
                        class="arcade-table"
                        style="min-height: 500px">
                        <thead>
                          <tr>
                            <th class="text-center">RANK</th>
                            <th class="text-center">NAME</th>
                            <th class="text-center">SCORE</th>
                            <th class="text-center">CHALLENGE</th>
                          </tr>
                        </thead>
                        <tbody v-if="store.pending">
                          <tr>
                            <td colspan="4" class="text-center please-wait">
                              <span style="font-size: 22px">
                                Please wait...
                              </span>
                              <v-progress-linear
                                class="mt-8"
                                indeterminate
                                :color="`rgb(73,255,255)`" />
                            </td>
                          </tr>
                        </tbody>
                        <tbody v-else-if="store.highscores.length === 0">
                          <tr>
                            <td colspan="4" class="text-center please-wait">
                              <span style="font-size: 22px"> Empty... </span>
                            </td>
                          </tr>
                        </tbody>
                        <tbody v-else>
                          <tr v-for="(item, index) in store.highscores">
                            <td class="text-center rank-col">
                              {{ toOrdinalSuffix(index + 1) }}
                            </td>
                            <td class="text-center name-col">
                              {{ item.name }}
                            </td>
                            <td class="text-center score-col">
                              {{ item.score }}
                            </td>
                            <td class="text-center name-col">
                              {{ item.challenge }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-container>
                  </template>
                </v-dialog>
              </v-col>
            </v-row>
            <template v-if="status === Status.Play">
              <v-row v-if="!puzzle.name">
                <v-col cols="4" offset="4" class="text-center">
                  <h3 style="font-family: fantasy">Get Ready!</h3>
                  <v-progress-linear indeterminate />
                </v-col>
              </v-row>
              <v-row
                :style="{
                  transition: 'opacity 500ms',
                  opacity: puzzle.name ? 1 : 0,
                }">
                <v-col cols="12" class="text-center">
                  <h2 class="text-no-wrap">
                    <v-img
                      v-if="!puzzle.name?.toLowerCase().startsWith('item')"
                      :src="getIconUrl(puzzle.name)"
                      width="48"
                      class="mx-auto mb-2"
                      style="left: 8px" />
                    <span class="text-primary font-weight-bold"
                      >{{ toName(puzzle) }}:
                    </span>
                    <span class="text-secondary">{{
                      toInstruction(puzzle)
                    }}</span>
                  </h2>
                </v-col>
              </v-row>
              <v-row
                :style="{
                  transition: 'opacity 500ms',
                  opacity: puzzle.name ? 1 : 0,
                }">
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
                    <hero-select-command
                      v-else-if="
                        [
                          'SelectFirstHero',
                          'SelectSecondHero',
                          'SelectThirdHero',
                        ].some((v) => v === action)
                      "
                      :name="puzzle.name"
                      :action="action">
                    </hero-select-command>
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
              <v-row
                :style="{
                  transition: 'opacity 500ms',
                  opacity: puzzle.name ? 1 : 0,
                }">
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
                <v-col
                  col="12"
                  class="text-center"
                  v-if="puzzle.type === HotKeyType.MultiTarget">
                  <div class="text-grey" style="font-size: 11px">
                    Tip: Hold shift to more easily hit multiple targets!
                  </div>
                </v-col>
                <v-col cols="12" class="text-center" v-if="hint">
                  <span
                    class="text-orange font-weight-bold"
                    style="vertical-align: text-bottom"
                    >HINT:
                  </span>
                  <div
                    v-for="key in answer.filter((a: any) =>
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
                height="400">
                <v-icon icon="mdi-weather-lightning" style="font-size: 128px" />
                <h2>
                  Welcome to
                  <span class="font-weight-bold text-orange">Storm key</span>
                  - The Hotkey training game!
                </h2>
                <h2>
                  Can you reach the leaderboard and become APM king? Let's find
                  out!
                </h2>
                <h2>
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
                  ><h1 class="font-weight-bold">
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
                  ><h1
                    style="
                      color: orange;
                      font-family: 'Press Start 2P', system-ui;
                    ">
                    Storm key
                  </h1>
                  <span
                    style="position: relative; color: grey; font-weight: bold"
                    >by Longjacket</span
                  >
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  offset-md="3"
                  class="d-inline-flex align-items-center">
                  <v-slider
                    :width="100"
                    density="compact"
                    hide-details
                    :min="0"
                    :max="100"
                    :color="
                      store.data.muted ? 'rgba(100,100,100,0.8)' : 'white'
                    "
                    :prepend-icon="
                      store.data.muted ? 'mdi-volume-off' : 'mdi-volume-high'
                    "
                    @click:prepend="store.data.muted = !store.data.muted"
                    @update:model-value="volumeChanged"
                    v-model="store.data.volume" />
                </v-col>
                <v-col cols="7">
                  <v-select
                    :items="layouts"
                    density="compact"
                    item-props
                    label="Hotkey layout"
                    v-model="store.data.selected"
                    :persistent-hint="store.data.selected === 'custom'"
                    :hint="
                      store.data.custom?.length
                        ? 'Custom layout uploaded and in use!'
                        : 'Please upload a custom layout first'
                    " />
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
                <v-col cols="12">
                  <v-file-input
                    density="compact"
                    :loading="isUploading"
                    clearable
                    prepend-icon="mdi-file-upload"
                    variant="solo-filled"
                    color="primary"
                    accept=".txt"
                    label="Select a hotkey file to use for custom layout..."
                    @change="onUploadHotkeys"
                    v-model="activeHotkeyFile" />
                </v-col>
              </template>
            </v-row>
            <template v-if="!editInventory && status !== Status.Play">
              <v-row style="margin-bottom: 10vh" v-if="!showCustomChallenges">
                <v-col cols="7" class="text-center">
                  <table>
                    <tbody>
                      <tr>
                        <td style="width: 42px; height: 42px">
                          <v-btn
                            @click="
                              () => {
                                challenge = 'Human';
                                sample = true;
                                selectedPuzzles = _keys(human_actions)
                                  .map((name) =>
                                    createPuzzles(human_actions, name),
                                  )
                                  .flat();
                                start();
                              }
                            "
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%">
                            <race-icon :race="Race.Human" :size="64" />
                          </v-btn>
                        </td>
                        <td style="width: 42px; height: 42px">
                          <v-btn
                            @click="
                              () => {
                                challenge = 'Orc';
                                sample = true;
                                selectedPuzzles = _keys(orc_actions)
                                  .map((name) =>
                                    createPuzzles(orc_actions, name),
                                  )
                                  .flat();
                                start();
                              }
                            "
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%">
                            <race-icon :race="Race.Orc" :size="64" />
                          </v-btn>
                        </td>
                        <td style="width: 42px; height: 42px">
                          <v-btn
                            @click="
                              () => {
                                challenge = 'Neutral';
                                sample = true;
                                selectedPuzzles = _keys(neutral_actions)
                                  .map((name) =>
                                    createPuzzles(neutral_actions, name),
                                  )
                                  .flat();
                                start();
                              }
                            "
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%">
                            <img
                              :width="64"
                              :src="race_neutral"
                              title="Neutral"
                              style="vertical-align: middle" />
                          </v-btn>
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 42px; height: 42px">
                          <v-btn
                            @click="
                              () => {
                                challenge = 'Night Elf';
                                sample = true;
                                selectedPuzzles = _keys(night_elf_actions)
                                  .map((name) =>
                                    createPuzzles(night_elf_actions, name),
                                  )
                                  .flat();
                                start();
                              }
                            "
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%">
                            <race-icon :race="Race.NightElf" :size="64" />
                          </v-btn>
                        </td>
                        <td style="width: 42px; height: 42px">
                          <v-btn
                            @click="
                              () => {
                                challenge = 'Undead';
                                sample = true;
                                selectedPuzzles = _keys(undead_actions)
                                  .map((name) =>
                                    createPuzzles(undead_actions, name),
                                  )
                                  .flat();
                                start();
                              }
                            "
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%">
                            <race-icon :race="Race.Undead" :size="64" />
                          </v-btn>
                        </td>
                        <td style="width: 42px; height: 42px">
                          <v-btn
                            @click="
                              () => {
                                challenge = 'Random';
                                sample = true;
                                selectedPuzzles = _keys(all_actions)
                                  .map((name) =>
                                    createPuzzles(all_actions, name),
                                  )
                                  .flat();
                                start();
                              }
                            "
                            rounded="0"
                            variant="tonal"
                            style="width: 100%; height: 100%">
                            <race-icon :race="Race.Random" :size="64" />
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 style="font-weight: bold">
                    Race
                    {{ mode === Mode.Challenge ? 'Challenges' : 'Practice' }}
                  </h3>
                </v-col>
                <v-col cols="5" class="text-center">
                  <v-btn
                    rounded="0"
                    :disabled="mode === Mode.Challenge"
                    variant="tonal"
                    style="width: 100%; height: 132px"
                    @click="showCustomChallenges = true">
                    <img
                      :width="112"
                      :src="custom_challenge"
                      title="Custom Practice"
                      style="vertical-align: middle" />
                  </v-btn>
                  <h3
                    :class="{
                      'font-weight-bold': true,
                      'text-white': mode === Mode.Learning,
                      'text-grey': mode === Mode.Challenge,
                    }">
                    Custom Practice
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
                <v-col cols="6" class="text-center">
                  <v-btn
                    @click="mode = Mode.Challenge"
                    size="60"
                    :variant="mode === Mode.Challenge ? 'elevated' : 'tonal'"
                    block
                    color="warning"
                    >Challenge Mode</v-btn
                  >
                </v-col>
                <v-col cols="6" class="text-center">
                  <v-btn
                    @click="mode = Mode.Learning"
                    size="60"
                    :variant="mode === Mode.Learning ? 'elevated' : 'tonal'"
                    block
                    color="success"
                    >Practice Mode</v-btn
                  >
                </v-col>
                <v-col
                  cols="12"
                  v-if="mode === Mode.Challenge"
                  style="font-size: 13px"
                  class="text-center">
                  <p class="font-weight-bold">
                    Prove your worth in challenge mode! Solve puzzles in the
                    different
                    <span class="text-orange font-weight-bold"
                      >Race Challenges</span
                    >
                    on a timer to compete for a place on the high score list!
                  </p>
                  <p class="font-weight-bold mt-3">
                    Puzzle streak combos reward you with more time - but every
                    error reduces your available time by 10 seconds!
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  v-if="mode === Mode.Learning"
                  style="font-size: 13px"
                  class="text-center">
                  <p class="font-weight-bold">
                    Improve your hotkey use in practice mode! Solve puzzles in
                    the different
                    <span class="text-success font-weight-bold"
                      >Race Practices</span
                    >
                    with unlimited time!
                  </p>
                  <p class="font-weight-bold mt-3">
                    There is a helpful hint system to help you fine tune
                    existing hotkeys - or learn new ones! And even some custom
                    practice runs for more specialized cases
                  </p>
                </v-col>
              </v-row>
              <v-row v-else style="height: 469px">
                <v-col cols="12">
                  <v-list height="100%">
                    <v-list-item
                      v-for="c in [
                        challenges.ArchmageFirstCamp(),
                        challenges.HumanStart(),
                        challenges.GoblinShop(),
                        challenges.Inventory(),
                        challenges.DodgeMissile(),
                      ]">
                      <v-btn
                        class="d-inline-flex justify-start"
                        block
                        rounded="0"
                        color="primary"
                        variant="tonal"
                        @click="
                          () => {
                            challenge = c.name;
                            sample = c.random;
                            mode = Mode.Learning;
                            selectedPuzzles = c.puzzles;
                            start();
                          }
                        ">
                        <img
                          class="mr-3"
                          :width="32"
                          :src="custom_challenge"
                          :title="c.name" />
                        {{ c.name }}
                      </v-btn>
                    </v-list-item>

                    <v-list-item class="mt-auto">
                      <v-btn
                        class="d-inline-flex justify-center"
                        block
                        rounded="0"
                        variant="tonal"
                        @click="
                          () => {
                            showCustomChallenges = false;
                          }
                        ">
                        Exit Custom Practices
                      </v-btn>
                    </v-list-item>
                  </v-list>
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
            <v-row>
              <v-col
                cols="12"
                class="text-center"
                v-if="mode === Mode.Learning && status === Status.Play">
                <h1 style="font-family: fantasy; font-size: 64px">
                  <span class="text-grey">{{
                    selectedPuzzles.length - puzzles.length
                  }}</span>
                  /
                  <span class="text-primary">{{ selectedPuzzles.length }}</span>
                </h1>
              </v-col>
              <v-col
                cols="12"
                :class="{
                  'text-center': true,
                  challenge: mode === Mode.Challenge,
                  learning: mode === Mode.Learning,
                }"
                v-else>
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
                  chunk-count="4"
                  style="margin-top: 5px"
                  :height="10"
                  :color="comboStreak === 4 ? '#FFD700' : 'green'"
                  :model-value="comboStreak"
                  :max="4" />
              </v-col>
            </v-row>
            <v-row v-if="status === Status.Play">
              <v-col cols="12" class="text-center">
                <v-btn-group class="mt-4" variant="outlined">
                  <v-btn color="warning" size="large" @click="() => restart()"
                    >Restart</v-btn
                  >
                  <v-btn color="error" size="large" @click="() => stop()"
                    >End</v-btn
                  >
                  <v-btn
                    v-if="mode === Mode.Learning"
                    color="success"
                    size="large"
                    @click="() => next()"
                    >Skip</v-btn
                  >
                </v-btn-group>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if="status === Status.Finished">
          <v-dialog
            transition="dialog-bottom-transition"
            width="600"
            height="300"
            v-model="madeTopTen"
            :persistent="true">
            <ConfettiExplosion
              :force="1.5"
              style="position: relative; left: 300px"
              :colors="['goldenrod', 'darkgoldenrod', 'silver', 'gold']" />
            <v-card
              prepend-icon="mdi-trophy-award"
              title="You made the top ten!">
              <v-card-text class="text-center">
                <h3 class="text-orange">
                  Please enter your name to be entered into the high score list
                </h3>
              </v-card-text>
              <v-card-text>
                <v-row>
                  <v-col cols="6" offset="3">
                    <v-text-field
                      v-model="challenger"
                      class="text-capitalize"
                      maxlength="3"
                      :rules="[
                        (value) =>
                          value.length !== 3 ? 'Must enter 3 characters' : true,
                      ]"
                      hide-details="auto"
                      @input="challenger = challenger.toUpperCase()"
                      placeholder="AAA"
                      label="Name" />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text="Don't save"
                  variant="plain"
                  color="error"
                  @click="
                    () => {
                      madeTopTen = false;
                    }
                  "></v-btn>
                <v-btn
                  color="success"
                  text="Save my high score"
                  variant="tonal"
                  :loading="store.busy"
                  @click="
                    async () => {
                      if (challenger.length && challenger.length === 3) {
                        await store.save({
                          name: challenger.toUpperCase(),
                          score: points,
                          challenge: challenge,
                        });
                        madeTopTen = false;
                      }
                    }
                  "></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-col cols="6" class="text-center">
            <v-card
              width="100%"
              height="500"
              variant="tonal"
              color="success"
              class="d-inline-flex">
              <v-card-text class="my-auto">
                <v-row>
                  <v-col cols="12" class="text-center">
                    <div
                      style="
                        font-size: 240px;
                        font-family: fantasy;
                        font-weight: bold;
                      ">
                      <number-animation
                        :from="0"
                        :to="points"
                        :format="_round"
                        :duration="3"
                        autoplay
                        easing="easeInOutQuad" />
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <h2 style="font-size: 32px">Puzzles Solved</h2>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card width="100%" height="500" variant="flat" border>
              <v-table class="pa-10" style="font-size: 22px">
                <tbody>
                  <tr>
                    <td class="text-left font-weight-bold">Moves</td>
                    <td class="text-right">
                      {{ history.reduce((s, v) => s + v.attempt.length, 0) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left font-weight-bold">Accuracy</td>
                    <td class="text-right">
                      {{
                        Math.round(
                          (history.reduce(
                            (s, v) => (v.success ? s + 1 : s),
                            0,
                          ) /
                            Math.max(history.length, 1)) *
                            100,
                        )
                      }}%
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left font-weight-bold">Combo</td>
                    <td class="text-right">
                      {{
                        history.reduce((s, v) => (v.combo > s ? v.combo : s), 0)
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left font-weight-bold">Time</td>
                    <td class="text-right">
                      {{ history.reduce((s, v) => s + v.time, 0) }} seconds
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left font-weight-bold">Time per move</td>
                    <td class="text-right">
                      {{
                        Number(
                          history.reduce((s, v) => s + v.time, 0) /
                            Math.max(
                              history.reduce((s, v) => s + v.attempt.length, 0),
                              1,
                            ),
                        ).toFixed(2)
                      }}
                      seconds
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
          <v-col cols="8">
            <v-btn
              rounded="0"
              variant="tonal"
              size="128"
              block
              color="primary"
              @click="
                (event: any) => {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  start();
                }
              ">
              <v-icon icon="mdi-weather-lightning" style="font-size: 64px" />
              <span style="font-size: 54px; font-weight: bold" class="mx-5"
                >Play Again</span
              >
              <v-icon icon="mdi-weather-lightning" style="font-size: 64px" />
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
              rounded="0"
              variant="tonal"
              size="128"
              block
              color="warning"
              @click="
                (event: any) => {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  status = Status.Waiting;
                }
              ">
              <span style="font-size: 54px; font-weight: bold" class="mx-5"
                >Exit</span
              >
              <v-icon icon="mdi-exit-run" style="font-size: 64px" />
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-left text-grey">
            <h2>Puzzles played</h2>
          </v-col>
          <v-col v-for="(item, i) in history" cols="3">
            <v-card
              variant="tonal"
              :color="item.success ? 'primary' : 'error'"
              height="100%"
              border>
              <v-card-item>
                <v-card-title
                  >{{ toOrdinalSuffix(i + 1) }} -
                  {{ toName(item.puzzle) }}</v-card-title
                >
                <v-card-subtitle>{{
                  toInstruction(item.puzzle)
                }}</v-card-subtitle>
              </v-card-item>
              <v-card-text>
                <v-row>
                  <v-col cols="12" class="text-center">
                    <h2 class="text-no-wrap"></h2>
                  </v-col>
                  <v-col
                    cols="12"
                    class="text-center d-inline-flex justify-center align-center">
                    <div
                      v-for="(action, i) in item.puzzle.actions"
                      class="d-inline-flex">
                      <inventory-command
                        v-if="
                          item.puzzle.name?.toLowerCase().startsWith('item') &&
                          action !== Basic.TargetDummy &&
                          action !== Basic.MissileDodge
                        "
                        :size="28"
                        :name="item.puzzle.name"
                        :action="action"
                        :current="queue?.[i]" />
                      <hero-select-command
                        v-else-if="
                          [
                            'SelectFirstHero',
                            'SelectSecondHero',
                            'SelectThirdHero',
                          ].some((v) => v === action)
                        "
                        :size="28"
                        :name="item.puzzle.name"
                        :action="action">
                      </hero-select-command>
                      <command
                        v-else
                        :size="28"
                        :name="item.puzzle.name"
                        :action="action"
                        :current="item.attempt?.[i]"
                        :queue="item.attempt" />
                    </div>
                  </v-col>
                </v-row>
                <v-row
                  :style="{ visibility: item.success ? 'hidden' : 'visible' }">
                  <v-col cols="12" class="text-center">
                    <span
                      class="text-success font-weight-bold"
                      style="vertical-align: text-bottom"
                      >SOLUTION:
                    </span>
                    <div
                      v-for="key in item.answer.filter((a: any) =>
                        [
                          Basic.TargetDummy,
                          Basic.Miss,
                          Basic.MissileDodge,
                        ].every((v) => a !== v),
                      )"
                      class="d-inline-flex">
                      <h2 class="font-weight-bold ml-2 text-primary">
                        {{ key }}
                      </h2>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn
                  variant="tonal"
                  prepend-icon="mdi-check"
                  color="success"
                  v-if="item.success"
                  >{{ item.time }}s</v-btn
                >
                <v-btn
                  variant="tonal"
                  prepend-icon="mdi-close"
                  color="error"
                  v-else
                  >{{ item.time }}s</v-btn
                >
                <v-btn
                  v-if="item.time > 2"
                  variant="tonal"
                  prepend-icon="mdi-clock"
                  color="warning"
                  >slow</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="store.showMessage"
          prepend-icon="$success"
          variant="elevated"
          :color="store.message.startsWith('Success:') ? 'success' : 'error'">
          {{ store.message }}
        </v-snackbar>
      </v-sheet>
    </v-container>
  </main>
</template>
<style scoped>
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

.arcade-container {
  background-color: black;
  color: #ff0; /* Classic Arcade Yellow */
  font-family: 'Press Start 2P', system-ui;
  font-weight: 400;
  font-style: normal;
  padding: 20px;
  border: 4px solid #00f; /* Blue border */
}

.arcade-title {
  color: #0f0; /* Green title */
  text-shadow: 2px 2px #f00; /* Red shadow */
  font-size: 2rem;
}

/* 2. Override Vuetify Table Styling */
.arcade-table {
  background: black !important;
  color: #ff0 !important;
  font-family: 'Press Start 2P', cursive;
}

.arcade-table th,
.arcade-table td {
  border-bottom: none !important; /* Remove borders */
  font-size: 0.8rem;
  padding: 15px !important;

  &.filter {
    cursor: pointer;
    &:hover {
      color: #0ff !important;
    }
  }
  &.active {
    color: #0ff !important;
  }
}

.arcade-table thead th {
  color: #0ff !important; /* Cyan headers */
}

/* Optional: Add flashing effect for top score */
.rank-col:first-child,
.score-col:first-child,
.name-col:first-child {
  color: #fff;
  animation: flash 1s infinite;
}

.highscore-button {
  font-family: 'Press Start 2P', system-ui;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #fff;
  animation: flash 1s infinite;
}

.please-wait {
  color: #fff;
  animation: flash 1s infinite;
}

@keyframes flash {
  50% {
    color: #ff0;
  }
}
</style>
