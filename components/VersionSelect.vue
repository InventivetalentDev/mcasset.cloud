<template>
   <div>
      <v-select label="Minecraft Version"
                :loading="manifestStatus === 'pending'"
              :items="versions" item-value="id" item-title="id"
              v-model="model">

    </v-select>
    <v-btn @click="useLatestRelease">Latest Release ({{ latestRelease }})</v-btn>
    <v-btn @click="useLatestSnapshot">Latest Snapshot ({{ latestSnapshot }})</v-btn>
    <!--    <dbg :data="{model,latestRelease,latestSnapshot,manifest}"></dbg>-->
   </div>
</template>
<script setup lang="ts">
import {useVersionManifest} from "~/query/misc";
import type {VersionManifest} from "~/types";
import {useAsyncData} from "#app";

const {
  data:manifest,
    status:manifestStatus
} = await useLazyAsyncData('version-manifest', async () => {
  return await $fetch<VersionManifest>('https://cloudflare-worker-cors.inventive.workers.dev/?url=https://piston-meta.mojang.com/mc/game/version_manifest_v2.json',{
    responseType:'json'
  });
})

// const {
//   data: manifest,
//   versionManifest
// } = useVersionManifest();
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
watch(model, () => {
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