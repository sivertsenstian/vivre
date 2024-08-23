import { createRouter, createWebHashHistory } from "vue-router";
import VivreView from "@/views/VivreView.vue";
import SettingsView from "@/views/SettingsView.vue";
import CreepRoutesView from "@/views/CreepRoutesView.vue";
import BuildOrderView from "@/views/BuildOrderView.vue";
import SeasonView from "@/views/SeasonView.vue";
import HappyTracker from "@/views/Events/HappyTrackerView.vue";
import RoadTo3000 from "@/views/Events/HappyRoadTo3000SummaryView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: VivreView,
    },
    {
      path: "/season",
      name: "season",
      component: SeasonView,
    },
    {
      path: "/creeproutes",
      name: "creeproutes",
      component: CreepRoutesView,
    },
    {
      path: "/events",
      name: "events",
      children: [
        {
          path: "happy-tracker",
          component: HappyTracker,
        },
        {
          path: "road-to-3000",
          component: RoadTo3000,
        },
      ],
    },
    {
      path: "/buildorders",
      name: "buildorders",
      component: BuildOrderView,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
  ],
});

export default router;
