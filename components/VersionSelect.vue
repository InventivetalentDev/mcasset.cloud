<template>
  <v-autocomplete label="Minecraft Version"
                  :loading="manifestStatus === 'pending'"
                  :items="items"
                  v-model="model"
                  hide-details>

  </v-autocomplete>
</template>
<script setup lang="ts">
import type {VersionManifest} from "~/types";
import {useAsyncData} from "#app";
import {useVersionManifest} from "~/composables/useVersionManifest";

const {
  manifest,
  manifestStatus,
  versions,
  latestRelease,
  latestSnapshot
} = await useVersionManifest();

const items = computed(() => {
  return (versions.value || []).map(v => ({
    id: v.id,
    title: v.id,
    props: {
      subtitle: v.type
    }
  }))
});

const model = defineModel<string>({required: true});
watch(model, () => {
  console.log("version changed");
  resolveLatest();
}, {immediate: false});

watch(manifest, () => {
  resolveLatest();
}, {immediate: false});


const useLatestRelease = () => {
  const latest = manifest.value?.versions?.find((version) => version.id === latestRelease.value);
  console.log(latest)
  if (latest) {
    model.value = latest.id;
  }
};
const useLatestSnapshot = () => {
  const latest = manifest.value?.versions?.find((version) => version.id === latestSnapshot.value);
  if (latest) {
    model.value = latest.id;
  }
};

const resolveLatest = () => {
  if (latestRelease.value && model.value === 'latest') {
    model.value = latestRelease.value;
  }
  if (latestSnapshot.value && model.value === 'snapshot') {
    model.value = latestSnapshot.value;
  }
}
</script>