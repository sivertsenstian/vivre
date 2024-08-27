<script setup lang="ts">
import { useTheme } from "vuetify";
import { RouterView } from "vue-router";
import bgLightUrl from "@/assets/bg_light.jpg";
import bgDarkUrl from "@/assets/bg_dark.jpg";
import logo from "@/assets/logo.png";
import { computed } from "vue";

const inProduction = import.meta.env.PROD;

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}
</script>

<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <v-list-item
          :prepend-avatar="logo"
          title="Vivre"
          subtitle="Dashboard Apelication"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item
          color="green"
          prepend-icon="mdi-crown"
          title="Live"
          router
          to="/"
        ></v-list-item>
        <v-list-item
          color="green"
          prepend-icon="mdi-flag"
          title="Season"
          router
          to="/season"
        ></v-list-item>
        <v-list-item
          color="green"
          prepend-icon="mdi-vector-polyline"
          title="Creep Routes"
          router
          to="/creeproutes"
        ></v-list-item>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              color="green"
              v-bind="props"
              prepend-icon="mdi-podcast"
              title="Events"
            ></v-list-item>
          </template>
          <v-list-item
            prepend-icon="mdi-robot-happy"
            title="Happy tracker"
            color="green"
            router
            to="/events/happy-tracker"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-trophy"
            title="3000 MMR"
            color="green"
            router
            to="/events/road-to-3000"
          ></v-list-item>
        </v-list-group>
        <v-list-item
          color="green"
          prepend-icon="mdi-castle"
          title="Build Orders"
          router
          to="/buildorders"
        ></v-list-item>
        <v-list-item
          color="green"
          prepend-icon="mdi-information"
          title="Settings"
          router
          to="settings"
        ></v-list-item>
        <v-list-item
          color="green"
          prepend-icon="mdi-handshake-outline"
          title="About"
          router
          to="about"
        ></v-list-item>
        <v-list-item
          color="yellow"
          prepend-icon="mdi-lightbulb"
          :title="isDark ? 'Light' : 'Dark'"
          @click="toggleTheme"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div
        class="container"
        :style="{
          overflow: 'hidden',
          background: 'url(' + (isDark ? bgDarkUrl : bgLightUrl) + ')',
        }"
      >
        <RouterView />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
div.container {
  height: 100vh;
  background-attachment: fixed !important;
  background-size: cover !important;
}
</style>
