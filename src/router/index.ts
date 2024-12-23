import { createRouter, createWebHashHistory } from "vue-router";
import VivreView from "@/views/VivreView.vue";
import MakruraView from "@/views/MakruraView.vue";
import MakruraAdminView from "@/views/MakruraAdminView.vue";
import AboutView from "@/views/AboutView.vue";
import CreepRoutesView from "@/views/CreepRoutesView.vue";
import SeasonView from "@/views/SeasonView.vue";
import HappyTracker from "@/views/Events/HappyTrackerView.vue";
import RoadTo3000 from "@/views/Events/HappyRoadTo3000SummaryView.vue";
import TheGreatEscapeView from "@/views/Events/TheGreateEscapeView.vue";
import BuildOrdersIndexView from "@/views/BuildOrders/BuildOrdersIndexView.vue";
import NewBuildOrderView from "@/views/BuildOrders/NewBuildOrderView.vue";
import ShowBuildOrderView from "@/views/BuildOrders/ShowBuildOrderView.vue";
import EditBuildOrderView from "@/views/BuildOrders/EditBuildOrderView.vue";
import GNLSeasonIndexView from "@/views/GNL/GNLSeasonIndexView.vue";
import GNLSeasonTeamView from "@/views/GNL/GNLSeasonTeamView.vue";

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
        {
          path: "the-great-escape",
          component: TheGreatEscapeView,
        },
      ],
    },
    {
      path: "/buildorders",
      children: [
        { path: "", name: "buildorders", component: BuildOrdersIndexView },
        {
          path: "new",
          component: NewBuildOrderView,
        },
        {
          path: ":id/edit",
          component: EditBuildOrderView,
        },
        {
          path: ":id",
          component: ShowBuildOrderView,
        },
      ],
    },
    {
      path: "/gnl",
      children: [
        { path: "", name: "gnl", component: GNLSeasonIndexView },
        {
          path: ":team",
          component: GNLSeasonTeamView,
        },
      ],
    },
    {
      path: "/makrura",
      children: [
        { path: "", name: "makrura", component: MakruraView },
        {
          path: "admin",
          component: MakruraAdminView,
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
  ],
});

export default router;
