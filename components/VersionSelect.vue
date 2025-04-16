<template>
  <ClientOnly>
    <v-select :items="versions" item-value="id" item-title="id" v-model="model">

    </v-select>
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

const model = defineModel<string>();
</script>