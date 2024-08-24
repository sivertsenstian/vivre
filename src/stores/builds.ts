import { useCollection, useFirestore } from "vuefire";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import _last from "lodash/last";
import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { Race } from "@/stores/races";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { IBuildOrderState } from "@/utilities/types";

export const useBuildsStore = defineStore("builds", () => {
  const db = useFirestore();
  const buildorders = useCollection(collection(db, "buildorders"));
  const router = useRouter();

  const busy = ref(false);

  const step = () => ({
    id: uuidv4(),
    time: "00:00",
    food: "5/12",
    instructions: "",
    hotkey: "",
    timing: false,
  });

  const build = () => ({
    id: uuidv4(),
    created: new Date(),
    name: "",
    description: "",
    games: [],
    stars: 0,
    player: Race.Human,
    opponent: Race.Orc,
    steps: [step()],
  });

  const save = async (item: any) => {
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

  const update = async (item: any) => {
    try {
      busy.value = true;
      const reference = doc(db, "buildorders", item.id);
      await updateDoc(reference, item);
      await router.push(`/buildorders/${item.id}`);
      clear();
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

  const removeStep = (mode: "new" | "edit", step: any) => {
    const steps = data.value[mode].steps ?? [];
    data.value[mode].steps = steps.filter((s) => s.id !== step.id);
  };

  const setActive = (build: any) => {};

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
  };
});
