<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue';
import _sample from 'lodash/sample';
import _first from 'lodash/first';

const toImg = (instruction: string) => {
  return `/icons/btn${String(instruction ?? '')
    .replace(/ /g, '')
    .replace(/\//g, '')
    .replace(/’/g, '')
    .replace(/'/g, '')
    .toLowerCase()}.jpg`;
};

const missiles: string[] = [
  'Death Coil',
  'Storm Bolt',
  'Shadow Strike',
  'Impale',
  'Shockwave',
];

interface Props {
  i: number;
  test: any;
  command: any;
  queue: any[];
  hotkeys: any;
  action: any;
}
const props = defineProps<Props>();

const missile = computed(() => _sample(missiles) ?? _first(missiles));

onMounted(() => {
  if (props.command === 'MissileDodge') {
    props.action();
  }
});

onUpdated(() => {
  const q = [...props.queue];
  if (
    props.command === 'MissileDodge' &&
    (q.length === 0 ||
      (q.some((v: any) => v === 'Miss') &&
        q.some((v: any) => v === 'MissileDodge')))
  ) {
    setTimeout(() => {
      props.action();
    }, 500);
  }
});

const active = computed(() => {
  return (
    (
      props.hotkeys?.[props.test.target]?.[props.command] ??
      props.hotkeys?.[props.command]
    )?.toLowerCase() !== props.queue?.[props.i]?.toLowerCase()
  );
});
</script>

<template>
  <v-img
    :src="
      command === 'MissileDodge' && !active ? toImg(missile) : toImg(command)
    "
    width="42"
    :class="{
      'mx-3 my-auto': true,
      incoming: command === 'MissileDodge' && active,
      dodge: command === 'MissileDodge' && !active,
    }"
    :style="{
      filter: active ? 'brightness(1.0)' : 'brightness(1.5)',
    }" />
</template>

<style scoped>
.incoming {
  position: relative;
  animation: vibrate 0.3s infinite;
}

.dodge {
  box-shadow: 0 0 15px 5px firebrick !important;
  animation: pulse 2s infinite;
}

@keyframes vibrate {
  0% {
    bottom: 3px;
    left: 2px;
  }

  50% {
    bottom: -3px;
    left: -2px;
  }

  100% {
    bottom: 3px;
    left: 2px;
  }
}
</style>
