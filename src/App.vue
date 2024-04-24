<script setup lang="ts">
import { RouterView } from "vue-router";
import bgUrl from "@/assets/bg_light.jpg";
import logo from "@/assets/logo.png";

const inProduction = import.meta.env.PROD;
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
          prepend-icon="mdi-crown"
          title="Home"
          router
          to="/"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-vector-polyline"
          title="Creep Routes"
          router
          to="creeproutes"
        ></v-list-item>
        <v-list-item
          :disabled="inProduction"
          prepend-icon="mdi-castle"
          title="Build Orders"
          router
          to="buildorders"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-information"
          title="Settings"
          router
          to="settings"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div class="container" :style="{ background: 'url(' + bgUrl + ')' }">
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
