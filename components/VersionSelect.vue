<template>
  <div>
    <v-autocomplete label="Minecraft Version"
                    :loading="manifestStatus === 'pending' || availableStatus === 'pending'"
                    :items="items"
                    v-model="model"
                    hide-details>

    </v-autocomplete>
    <div class="px-2 text-center">
      <a @click.prevent="useLatestRelease" href="/latest">Latest Release</a> | <a @click.prevent="useLatestSnapshot" href="/snapshot">Latest Snapshot</a>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {AvailableVersions, ManifestVersion, VersionManifest} from "~/types";
import {useAsyncData, useLazyAsyncData} from "#app";
import {useVersionManifest} from "~/composables/useVersionManifest";

const {
  manifest,
  manifestStatus,
  versions,
  latestRelease,
  latestSnapshot
} = await useVersionManifest();

const {
  data: availableVersions,
  status: availableStatus
} = await useLazyAsyncData('version-list', async () => {
  return await $fetch<AvailableVersions>('https://assets.mcasset.cloud/versions.json', {
    responseType: 'json'
  })
});
const availableVersionNames = computed<string[]>(() => {
  return availableVersions.value?.versions?.map(version => version.name) || [];
});

const isAvailable = (version: string) => {
  return availableVersionNames.value?.includes(version);
}

const items = computed(() => {
  return (versions.value || []).map(v => ({
    id: v.id,
    title: v.id,
    props: {
      subtitle: v.type,
      appendIcon: isAvailable(v.id) ? null : 'mdi-close',
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