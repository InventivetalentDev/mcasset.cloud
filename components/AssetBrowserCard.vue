<template>
  <v-card>
    <v-card-text>
      <AssetListOrView :version="version" :path="path"/>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import AssetView from "~/components/AssetView.vue";
import AssetList from "~/components/AssetList.vue";

const props = defineProps<{
  version: string,
  path: string[]
}>();

const assetDir = computed(() => [props.version, ...props.path].join('/'));
const assetName = computed(() => {
  return props.path[props.path.length - 1];
});
const assetIsFile = computed(() => {
  return props.path.length > 0 && props.path[props.path.length - 1].includes('.');
});
</script>