<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { countries as allCountries, getCountryData } from "countries-list";
import makrura from "@/assets/makrura.png";
import holiday_makrura from "@/assets/makrura_holiday.png";
import missing_makrura from "@/assets/makrura_missing.png";
import new_makrura from "@/assets/makrura_new.png";

import _map from "lodash/map";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";

import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useMakruraStore } from "@/stores/makrura.ts";
import router from "@/router";
import _round from "lodash/round";
import moment from "moment";
import _isNil from "lodash/isNil";

const store = useMakruraStore();

const chartdiv = useTemplateRef("makrura-globe");

let root: any = null;
let polygonSeries: any = null;
let chart: any = null;
let pointSeries: any = null;

const search = ref();

const stats = computed(() => {
  const owned = store.items.filter(
    (m: any) => store.isvalid(m) && !m.visit,
  ).length;
  const onHoliday = store.items.filter(
    (m: any) => store.isvalid(m) && m.visit,
  ).length;

  const countries = store.items
    .filter(store.isvalid)
    .reduce((r: any, v: any) => {
      r = { ...r, [v.country]: (r?.[v.country] ?? 0) + 1 } as any;
      return r;
    }, {} as any);

  const continents = store.items
    .filter(store.isvalid)
    .reduce((r: any, v: any) => {
      const c = getCountryData(v.country);
      r = {
        ...r,
        [c.continent]: (r?.[c.continent] ?? 0) + 1,
      } as any;
      return r;
    }, {} as any);

  const all = Object.keys(allCountries)?.length ?? 0;

  return {
    continents,
    countries: Object.keys(countries).length,
    totalCountries: all,
    countryCoverage: _round((Object.keys(countries).length / all) * 100, 2),
    owners: owned,
    onHoliday: onHoliday,
    total: owned + onHoliday,
  };
});

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
        calculateAggregates: true,
      }),
    );

    polygonSeries.set("heatRules", [
      {
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color(0xff621f),
        max: am5.color(0x661f00),
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
      toggleKey: "active",
    } as any);

    bulletTemplate.on("active" as any, (_: any, target: any) => {
      const id: any = target?.dataItem?.dataContext?.id;
      if (id) {
        search.value = id;
      }
    });

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
              <img src={image} width="250px" height="auto" style="border: 2px solid goldenrod;"/>
            </div>
          </div>
          `,
          cursorOverStyle: "pointer",
        },
        bulletTemplate as any,
      );

      let recent = am5.Picture.new(
        root,
        {
          width: 32,
          height: 32,
          tooltipY: 0,
          centerX: am5.p50,
          centerY: am5.p50,
          src: new_makrura,
          templateField: "bulletSettings",
          tooltipHTML: `
          <div>
            <h5 style='text-align: center'><i>Recently added/updated</i></h5>
            <h5><strong>Owner</strong>: {owner}</h5>
            <h5><strong>Location</strong>: {title}</h5>
            <hr />
            <div style="margin-top: 5px; text-align: center;">
              <img src={image} width="250px" height="auto" style="border: 2px solid goldenrod;"/>
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
              <img src={image} width="250px" height="auto" style="border: 2px solid goldenrod;"/>
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
            : z.dataContext.recent
              ? recent
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
    id,
    image,
    owner,
    location,
    updated,
    created,
    visit,
    position: { longitude, latitude },
  } = m;

  const u =
    !_isNil(updated) &&
    moment(updated?.toDate() ?? updated).isSame(moment(), "week");
  const c =
    !_isNil(created) &&
    moment(created?.toDate() ?? created).isSame(moment(), "week");

  return {
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    recent: u || c,
    visit,
    title: location,
    image,
    owner,
    id,
  };
}

watch(search, (newSearch) => {
  const item = store.items.filter((i) => i.id === newSearch)?.[0];
  if (item?.position) {
    selectMakrura(item.position);
  }
});

const selectMakrura = (coordinates: {
  longitude: number;
  latitude: number;
}) => {
  if (coordinates?.latitude) {
    const geopoint = { ...coordinates, zoom: 5 };

    chart.animate({
      key: "rotationX",
      to: -geopoint.longitude,
      duration: 1500,
      easing: am5.ease.inOut(am5.ease.cubic),
    });
    chart.animate({
      key: "rotationY",
      to: -geopoint.latitude,
      duration: 1500,
      easing: am5.ease.inOut(am5.ease.cubic),
    });

    setTimeout(function () {
      chart.zoomToGeoPoint(geopoint, geopoint.zoom, true);
    }, 1500);
  }
};

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
    <v-container fluid style="opacity: 1">
      <v-sheet class="pa-8" elevation="5" style="min-height: 90vh">
        <v-row
          ><v-col cols="12" class="mt-5">
            <v-row>
              <v-col cols="4">
                <img style="vertical-align: middle" width="48" :src="makrura" />
                <span
                  class="text-h5 font-weight-bold"
                  style="vertical-align: middle">
                  Makrura World Wide
                </span>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  :disabled="store.pending"
                  :items="store.items.filter(store.isvalid)"
                  clearable
                  v-model="search"
                  class="mx-auto"
                  density="comfortable"
                  placeholder="Search for makrura owner..."
                  prepend-inner-icon="mdi-magnify"
                  color="warning"
                  variant="underlined"
                  item-title="owner"
                  item-value="id"
                  auto-select-first>
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-spider-thread"
                      :subtitle="`${item.raw.visit ? 'On holiday in ' : ''}${item.raw.location}`"
                      :title="`Mr. ${item.raw.owner}`"></v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="() => router.push('/makrura/admin')"
                  >Admin</v-btn
                >
              </v-col>
              <v-fade-transition>
                <v-row v-if="store.pending">
                  <v-col
                    class="text-subtitle-1 text-center text-warning"
                    cols="12">
                    <strong>Taming Makruras...</strong>
                    <v-icon
                      color="warning"
                      icon="mdi-spider-thread"
                      class="scatter" />
                    <v-icon
                      color="warning"
                      icon="mdi-spider-thread"
                      class="scatter delay-1" />
                    <v-icon
                      color="warning"
                      icon="mdi-spider-thread"
                      class="scatter delay-2" />
                  </v-col>
                  <v-col cols="12" style="margin-top: -20px">
                    <v-progress-linear
                      indeterminate
                      rounded
                      color="warning"
                      :active="store.pending" />
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="makrura-globe" ref="makrura-globe"></div>
          </v-col>
        </v-row>
        <v-row v-if="stats.total" class="legend">
          <v-col cols="12" md="3">
            <v-sheet
              elevation="5"
              style="border: 2px solid darkgoldenrod; border-radius: 10px">
              <v-table>
                <thead>
                  <tr>
                    <td colspan="1" class="text-h5 font-weight-bold">
                      Stats
                      <hr color="goldenrod" />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="font-weight-bold">Countries:</td>
                    <td class="font-weight-bold">
                      <span style="color: goldenrod" class="font-weight-bold">{{
                        stats.countries
                      }}</span>
                      / {{ stats.totalCountries }} ({{
                        stats.countryCoverage
                      }}%)
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Continents:</td>
                    <td class="font-weight-bold text-no-wrap">
                      <span v-for="(v, k, i) in stats.continents">
                        <span style="color: goldenrod" class="font-weight-bold">
                          {{ k }}:
                        </span>
                        <span class="font-weight-bold"> {{ v }}</span>
                        <span
                          class="font-weight-bold"
                          v-if="i !== Object.keys(stats.continents).length - 1">
                          //
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Makrura Owners:</td>
                    <td class="font-weight-bold" style="color: goldenrod">
                      {{ stats.owners }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Makruras On Holiday:</td>
                    <td class="font-weight-bold" style="color: goldenrod">
                      {{ stats.onHoliday }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Total Makruras:</td>
                    <td class="font-weight-bold" style="color: goldenrod">
                      {{ stats.total }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </main>
</template>

<style scoped>
.makrura-globe {
  margin: auto;
  width: 90vw;
  height: 80vh;
}

@media (min-width: 960px) {
  .legend {
    position: relative;
    bottom: 310px;
    left: -30px;
    height: 0;
  }
}

.scatter {
  position: relative;
  animation: linear infinite;
  animation-name: run;
  animation-duration: 5s;

  &.delay-1 {
    animation-delay: 400ms;
  }

  &.delay-2 {
    animation-delay: 800ms;
  }
}

@keyframes run {
  0% {
    left: 0;
  }
  50% {
    left: 40%;
  }
  100% {
    left: 0;
  }
}
</style>
