<style scoped>
img {
  image-rendering: pixelated;
}
</style>
<template>
  <div>
    <h3 v-if="isNotFound">File Not Found</h3>
    <div v-else-if="assetContentLoading">
      <v-skeleton-loader type="card"/>
    </div>
    <div v-else>
      <div>{{ assetExtension }}</div>
      <v-img v-if="isImage" :src="assetRawUrl" :alt="assetName"/>
      <audio v-if="isAudio" :src="assetRawUrl" controls>
        Your browser does not support the audio element.
      </audio>
      <div v-if="isText">
        <p>Text file: {{ assetName }}</p>
        <pre><code>{{ assetContent }}</code></pre>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useAssets} from "~/query/assets";
import {useAssetPath} from "~/composables/useAssetPath";
import type {VersionManifest} from "~/types";

const props = defineProps<{
  version: string,
  path: string[]
}>();

const assetDir = useAssetPath(props.version, props.path);
const assetRawUrl = computed(() => 'https://assets.mcasset.cloud/' + assetDir.value);
const assetName = computed(() => {
  return props.path[props.path.length - 1];
});
const assetExtension = computed(() => {
  return assetName.value.split('.').pop();
});

const isImage = computed(() => {
  return assetExtension.value && ['png'].includes(assetExtension.value);
});
const isAudio = computed(() => {
  return assetExtension.value && ['ogg'].includes(assetExtension.value);
});
const isJson = computed(() => {
  return assetExtension.value && ['json'].includes(assetExtension.value);
});
const isText = computed(() => {
  return assetExtension.value && ['json', 'txt'].includes(assetExtension.value);
});

const assetContentPath = computed<string>(() => {
  return assetDir.value;
});
const assetContentType = computed(() => {
  if (isImage.value) {
    return 'blob';
  } else if (isAudio.value) {
    return 'blob';
  } else if (isJson.value) {
    return 'json';
  } else if (isText.value) {
    return 'text';
  } else {
    return 'text';
  }
})
const {
  data: assetContent,
  status: assetContentStatus,
    error:assetContentError
} = await useLazyAsyncData(async () => {
  return await $fetch<VersionManifest>(assetContentPath.value, {
    responseType: assetContentType
  });
})

// const {
//   data: assetContent,
//   path: assetContentPath,
//   responseType: assetContentType,
//   isLoading: assetContentLoading,
//   asset: assetContentStatus,
//   error: assetContentError
// } = useAssets();
// watch(assetExtension, () => {
//   if (isImage.value) {
//     assetContentType.value = 'blob';
//   } else if (isAudio.value) {
//     assetContentType.value = 'blob';
//   } else if (isJson.value) {
//     assetContentType.value = 'json';
//   } else if (isText.value) {
//     assetContentType.value = 'text';
//   } else {
//     assetContentType.value = 'text';
//   }
// }, {immediate: true});

// watch([props.version, props.path], () => {
//   assetContentPath.value = assetDir.value;
// }, {immediate: true});

const isNotFound = computed(() => {
  if (!assetContentError.value) return false;
  return assetContentError.value.statusCode === 404;
});
</script>