<script setup lang="ts">
import { useDisplay, useTheme } from "vuetify";
import { RouterView, useRoute } from "vue-router";
import bgLightUrl from "@/assets/bg_light.jpg";
import bgDarkUrl from "@/assets/bg_dark.jpg";
import logo from "@/assets/logo.png";
import { computed, ref } from "vue";
const { mobile } = useDisplay();

const inProduction = import.meta.env.PROD;

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}

const route = useRoute();

const drawer = ref(!mobile.value);
</script>

<template>
  <v-app>
    <v-app-bar v-if="$vuetify.display.mobile">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      <v-toolbar-title>Ape Science</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      expand-on-hover
      rail
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined">
      <v-list>
        <v-list-item
          :prepend-avatar="logo"
          title="APE SCIENCE"
          subtitle="WC3 Research Facility"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item
          color="green"
          prepend-icon="mdi-crown"
          title="Ladder Profile"
          router
          to="/" />
        <v-list-item
          color="green"
          prepend-icon="mdi-flag"
          title="Season Profile"
          router
          to="/season" />
        <v-list-item
          color="green"
          prepend-icon="mdi-vector-polyline"
          title="Creep Routes"
          router
          to="/creeproutes" />
        <v-list-item
          color="green"
          prepend-icon="mdi-castle"
          title="Build Orders"
          router
          to="/buildorders" />
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              color="green"
              v-bind="props"
              prepend-icon="mdi-podium-silver"
              title="Gym Newbie League"
              router
              to="/gnl"></v-list-item>
          </template>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Thrall's Thundershock"
            color="green-lighten-3"
            router
            to="/gnl/tttg"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Chinese Panda"
            color="green-lighten-3"
            router
            to="/gnl/panda"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Fiends with Benefits"
            color="green-lighten-3"
            router
            to="/gnl/fiends"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Clutch or Kick"
            color="green-lighten-3"
            router
            to="/gnl/cok"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Pitty Party"
            color="green-lighten-3"
            router
            to="/gnl/pitty"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Apelords"
            color="green-lighten-3"
            router
            to="/gnl/apelords"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Giggling Goblins"
            color="green-lighten-3"
            router
            to="/gnl/gigglinggoblins"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="GNL Bears"
            color="green-lighten-3"
            router
            to="/gnl/gnlbears"></v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              color="green"
              v-bind="props"
              prepend-icon="mdi-podium-gold"
              title="Kreis Liga"
              router
              to="/kreisliga"></v-list-item>
          </template>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Vashj's Vipers"
            color="green-lighten-3"
            router
            to="/kreisliga/vashjsvipers"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Azeroth Titans"
            color="green-lighten-3"
            router
            to="/kreisliga/azerothtitans"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Pandarens"
            color="green-lighten-3"
            router
            to="/kreisliga/pandarens"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="FC Westfall"
            color="green-lighten-3"
            router
            to="/kreisliga/fcwestfall"></v-list-item>
          <v-list-item
            prepend-icon="mdi-shield-crown-outline"
            title="Liga Leitung"
            color="green-lighten-3"
            router
            to="/kreisliga/ligaleitung"></v-list-item>
        </v-list-group>
        <v-list-item
          color="red"
          prepend-icon="mdi-earth"
          title="Makrura"
          router
          to="/makrura"></v-list-item>
        <v-list-item
          color="red"
          prepend-icon="mdi-account-group"
          title="Challengers Ladder"
          router
          to="/challengers"></v-list-item>
        <v-list-item
          color="green"
          prepend-icon="mdi-handshake-outline"
          title="About"
          router
          to="/about"></v-list-item>
        <v-list-item
          color="yellow"
          prepend-icon="mdi-lightbulb"
          :title="isDark ? 'Light' : 'Dark'"
          @click="toggleTheme">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div
        class="container"
        :style="{
          overflow: 'hidden',
          background: 'url(' + (isDark ? bgDarkUrl : bgLightUrl) + ')',
        }">
        <RouterView :key="route.fullPath" />
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

.v-list-group__items .v-list-item {
  padding-inline-start: 15px !important;
}
</style>
