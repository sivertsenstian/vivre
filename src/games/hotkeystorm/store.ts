import { defineStore } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import axios from 'axios';
import * as parser from '@/utilities/hotkeyparser.ts';
import { getCodeFromAction } from '@/games/hotkeystorm/utilities/actions.ts';
import { useStorage } from '@vueuse/core';

const getTranslation = async (selected: string) => {
  const response = await axios.get(`/hotkeys/${selected}.txt`, {
    responseType: 'text',
  });
  return parser.parse(response.data);
};

const keyCodeToKey: any = {
  '96': 'Numpad0',
  '97': 'Numpad1',
  '98': 'Numpad2',
  '99': 'Numpad3',
  '100': 'Numpad4',
  '101': 'Numpad5',
  '102': 'Numpad6',
  '103': 'Numpad7',
  '104': 'Numpad8',
  '105': 'Numpad9',
};

export const useHotKeyStormStore = defineStore('hotkeystorm', () => {
  const translation = ref<any>({});
  const data = useStorage('vivre/game/storm', {
    selected: 'basic',
    inventory: {
      itm1: '',
      itm2: '',
      itm3: '',
      itm4: '',
      itm5: '',
      itm6: '',
    } as any,
    custom: null,
  });

  watchEffect(async () => {
    translation.value = await getTranslation(data.value.selected);
  });

  const getHotkeyFromCode = computed(() => {
    return (code: string, key = 'Hotkey') => {
      try {
        const result = translation.value?.[code];
        const v =
          keyCodeToKey?.[result?.[key]] ??
          data.value?.inventory?.[code] ??
          result?.[key] ??
          code;
        return v.toUpperCase();
      } catch (error) {
        console.error(error);
      }
    };
  });

  const getHotkeyFromAction = computed(() => {
    return (name: string, action: string) => {
      const c = getCodeFromAction(name, action);
      return getHotkeyFromCode.value(
        c,
        action.startsWith('HeroAbilitiesTrain') ? 'Researchhotkey' : undefined,
      );
    };
  });

  return { data, translation, getHotkeyFromAction, getHotkeyFromCode };
});
