import { useCollection, useFirestore } from "vuefire";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import _last from "lodash/last";
import _isNil from "lodash/isNil";
import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { Race } from "@/stores/races";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type {
  IBuild,
  IBuildOrderState,
  ISampleGame,
  IStep,
} from "@/utilities/types";
import moment from "moment";
import { detectIncognito } from "detectincognitojs";

export const useBuildsStore = defineStore("builds", () => {
  const db = useFirestore();
  const { data: buildorders, pending } = useCollection(
    collection(db, "buildorders"),
  );
  const router = useRouter();

  const busy = ref(false);

  const difficulties = ["Beginner", "Amateur", "Pro"];

  const step = (food: string = "0/10"): IStep => ({
    id: uuidv4(),
    time: "00:00",
    food,
    instructions: "",
    timing: false,
    separator: false,
  });

  const build = (): IBuild => ({
    id: uuidv4(),
    author: "",
    originalAuthor: "",
    created: moment().toDate(),
    workInProgress: false,
    name: "",
    description: "",
    version: "2.0.1",
    difficulty: "Amateur",
    viability: 3,
    games: [],
    tags: [],
    stars: 0,
    player: Race.Human,
    opponent: Race.Random,
    steps: [step("5/12")],
  });

  const game = (): ISampleGame => ({
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
        item.updated = moment().toDate();
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
      const result = await detectIncognito();
      if (!result.isPrivate) {
        const reference = doc(db, "buildorders", item.id);
        await updateDoc(reference, {
          stars: increment(1),
          starred: moment().toDate(),
        });
        data.value.starred[item.id] = true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const unstar = async (item: any) => {
    try {
      const result = await detectIncognito();
      if (!result.isPrivate) {
        const reference = doc(db, "buildorders", item.id);
        await updateDoc(reference, { stars: increment(-1) });

        delete data.value.starred[item.id];
      }
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

  const claim = async (build: any, secret: string) => {
    if (build.secret === secret && secret.length > 0) {
      try {
        data.value.owns[build.id] = true;
        const reference = doc(db, "buildorders", build.id);
        await updateDoc(reference, { secret: "" } as any);
      } catch (error) {
        return false;
      }
      return true;
    }
    return false;
  };

  const canEdit = (id?: string): boolean =>
    !_isNil(id) && (data.value.owns?.[id] ?? false);

  const data = useStorage("vivre/builds", {
    new: build(),
    edit: {},
    active: {},
    starred: {},
    owns: {},
  } as IBuildOrderState);

  return {
    buildorders,
    pending,
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
    claim,
  };
});
