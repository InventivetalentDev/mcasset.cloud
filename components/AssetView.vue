<style scoped>
img {
  image-rendering: pixelated;
}

img.zoomed {
  cursor: pointer;
  width: min(50vw, 256px);
}

.asset-sheet {
  overflow-y: auto;
  max-height: 70vh;
}
</style>
<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col cols="auto">
          <h3>
            <BackBtn/>
            <code>{{ assetName }}</code>
          </h3>
        </v-col>
        <v-col v-if="isImage" cols="auto">
          <v-btn
              icon
              @click="toggleZoom"
              :class="{'zoomed': zoomed}"
          >
            <v-icon icon="mdi-magnify-plus-outline"/>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <h4 v-if="isNotFound">File Not Found</h4>
          <div v-else-if="assetContentStatus==='pending'">
            <v-skeleton-loader type="card"/>
          </div>
          <div v-else>
            <v-sheet color="grey-darken-3" class="pa-2 asset-sheet">
              <img v-if="isImage" :src="assetRawUrl" :alt="assetName" :class="{'zoomed': zoomed}"/>
              <audio v-else-if="isAudio" :src="assetRawUrl" controls>
                Your browser does not support the audio element.
              </audio>
              <div v-else>
                <pre><code>{{ assetContent }}</code></pre>
                <!--          <iframe frameborder="0" scrolling="no" style="width:100%; height:115px;" allow="clipboard-write" :src="embedUrl"></iframe>-->
              </div>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import {useAssets} from "~/query/assets";
import {useAssetPath} from "~/composables/useAssetPath";
import type {VersionManifest} from "~/types";
import BackBtn from "~/components/BackBtn.vue";

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
  return assetExtension.value && ['json', 'txt', 'mcmeta'].includes(assetExtension.value);
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
});

const cdnUrl = computed(() => {
  return 'https://assets.mcasset.cloud/' + assetContentPath.value
});


const githubUrl = computed(() => {
  return 'https://github.com/InventivetalentDev/minecraft-assets/blob/' + assetContentPath.value
});
const embedUrl = computed(() => {
  return `https://emgithub.com/iframe.html?target=${githubUrl.value}&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"`
});

const {
  data: assetContent,
  status: assetContentStatus,
  error: assetContentError
} = await useLazyAsyncData(async () => {
  return await $fetch<VersionManifest>(cdnUrl.value, {
    responseType: assetContentType.value
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

const zoomed = ref(false);
const toggleZoom = () => {
  zoomed.value = !zoomed.value;
};
</script>