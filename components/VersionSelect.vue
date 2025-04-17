<template>
  <ClientOnly>
    <v-select :items="versions" item-value="id" item-title="id" v-model="model">

    </v-select>
    <v-btn @click="useLatestRelease">Latest Release ({{ latestRelease }})</v-btn>
    <v-btn @click="useLatestSnapshot">Latest Snapshot ({{ latestSnapshot }})</v-btn>
    <dbg :data="{model,latestRelease,latestSnapshot,manifest}"></dbg>
  </ClientOnly>
</template>
<script setup lang="ts">
import {useVersionManifest} from "~/query/misc";

const {
  data: manifest,
  versionManifest
} = useVersionManifest();
const versions = computed(() => {
  return manifest.value?.versions;
});
const latestRelease = computed<string>(() => {
  return manifest.value?.latest?.release;
});
const latestSnapshot = computed<string>(() => {
  return manifest.value?.latest?.snapshot;
});

const model = defineModel<string>();


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
</script>