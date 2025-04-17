<style scoped>
img {
  image-rendering: pixelated;
}
</style>
<template>
  <div>
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
</template>
<script setup lang="ts">
import {useAssets} from "~/query/assets";
import {useAssetPath} from "~/composables/useAssetPath";

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

const {
  data: assetContent,
  path: assetContentPath,
  responseType: assetContentType
} = useAssets();
watch(assetExtension, () => {
  if (isImage.value) {
    assetContentType.value = 'blob';
  } else if (isAudio.value) {
    assetContentType.value = 'blob';
  } else if (isJson.value) {
    assetContentType.value = 'json';
  } else if (isText.value) {
    assetContentType.value = 'text';
  } else {
    assetContentType.value = 'text';
  }
}, {immediate: true});
watch([props.version, props.path], () => {
  assetContentPath.value = assetDir.value;
}, {immediate: true});
</script>