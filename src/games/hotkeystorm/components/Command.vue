<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue';
import _sample from 'lodash/sample';
import _first from 'lodash/first';
import { useHotKeyStormStore } from '@/games/hotkeystorm/store.ts';
import { getIconUrl } from '@/utilities/api.ts';
import { Basic } from '@/games/hotkeystorm/utilities/actions.ts';

const store = useHotKeyStormStore();

const missiles: string[] = [
  'Death Coil',
  'Storm Bolt',
  'Shadow Strike',
  'Impale',
  'Shockwave',
];

interface Props {
  name: string;
  action: string;
  current?: string;
  queue: string[];
  callback: any;
}
const props = defineProps<Props>();

const missile = computed(
  () => _sample(missiles) ?? _first(missiles) ?? 'Death Coil',
);

onMounted(() => {
  if (props.action === Basic.MissileDodge) {
    props.callback();
  }
});

onUpdated(() => {
  const q = [...props.queue];
  if (
    props.action === Basic.MissileDodge &&
    (q.length === 0 ||
      (q.some((v: any) => v === Basic.Miss) &&
        q.some((v: any) => v === Basic.MissileDodge)))
  ) {
    setTimeout(() => {
      props.callback();
    }, 500);
  }
});

const active = computed(
  () =>
    store.getHotkeyFromAction(props.name, props.action)?.toLowerCase() !==
    props.current?.toLowerCase(),
);
</script>

<template>
  <v-img
    :src="
      action === Basic.MissileDodge && !active
        ? getIconUrl(missile)
        : getIconUrl(action)
    "
    width="42"
    :class="{
      'mx-3 my-auto': true,
      incoming: action === Basic.MissileDodge && active,
      dodge: action === Basic.MissileDodge && !active,
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
