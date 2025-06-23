import { createRouter, createWebHashHistory } from "vue-router";
import VivreView from "@/views/VivreView.vue";
import MakruraView from "@/views/MakruraView.vue";
import MakruraAdminView from "@/views/MakruraAdminView.vue";
import AboutView from "@/views/AboutView.vue";
import CreepRoutesView from "@/views/CreepRoutesView.vue";
import SeasonView from "@/views/SeasonView.vue";
import HappyTracker from "@/views/Events/HappyTrackerView.vue";
import RoadTo3000 from "@/views/Events/HappyRoadTo3000SummaryView.vue";
import RoadTo2000 from "@/views/Events/TylerRoadTo2000View.vue";
import TheGreatEscapeView from "@/views/Events/TheGreateEscapeView.vue";
import BuildOrdersIndexView from "@/views/BuildOrders/BuildOrdersIndexView.vue";
import NewBuildOrderView from "@/views/BuildOrders/NewBuildOrderView.vue";
import ShowBuildOrderView from "@/views/BuildOrders/ShowBuildOrderView.vue";
import EditBuildOrderView from "@/views/BuildOrders/EditBuildOrderView.vue";
import GNLSeasonIndexView from "@/views/GNL/GNLSeasonIndexView.vue";
import GNLSeasonTeamView from "@/views/GNL/GNLSeasonTeamView.vue";
import ChallengersView from "@/views/ChallengersView.vue";
import OnlyFangsView from "@/views/Events/OnlyFangsView.vue";
import SpartasInfernoView from "@/views/Events/SpartasInfernoView.vue";
import KLSeasonTeamView from "@/views/KL/KLSeasonTeamView.vue";
import KLSeasonIndexView from "@/views/KL/KLSeasonIndexView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "W3C Live Ladder Tracker",
      component: VivreView,
    },
    {
      path: "/challengers",
      name: "W3C Challengers",
      component: ChallengersView,
    },
    {
      path: "/season",
      name: "Season Overview",
      component: SeasonView,
    },
    {
      path: "/creeproutes",
      name: "Creep Routes",
      component: CreepRoutesView,
    },
    {
      path: "/events",
      name: "events",
      children: [
        {
          path: "happy-tracker",
          name: "Event: Happy Tracker",
          component: HappyTracker,
        },
        {
          path: "road-to-3000",
          name: "Event: Happys Road To 3000",
          component: RoadTo3000,
        },
        {
          path: "road-to-2000",
          name: "Event: Tyler1s Road To 2000",
          component: RoadTo2000,
        },
        {
          path: "the-great-escape",
          name: "Event: The Greate Ladder Escape",
          component: TheGreatEscapeView,
        },
        { path: "onlyfangs", redirect: "/events/grubbys-invitational" },
        {
          path: "grubbys-invitational",
          name: "Event: Grubbys Streamer Invitational W3C Ladder Race",
          component: OnlyFangsView,
        },
        {
          path: "dach-ladder",
          name: "Event: DACH Ladder Challenge - W3C Ladder Race",
          component: SpartasInfernoView,
        },
      ],
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
