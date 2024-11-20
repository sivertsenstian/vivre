<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from "vue";
import makrura from "@/assets/makrura.png";
import holiday_makrura from "@/assets/makrura_holiday.png";
import missing_makrura from "@/assets/makrura_missing.png";
import _map from "lodash/map";

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";

import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useMakruraStore } from "@/stores/makrura.ts";
import router from "@/router";

const store = useMakruraStore();

const chartdiv = useTemplateRef("makrura-globe");

let root: any = null;
let polygonSeries: any = null;
let chart: any = null;
let pointSeries: any = null;

onMounted(() => {
  if (chartdiv.value) {
    root = am5.Root.new(chartdiv.value);
    root.setThemes([am5themes_Animated.new(root)]);
    chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoOrthographic(),
        panX: "rotateX",
        panY: "rotateY",
      }),
    );

    let backgroundSeries = chart.series.unshift(
      am5map.MapPolygonSeries.new(root, {}),
    );

    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color("rgb(40,40,80)"),
      stroke: am5.color("rgb(40,40,80)"),
    });

    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
        valueField: "value",
        fill: am5.color("rgb(255, 255, 255)"),
        stroke: am5.color("rgb(0,0,0"),
      }),
    );

    polygonSeries.set("heatRules", [
      {
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color(0xff621f),
        max: am5.color(0x661f00),
        minValue: 1,
        maxValue: 10,
        key: "fill",
      },
    ]);

    pointSeries = chart.series.push(
      am5map.ClusteredPointSeries.new(root, {
        stopClusterZoom: 0,
      }),
    );

    const bulletTemplate = am5.Template.new({
      fill: am5.color(0xe6e6e6),
    } as any);

    pointSeries.bullets.push(function (x: any, y: any, z: any) {
      let missing = am5.Picture.new(
        root,
        {
          width: 32,
          height: 32,
          tooltipY: 0,
          centerX: am5.p50,
          centerY: am5.p50,
          src: missing_makrura,
          templateField: "bulletSettings",
          tooltipHTML: `
          <div>
            <h5><strong>Owner</strong>: {owner}</h5>
            <h5><strong>Location</strong>: {title}</h5>
            <hr />
            <div  style="margin-top: 5px; text-align: center;">
              <h4>MISSING PROOF</h4>
            </div>
          </div>
          `,
          cursorOverStyle: "pointer",
        },
        bulletTemplate as any,
      );

      let normal = am5.Picture.new(
        root,
        {
          width: 32,
          height: 32,
          tooltipY: 0,
          centerX: am5.p50,
          centerY: am5.p50,
          src: makrura,
          templateField: "bulletSettings",
          tooltipHTML: `
          <div>
            <h5><strong>Owner</strong>: {owner}</h5>
            <h5><strong>Location</strong>: {title}</h5>
            <hr />
            <div style="margin-top: 5px; text-align: center;">
              <img src={image} width="150px" height="auto" style="border: 2px solid goldenrod;"/>
            </div>
          </div>
          `,
          cursorOverStyle: "pointer",
        },
        bulletTemplate as any,
      );

      let holiday = am5.Picture.new(
        root,
        {
          width: 48,
          height: 48,
          tooltipY: 0,
          centerX: am5.p50,
          centerY: am5.p50,
          src: holiday_makrura,
          templateField: "bulletSettings",
          tooltipHTML: `
          <div>
            <h5><strong>Owner</strong>: {owner}</h5>
            <h5><strong>On Holiday</strong>: {title}</h5>
            <hr />
            <div style="margin-top: 5px; text-align: center;">
              <img src={image} width="150px" height="auto" style="border: 2px solid goldenrod;"/>
            </div>
          </div>
          `,
          cursorOverStyle: "pointer",
        },
        bulletTemplate as any,
      );

      return am5.Bullet.new(root, {
        sprite: !z.dataContext.image
          ? missing
          : z.dataContext.visit
            ? holiday
            : normal,
      });
    });

    draw();
    chart.appear(1000, 100);
  }
});

watch(store, async (newItems, oldItems) => {
  draw();
});

function generate(m: any) {
  const {
    image,
    owner,
    location,
    visit,
    position: { longitude, latitude },
  } = m;
  return {
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    visit,
    title: location,
    image,
    owner,
  };
}

const draw = () => {
  if (root !== null) {
    const countries = store.items
      .filter(store.isvalid)
      .reduce((r: any, v: any) => {
        r = { ...r, [v.country]: (r?.[v.country] ?? 0) + 1 } as any;
        return r;
      }, {} as any);
    polygonSeries.data.setAll(_map(countries, (value, id) => ({ id, value })));

    const bullets: any[] = [];
    for (let i = 0; i < store.items.length; i++) {
      const m = store.items[i];
      if (store.isvalid(m)) {
        bullets.push(generate(m));
      }
    }
    pointSeries.data.setAll(bullets);
  }
};
</script>

<template>
  <main style="height: 100vh; overflow-y: auto">
    <v-container fluid style="opacity: 0.9">
      <v-sheet class="pa-8" elevation="5" style="min-height: 90vh">
        <v-row
          ><v-col cols="12" class="mt-5">
            <v-row>
              <v-col cols="8">
                <img style="vertical-align: middle" width="48" :src="makrura" />
                <span
                  class="text-h5 font-weight-bold"
                  style="vertical-align: middle">
                  Makrura World Wide
                </span>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="() => router.push('/makrura/admin')"
                  >Admin</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="makrura-globe" ref="makrura-globe"></div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>

<style scoped>
.makrura-globe {
  margin: auto;
  width: 70vw;
  height: 70vh;
}
</style>
