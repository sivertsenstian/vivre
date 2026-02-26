import { defineStore } from 'pinia';
import { computed, ref, shallowRef, watchEffect } from 'vue';
import axios from 'axios';
import * as parser from '@/utilities/hotkeyparser.ts';
import { getCodeFromAction } from '@/games/hotkeystorm/utilities/actions.ts';
import { useStorage } from '@vueuse/core';
import { useCollection, useFirestore } from 'vuefire';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import _take from 'lodash/take';
import _orderBy from 'lodash/orderBy';
import _groupBy from 'lodash/groupBy';
import _keys from 'lodash/keys';

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
  '112': 'F1',
  '113': 'F2',
  '114': 'F3',
  '115': 'F4',
  '116': 'F5',
  '117': 'F6',
  '118': 'F7',
  '119': 'F8',
  '120': 'F9',
  '121': 'F10',
  '122': 'F11',
  '123': 'F12',
  '512': 'Escape',
  '27': 'Escape',
};

interface IHighscore {
  name: string;
  challenge: string;
  score: number;
  timestamp?: Timestamp;
}

export const useHotKeyStormStore = defineStore('hotkeystorm', () => {
  const db = useFirestore();
  const busy = ref(false);
  const hotkeystormCollection = collection(db, 'hotkeystorm');
  const { data: highscores, pending } = useCollection(hotkeystormCollection);

  const highscoreTabs = [
    'All',
    'Human',
    'Orc',
    'Undead',
    'Night Elf',
    'Random',
    'Neutral',
  ];
  const highscoreFilter = ref('All');

  const save = async (highscore: IHighscore) => {
    try {
      busy.value = true;
      highscore.timestamp = Timestamp.now();
      await addDoc(hotkeystormCollection, highscore);
    } catch (e) {
      console.error(e);
    } finally {
      busy.value = false;
    }
  };

  const translation = ref<any>({});
  const data = useStorage('vivre/game/storm', {
    notShowHighScoreOnLoad: false,
    selected: 'basic',
    inventory: {
      itm1: '',
      itm2: '',
      itm3: '',
      itm4: '',
      itm5: '',
      itm6: '',
    } as any,
    custom: '',
    muted: false,
  });

  const showMessage = shallowRef(false);
  const message = ref('');
  watchEffect(async () => {
    showMessage.value = false;
    message.value = '';
    if (data.value.selected === 'custom' && data.value.custom.length) {
      try {
        const v = parser.parse(atob(data.value.custom).replace(/\r\n/g, '\n'));
        const uniqueKeys = _keys(_groupBy(v, 'Hotkey')).length;

        if (uniqueKeys >= 20) {
          translation.value = v;
          message.value = 'Success: Custom Hotkey Layout Loaded!';
        } else {
          message.value =
            'Error: Something went wrong when loading the custom layout - verify that the file is correct!';
        }
      } catch (error) {
        message.value =
          'Error: Unable to load the custom hotkey layout, verify that the file is correct!';
        console.error(error);
      } finally {
        showMessage.value = true;
        setTimeout(() => {
          showMessage.value = false;
        }, 3000);
      }
    } else {
      const v = await getTranslation(data.value.selected);
      translation.value = v;
    }
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

        return v?.split(',')?.[0]?.toUpperCase();
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

  const topten = computed(() => {
    return _take(
      _orderBy(
        highscores.value.filter(
          (h) =>
            highscoreFilter.value === 'All' ||
            h.challenge === highscoreFilter.value,
        ),
        ['score', 'name', 'challenge'],
        'desc',
      ),
      10,
    );
  });

  const inTopTen = computed(() => {
    return (score: number, filter: string) => {
      const top = _take(
        _orderBy(
          highscores.value.filter((h) => h.challenge === filter),
          ['score', 'name', 'challenge'],
          'desc',
        ),
        10,
      );

      return score > 0 && (top.length < 10 || top.some((h) => h.score < score));
    };
  });

  return {
    data,
    translation,
    getHotkeyFromAction,
    getHotkeyFromCode,
    highscores: topten,
    busy,
    pending,
    save,
    highscoreTabs,
    highscoreFilter,
    inTopTen,
    message,
    showMessage,
  };
});
