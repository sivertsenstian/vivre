import { createRouter, createWebHashHistory } from "vue-router";
import VivreView from "@/views/VivreView.vue";
import MakruraView from "@/views/MakruraView.vue";
import MakruraAdminView from "@/views/MakruraAdminView.vue";
import AboutView from "@/views/AboutView.vue";
import CreepRoutesView from "@/views/CreepRoutesView.vue";
import SeasonView from "@/views/Season/SeasonView.vue";
import SeasonGamesView from "@/views/Season/SeasonGamesView.vue";
import SeasonMatchSummaryView from "@/views/Season/SeasonMatchSummaryView.vue";
import BuildOrdersIndexView from "@/views/BuildOrders/BuildOrdersIndexView.vue";
import NewBuildOrderView from "@/views/BuildOrders/NewBuildOrderView.vue";
import ShowBuildOrderView from "@/views/BuildOrders/ShowBuildOrderView.vue";
import EditBuildOrderView from "@/views/BuildOrders/EditBuildOrderView.vue";
import GNLSeasonIndexView from "@/views/GNL/GNLSeasonIndexView.vue";
import GNLSeasonTeamView from "@/views/GNL/GNLSeasonTeamView.vue";
import KLSeasonTeamView from "@/views/KL/KLSeasonTeamView.vue";
import KLSeasonIndexView from "@/views/KL/KLSeasonIndexView.vue";
import ChallengersView from "@/views/ChallengersView.vue";
import HotkeyStormView from "@/games/hotkeystorm/HotkeyStormView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "W3C Live Ladder Tracker",
      component: VivreView,
    },
    {
      path: "/season",
      children: [
        { path: "", name: "Season Overview", component: SeasonView },
        {
          path: ":season/games",
          name: "Season Games",
          component: SeasonGamesView,
        },
        {
          path: ":id/summary",
          name: "Match Summary",
          component: SeasonMatchSummaryView,
        },
      ],
    },
    {
      path: "/creeproutes",
      name: "Creep Routes",
      component: CreepRoutesView,
    },
    {
      path: "/buildorders",
      children: [
        { path: "", name: "Build Orders", component: BuildOrdersIndexView },
        {
          path: "new",
          name: "Create New Build Order",
          component: NewBuildOrderView,
        },
        {
          path: ":id/edit",
          name: "Edit Build Order",
          component: EditBuildOrderView,
        },
        {
          path: ":id",
          name: "Build Order",
          component: ShowBuildOrderView,
        },
      ],
    },
    {
      path: "/gnl",
      children: [
        { path: "", name: "GNL Main Page", component: GNLSeasonIndexView },
        {
          path: ":team",
          name: "GNL Team Page",
          component: GNLSeasonTeamView,
        },
      ],
    },
    {
      path: "/kreisliga",
      children: [
        {
          path: "",
          name: "Kreis Liga Main Page",
          component: KLSeasonIndexView,
        },
        {
          path: ":team",
          name: "Kreis Liga Team Page",
          component: KLSeasonTeamView,
        },
      ],
    },
    {
      path: "/makrura",
      children: [
        { path: "", name: "Makrura World Wide", component: MakruraView },
        {
          path: "admin",
          name: "Makrura Admin",
          component: MakruraAdminView,
        },
      ],
    },
    {
      path: "/games",
      children: [
        { path: "storm", name: "Hotkey Storm", component: HotkeyStormView },
      ],
    },
    {
      path: "/challengers",
      name: "W3C Challengers",
      component: ChallengersView,
    },
    {
      path: "/about",
      name: "About",
      component: AboutView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const base = "Ape Science - WC3 Research Facility";
  if (typeof to.name === "string") {
    document.title = `${base} // ${to.name}`;
  } else {
    document.title = base;
  }

  next();
});

export default router;
