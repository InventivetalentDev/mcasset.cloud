<template>
  <div>
    <!--    <dbg :data="{assetStatus,assetListPath:assetIndexPath,assetList,isNotFound}"/>-->
    <h3 v-if="isNotFound">{{ path.length <= 1 ? 'Version Not Found' : 'Folder Not Found' }}</h3>
    <div v-else-if="assetIndexLoading">
      <v-skeleton-loader type="list-item-avatar@16"/>
    </div>
    <div v-else>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import {useAssets} from "~/query/assets";
import type {AssetIndex} from "~/types/assets";
import {useAssetPath} from "~/composables/useAssetPath";

const props = defineProps<{
  version: string,
  path: string[]
}>();

const assetDir = useAssetPath(props.version, props.path);

const {
  data: assetIndex,
  path: assetIndexPath,
  isLoading: assetIndexLoading,
  asset: assetStatus,
  error: assetError
} = useAssets();
watch([props.version, props.path], () => {
  assetIndexPath.value = assetDir.value + '/_list.json';
}, {immediate: true});

const isNotFound = computed(() => {
  if (!assetError.value) return false;
  return assetError.value.statusCode === 404;
});

const assetList = computed(() => {
  if (!assetIndex.value) return [];
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