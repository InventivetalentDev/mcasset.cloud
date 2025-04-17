<template>
  <AssetView v-if="assetIsFile" :version="version" :path="path"/>
  <AssetList v-else :version="version" :path="path"/>
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