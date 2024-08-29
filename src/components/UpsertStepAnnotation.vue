<script setup lang="ts">
import { ref } from "vue";
import type { IStep, IStepAnnotation } from "@/utilities/types";

interface Props {
  step: IStep;
  edit?: boolean;
}
const props = defineProps<Props>();

const blank = (): IStepAnnotation => ({
  type: "None",
  text: "",
});

const current = (): IStepAnnotation =>
  props.step.annotation ? { ...props.step.annotation } : blank();

const menu = ref(false);
const annotation = ref<IStepAnnotation>(
  props.edit && props.step.annotation ? current() : blank(),
);

const save = () => {
  if (annotation.value?.type !== "None") {
    props.step.annotation = annotation.value;
    menu.value = false;
  }
};

const cancel = () => {
  if (props.edit) {
    annotation.value = current();
  }
  menu.value = false;
};

const reset = () => {
  annotation.value = blank();
  delete props.step.annotation;
  menu.value = false;
};

const color = (type?: string) => {
  switch (type) {
    case "Information":
      return "secondary";
    case "Army":
      return "yellow";
    case "Tech":
      return "purple-lighten-2";
    default:
      return "grey";
  }
};
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="end"
    width="400px"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        title="Add or edit annotation"
        v-bind="props"
        variant="text"
        size="small"
        icon="mdi-information-outline"
        :ripple="false"
        :color="color(step.annotation?.type)"
      />
    </template>

    <v-card min-width="300">
      <v-list>
        <v-list-item subtitle="Annotation" :title="annotation.type">
          <template v-slot:prepend>
            <v-btn
              :class="`text-${color(annotation.type)}`"
              icon="mdi-information-outline"
              variant="text"
            ></v-btn>
          </template>
          <template v-slot:append>
            <v-btn
              :disabled="!step.annotation"
              icon="mdi-delete-outline"
              color="error"
              variant="text"
              @click="() => reset()"
              title="Remove annotation"
            />
          </template>
        </v-list-item>
      </v-list>
      <v-divider />

      <v-list>
        <v-list-item class="d-flex justify-space-around">
          <v-chip-group mandatory variant="tonal" v-model="annotation.type">
            <v-chip
              v-if="annotation.type === 'None'"
              label
              filter
              :color="color('None')"
              size="small"
              value="None"
            >
              None
            </v-chip>
            <v-chip
              label
              filter
              :color="color('Information')"
              size="small"
              value="Information"
            >
              Information
            </v-chip>
            <v-chip
              label
              filter
              :color="color('Army')"
              size="small"
              value="Army"
            >
              Army
            </v-chip>
            <v-chip
              label
              filter
              :color="color('Tech')"
              size="small"
              value="Tech"
            >
              Tech
            </v-chip>
          </v-chip-group>
        </v-list-item>

        <v-list-item>
          <v-textarea
            :placeholder="
              annotation.type === 'None'
                ? 'Select the type of annotation you would like'
                : 'Write annotation here...'
            "
            :base-color="color(annotation.type)"
            :disabled="annotation.type === 'None'"
            hide-details
            density="compact"
            variant="underlined"
            v-model="annotation.text"
          ></v-textarea>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="() => cancel()"> Cancel </v-btn>
        <v-btn
          :disabled="annotation?.type === 'None'"
          color="primary"
          variant="text"
          @click="() => save()"
        >
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
