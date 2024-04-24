import _last from "lodash/last";
import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { Race } from "@/stores/races";

export const useBuildsStore = defineStore("builds", () => {
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
    name: "",
    player: Race.Human,
    opponent: Race.Orc,
    steps: [step()],
  });

  const save = () => {};

  const clear = () => {};

  const addStep = () => {
    const l = _last(data.value.new.steps);
    const s = step();
    if (l) {
      s.time = l.time;
      s.food = l.food;
    }
    data.value.new.steps = [...data.value.new.steps, s];
  };

  const removeStep = (step: any) => {
    data.value.new.steps = data.value.new.steps.filter((s) => s.id !== step.id);
  };

  const setActive = (build: any) => {};

  const data = useStorage("vivre/builds", {
    new: build(),
    builds: {},
    active: {},
  });

  return { data, addStep, removeStep, save, clear };
});
