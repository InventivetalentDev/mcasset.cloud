<template>
  <div>
    <h3>
      <BackBtn/>
      <code>{{ dirName }}</code>/
    </h3>
    <!--    <dbg :data="{assetStatus,assetIndex,assetListPath:assetIndexPath,assetList,isNotFound}"/>-->
    <h4 v-if="isNotFound">{{ path.length <= 1 ? 'Version Not Found' : 'Folder Not Found' }}</h4>
    <div v-else-if="assetStatus==='pending'">
      <v-skeleton-loader type="list-item-avatar@16"/>
    </div>
    <div v-else>
      <v-list>
        <v-list-item v-for="asset in assetList" :key="asset.name">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon v-if="asset.type==='dir'" color="white">mdi-folder</v-icon>
              <v-icon v-else color="white">mdi-file</v-icon>
            </v-avatar>
          </template>
          <template v-slot:title>
            <NuxtLink :to="asset.path" class="text-decoration-none">
              <code>{{ asset.name }}</code>
            </NuxtLink>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {AssetIndex} from "~/types/assets";
import {useAssetPath} from "~/composables/useAssetPath";
import {useAsyncData, useLazyAsyncData} from "#app";
import BackBtn from "~/components/BackBtn.vue";

const props = defineProps<{
  version: string,
  path: string[]
}>();

const assetDir = useAssetPath(props.version, props.path);

const dirName = computed(() => {
  return props.path[props.path.length - 1];
});

const assetIndexPath = computed<string>(() => {
  return assetDir.value + '/_list.json';
});
const assetKey = computed(() => {
  return 'asset-index-' + assetIndexPath.value;
})

onMounted(() => {
  console.log(assetKey);
})

const {
  data: assetIndex,
  error: assetError,
  status: assetStatus
} = await useLazyAsyncData(async () => {
  return await $fetch('https://assets.mcasset.cloud/' + assetIndexPath.value, {
    responseType: 'json'
  })
})

// const {
//   data: assetIndex,
//   path: assetIndexPath,
//   isLoading: assetIndexLoading,
//   asset: assetStatus,
//   error: assetError
// } = useAssets();


// watch([props.version, props.path], () => {
//   assetIndexPath.value = assetDir.value + '/_list.json';
// }, {immediate: true});

const isNotFound = computed(() => {
  if (!assetError.value) return false;
  return assetError.value.statusCode === 404;
});

const assetList = computed(() => {
  if (!assetIndex.value) return [];
  console.log(assetIndex.value)
  const {directories, files} = (assetIndex.value as AssetIndex);
  return [
    ...(directories || []).map(dir => ({
      type: 'dir',
      name: dir,
      path: `/${assetDir.value}/${dir}`
    })),
    ...(files || []).map(file => ({
      type: 'file',
      name: file,
      path: `/${assetDir.value}/${file}`
    }))
  ];
})
</script>