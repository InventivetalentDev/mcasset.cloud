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
    <v-col>
        <v-row>
            <v-col cols="12" md="auto">
                <h3>
                    <BackBtn/>
                    <code>{{ assetName }}</code>
                    <span class="text-medium-emphasis text-body-2 mx-2">{{ contentSizeText }}</span>
                </h3>
            </v-col>
            <v-col v-if="isImage" cols="4" md="auto">
                <v-btn
                    icon
                    @click="toggleZoom"
                    :class="{'zoomed': zoomed}"
                >
                    <v-icon icon="mdi-magnify-plus-outline"/>
                </v-btn>
            </v-col>
            <v-spacer/>
            <v-col class="text-end" cols="8" md="auto">
                <v-btn variant="outlined" size="small" color="secondary" class="mx-1" :href="cdnUrl" target="_blank"
                       append-icon="mdi-open-in-new">Raw
                </v-btn>
                <v-btn variant="outlined" size="small" color="secondary" class="mx-1" :href="githubUrl"
                       target="_blank" prepend-icon="mdi-github" append-icon="mdi-open-in-new">GitHub
                </v-btn>
                <v-btn variant="outlined" size="small" color="secondary" class="mx-1" @click="downloadFile"
                       prepend-icon="mdi-download">Download File
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pt-0">
                <h4 v-if="isNotFound">File Not Found</h4>
                <h4 v-else-if="assetContentStatus==='error'">
                    Failed to load file content
                </h4>
                <div v-else-if="assetContentStatus==='pending'">
                    <v-skeleton-loader type="card"/>
                </div>
                <div v-else>
                    <v-sheet color="grey-darken-3" class="pa-2 asset-sheet">
                        <div v-if="contentTooLarge || forceRaw">
                            <a :href="cdnUrl" target="_blank">View Raw</a>
                        </div>
                        <img v-else-if="isImage" :src="assetRawUrl" :alt="assetName" :class="{'zoomed': zoomed}"/>
                        <audio v-else-if="isAudio" :src="assetRawUrl" controls>
                            Your browser does not support the audio element.
                        </audio>
                        <div v-else>
                            <span v-if="contentSizeBytes<=0"><i>Empty File</i></span>
                            <BlobAsText :blob="assetContent"/>
                            <!--          <iframe frameborder="0" scrolling="no" style="width:100%; height:115px;" allow="clipboard-write" :src="embedUrl"></iframe>-->
                        </div>
                        <dbg :data="{assetContentType}"/>
                    </v-sheet>
                </div>
            </v-col>
        </v-row>
    </v-col>
</template>
<script setup lang="ts">
import { useAssets } from "~/query/assets";
import { useAssetPath, useAssetPathParts } from "~/composables/useAssetPath";
import type { VersionManifest } from "~/types";
import BackBtn from "~/components/BackBtn.vue";
import BlobAsText from "~/components/BlobAsText.vue";

const props = defineProps<{
    version: string,
    path: string[]
}>();

const assetDir = useAssetPath(props.version, props.path);
const assetPathParts = useAssetPathParts(props.version, props.path);
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
const forceRaw = computed(() => {
    return assetExtension.value && ['nbt'].includes(assetExtension.value);
});

const assetContentPath = computed<string>(() => {
    return assetDir.value;
});
const assetContentType = computed(() => {
    // if (isImage.value) {
    //     return 'blob';
    // } else if (isAudio.value) {
    //     return 'blob';
    // } else if (isJson.value) {
    //     return 'json';
    // } else if (isText.value) {
    //     return 'text';
    // } else {
    //     return 'blob';
    // }
    return 'blob';
});

const cdnUrl = computed(() => {
    return 'https://assets.mcasset.cloud/' + assetContentPath.value
});


const githubUrl = computed(() => {
    return 'https://github.com/InventivetalentDev/minecraft-assets/blob/' + assetContentPath.value
});
const embedUrl = computed(() => {
    return `https://emgithub.com/iframe.html?target=${ githubUrl.value }&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"`
});

const {
    data: assetContent,
    status: assetContentStatus,
    error: assetContentError
} = await useLazyAsyncData('asset-content-' + assetDir.value, async () => {
    return await $fetch(cdnUrl.value, {
        responseType: assetContentType.value,
    });
});

const contentSizeBytes = computed(() => {
    if (!assetContent.value) return 0;
    if (assetContent.value instanceof Blob) {
        return assetContent.value.size;
    }
    return 0;
});

const contentSizeText = computed(() => {
    if (!assetContent.value) return '0 B';
    if (assetContent.value instanceof Blob) {
        const size = assetContent.value.size;
        if (size < 1024) return size + ' B';
        if (size < 1024 * 1024) return Math.round(size / 1024) + ' KB';
        if (size < 1024 * 1024 * 1024) return Math.round(size / (1024 * 1024)) + ' MB';
        return Math.round(size / (1024 * 1024 * 1024)) + ' GB';
    }
    return '0 B';
});

const contentTooLarge = computed(() => {
    return contentSizeBytes.value > 1024 * 32;
});

const asText = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (e) => {
            reject(e);
        };
        reader.readAsText(blob);
    });
};

const textContent = computed(() => {
    if (assetContent.value instanceof Blob) {
        return asText(assetContent.value);
    }
    return '';
});

const ogImage = computed(() => {
    if (isImage.value) {
        return cdnUrl.value;
    }
    return undefined;
});
const ogAudio = computed(() => {
    if (isAudio.value) {
        return cdnUrl.value;
    }
    return undefined;
});
const metaTitle = computed(() => assetName.value);
useSeoMeta({
    title: metaTitle,
    ogTitle: metaTitle,
    twitterTitle: metaTitle,
    ogImage: ogImage,
    ogAudio: ogAudio,
});

const ldJsonContent = computed(() => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": metaTitle.value,
        "url": `https://mcasset.cloud/${ assetDir.value }`,
        "image": ogImage.value
        //TODO: date published
    });
});
const ldBreadcrumbContent = computed(() => {
    const items = [];
    for (let i = 0; i < assetPathParts.value.length; i++) {
        items.push({
            "@type": "ListItem",
            "position": i + 1,
            "name": assetPathParts.value[i],
            "item": `https://mcasset.cloud/${ assetPathParts.value.slice(0, i + 1).join('/') }`
        });
    }
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    })
})

useHead({
    link: [
        {
            rel: 'canonical',
            href: `https://mcasset.cloud/${ assetDir }`
        }
    ],
    script: [
        {
            type: 'application/ld+json',
            'data-ld-id': 'asset-webpage',
            innerHTML: ldJsonContent
        },
        {
            type: 'application/ld+json',
            'data-ld-id': 'asset-breadcrumb',
            innerHTML: ldBreadcrumbContent
        }
    ]
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

const downloadFile = () => {
    const blob = new Blob([assetContent.value], {type: assetContentType.value});
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.href = url;
    el.download = assetName.value;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    URL.revokeObjectURL(url);
};

const isNotFound = computed(() => {
    if (!assetContentError.value) return false;
    return assetContentError.value.statusCode === 404;
});

const zoomed = ref(false);
const toggleZoom = () => {
    zoomed.value = !zoomed.value;
};
</script>