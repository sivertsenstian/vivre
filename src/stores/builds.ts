import { useCollection, useFirestore } from "vuefire";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import _last from "lodash/last";
import _trimEnd from "lodash/trimEnd";
import _split from "lodash/split";
import _isNil from "lodash/isNil";
import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { Race } from "@/stores/races";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { IBuild, IBuildOrderState, IStep } from "@/utilities/types";
import moment from "moment";

export const useBuildsStore = defineStore("builds", () => {
  const db = useFirestore();
  const buildorders = useCollection(collection(db, "buildorders"));
  const router = useRouter();

  const busy = ref(false);

  const difficulties = ["Beginner", "Amateur", "Pro"];

  const step = () => ({
    id: uuidv4(),
    time: "00:00",
    food: "5/12",
    instructions: "",
    hotkey: "",
    timing: false,
    separator: false,
  });

  const build = () => ({
    id: uuidv4(),
    author: "",
    created: moment().toDate(),
    name: "",
    description: "",
    version: "1.36.2",
    difficulty: "Amateur",
    games: [],
    tags: [],
    stars: 0,
    player: Race.Human,
    opponent: Race.Random,
    steps: [step()],
  });

  const game = () => ({
    id: "",
  });

  const save = async (item: IBuild) => {
    try {
      busy.value = true;

      await setDoc(doc(db, "buildorders", item.id), item);
      await router.push(`/buildorders/${item.id}`);

      // mark it as owned to allow editing
      data.value.owns[item.id] = true;

      clear();
    } catch (e) {
      console.error(e);
    } finally {
      busy.value = false;
    }
  };

  const clear = () => {
    data.value.new = build();
  };

  const edit = (item: any) => {
    data.value.edit = item;
  };

  const update = async (item: Partial<IBuild>) => {
    try {
      busy.value = true;
      if (item.id) {
        const reference = doc(db, "buildorders", item.id);
        await updateDoc(reference, item as any);
        await router.push(`/buildorders/${item.id}`);
        clear();
      }
    } catch (e) {
      console.error(e);
    } finally {
      busy.value = false;
    }
  };

  const star = async (item: any) => {
    try {
      const reference = doc(db, "buildorders", item.id);
      await updateDoc(reference, { stars: increment(1) });
      data.value.starred[item.id] = true;
    } catch (e) {
      console.error(e);
    }
  };

  const unstar = async (item: any) => {
    try {
      const reference = doc(db, "buildorders", item.id);
      await updateDoc(reference, { stars: increment(-1) });

      delete data.value.starred[item.id];
    } catch (e) {
      console.error(e);
    }
  };

  const addStep = (mode: "new" | "edit") => {
    const steps = data.value[mode].steps ?? [];
    const l = _last(steps);
    const s = step();
    if (l) {
      s.time = l.time;
      s.food = l.food;
    }
    data.value[mode].steps = [...steps, s];
  };

  const removeStep = (mode: "new" | "edit", step: IStep) => {
    const steps = data.value[mode].steps ?? [];
    data.value[mode].steps = steps.filter((s) => s.id !== step.id);
  };

  const addGame = (mode: "new" | "edit") => {
    const games = data.value[mode].games ?? [];
    data.value[mode].games = [...games, game()];
  };

  const removeGame = (mode: "new" | "edit", game: string) => {
    const games = data.value[mode].games ?? [];
    data.value[mode].games = games.filter((g) => g.id !== game);
  };

  const setActive = (build: any) => {};

  const canEdit = (id?: string): boolean =>
    !_isNil(id) && data.value.owns?.[id];

  const data = useStorage("vivre/builds", {
    new: build(),
    edit: {},
    active: {},
    starred: {},
    owns: {},
  } as IBuildOrderState);

  return {
    buildorders,
    data,
    addStep,
    removeStep,
    save,
    clear,
    edit,
    update,
    busy,
    star,
    unstar,
    addGame,
    removeGame,
    canEdit,
    difficulties,
  };
});
