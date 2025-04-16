<template>
  <dbg :data="{assetListPath:assetIndexPath,assetList}"/>
  <v-list>
    <v-list-item v-for="asset in assetList" :key="asset.name">
      <template v-slot:prepend>
        <v-avatar color="grey-lighten-1">
          <v-icon v-if="asset.type==='dir'" color="white">mdi-folder</v-icon>
        </v-avatar>
      </template>
      <template v-slot:title>
        <NuxtLink :to="asset.path">
          {{ asset.name }}
        </NuxtLink>
      </template>

    </v-list-item>
  </v-list>
</template>
<script setup lang="ts">
import {useAssets} from "~/query/assets";
import type {AssetIndex} from "~/types/assets";

const props = defineProps<{
  version: string,
  path: string[]
}>();

const assetDir = computed(() => [props.version, ...props.path].join('/'));

const {
  data: assetIndex,
  path: assetIndexPath
} = useAssets();
watch([props.version, props.path], () => {
  assetIndexPath.value = assetDir.value + '/_list.json';
}, {immediate: true});

const assetList = computed(() => {
  if(!assetIndex.value) return [];
  const {directories, files} = (assetIndex.value as AssetIndex);
  return [
    ...directories.map(dir => ({
      type: 'dir',
      name: dir,
      path: `/${assetDir.value}/${dir}`
    })),
    ...files.map(file => ({
      type: 'file',
      name: file,
      path: `/${assetDir.value}/${file}`
    }))
  ];
})
</script>