<script setup lang="ts">
import { Race, raceIcon } from "@/stores/races";
import hu_banner from "@/assets/take_a_look_at_banner_michael.png";
import oc_banner from "@/assets/take_a_look_at_banner_orc.png";
import ud_banner from "@/assets/take_a_look_at_banner_undead.png";
import ne_banner from "@/assets/take_a_look_at_banner_nightelf.png";
import r_banner from "@/assets/take_a_look_at_banner_random.png";

const raceBanner: any = {
  [Race.Human]: hu_banner,
  [Race.Orc]: oc_banner,
  [Race.Undead]: ud_banner,
  [Race.NightElf]: ne_banner,
  [Race.Random]: r_banner,
};

interface Props {
  race: Race;
  current: number;
  diff: number;
  label: string;
}
defineProps<Props>();
</script>

<template>
  <div class="text-h6 text-black text-center">
    <v-card elevation="0">
      <v-card-item>
        <v-card-title>
          <span
            style="display: flex; align-items: center; justify-content: center"
          >
            <img
              style="vertical-align: middle"
              width="135px"
              :src="raceBanner[race]"
            />
            <span
              style="
                opacity: 0.87;
                vertical-align: middle;
                position: relative;
                right: 103px;
                bottom: 55px;
                width: 0;
              "
            >
              <img
                style="vertical-align: middle"
                width="75px"
                :src="raceIcon[race]"
              />
            </span>
            <span
              v-if="current > 100"
              class="text-h5 text-white"
              style="
                opacity: 0.87;
                vertical-align: middle;
                position: relative;
                right: 92px;
                bottom: 0px;
                width: 0;
              "
              >{{ current }}</span
            >
            <span
              class="text-white"
              style="
                opacity: 0.87;
                font-size: 16px !important;
                vertical-align: middle;
                position: relative;
                right: 85px;
                bottom: -25px;
                width: 0;
              "
              >MMR</span
            >
          </span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pa-0 pt-2">
              <span class="ml-2 title">
                <span
                  :class="{
                    'text-green': diff > 0,
                    'text-red': diff < 0,
                  }"
                >
                  <span v-if="diff > 0">+</span>
                  {{ diff }}
                </span>
                {{ label }}
              </span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card-item>
    </v-card>
  </div>
</template>

<style scoped></style>
