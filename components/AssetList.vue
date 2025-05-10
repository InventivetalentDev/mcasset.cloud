<style scoped>
.asset-list {
    overflow-y: auto;
    max-height: 70vh
}

</style>
<template>
    <v-col>
        <v-row>
            <v-col class="pb-0" cols="6" md="auto">
                <h3>
                    <BackBtn/>
                    <code>{{ dirName }}/</code>
                </h3>
            </v-col>
            <v-col cols="4" md="auto" class="pt-3 pb-0">
                <AssetSearchDialog :version="version" :path="path"/>
            </v-col>
            <v-spacer/>
            <v-col class="text-end" cols="12" md="auto">
                <span class="mx-1"><v-icon icon="mdi-folder"/> {{ dirCount }}</span>
                <span class="mx-1"><v-icon icon="mdi-file"/> {{ fileCount }}</span>
                <span class="text-medium-emphasis mx-2">|</span>
                <v-btn variant="outlined" size="small" color="secondary" class="mx-1" :href="githubUrl" target="_blank"
                       prepend-icon="mdi-github" append-icon="mdi-open-in-new">GitHub
                </v-btn>
                <v-btn variant="outlined" size="small" color="secondary" class="mx-1" :href="dirDownloadUrl"
                       target="_blank" prepend-icon="mdi-folder-download">Download Folder
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pt-0">
                <!--    <dbg :data="{assetStatus,assetIndex,assetListPath:assetIndexPath,assetList,isNotFound}"/>-->
                <div v-if="isNotFound">
                    <span v-if="path.length<=1">
                        <v-icon icon="mdi-alert-circle-outline" class="me-2"/>
                        <b>Version not found</b><br/>
                        <a href="#" @click.prevent="requestVersion" v-if="!versionRequested">Request this version</a>
                        <v-alert v-if="showRequestedNotice" type="success" width="400" class="ma-2">
                            <template #text>
                                <b>Version requested</b><br/>
                                Assets will be downloaded as soon as possible.
                            </template>
                        </v-alert>
                    </span>
                    <span v-else>
                        <v-icon icon="mdi-alert-circle-outline" class="me-2"/>
                        <b>Folder not found</b>
                    </span>
                </div>
                <h4 v-else-if="assetStatus==='error'">
                    Failed to load asset list
                </h4>
                <div v-else-if="assetStatus==='pending'">
                    <v-skeleton-loader type="list-item-avatar@8"/>
                </div>
                <div v-else>
                    <v-list class="asset-list" @scroll="storeScroll" ref="asset-list">
                        <v-virtual-scroll :items="assetList" min-height="200" item-height="48">
                            <template #default="{item:asset}">
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-avatar
                                            :color="asset.type==='dir'?'secondary': asset.image ? 'surface-variant': 'primary'"
                                            rounded="sm">
                                            <v-icon v-if="asset.type==='dir'">mdi-folder</v-icon>
                                            <v-img v-else-if="asset.image"
                                                   style="image-rendering: pixelated"
                                                   :src="'https://assets.mcasset.cloud' + asset.pathNoCompare + '?height=40'"
                                                   :aspect-ratio="1">
                                                <template #placeholder>
                                             <span class="text-uppercase extension-icon">
                                              <code>{{ asset.extension }}</code>
                                            </span>
                                                </template>
                                            </v-img>
                                            <span v-else-if="asset.extension?.length<=4"
                                                  class="text-uppercase extension-icon">
                                      <code>{{ asset.extension }}</code>
                                    </span>
                                            <v-icon v-else>mdi-file</v-icon>
                                        </v-avatar>
                                    </template>
                                    <template v-slot:title>
                                        <NuxtLink :to="asset.path" prefetch prefetch-on="interaction"
                                                  class="text-decoration-none">
                                            <code>{{ asset.name }}</code>
                                        </NuxtLink>
                                    </template>
                                </v-list-item>
                            </template>
                        </v-virtual-scroll>
                    </v-list>
                </div>
            </v-col>
        </v-row>
    </v-col>
</template>
<script setup lang="ts">
import type { AssetList } from "~/types/assets";
import { useAssetPath, useAssetPathParts } from "~/composables/useAssetPath";
import { useAsyncData, useLazyAsyncData } from "#app";
import BackBtn from "~/components/BackBtn.vue";
import { useScrollStore } from "~/stores/scroll";
import { useAssets } from "~/query/assets";

const props = defineProps<{
    version: string,
    path: string[],
    baseVersion?: string,
    compareWith?: string
}>();

const scrollStore = useScrollStore();

const assetDir = useAssetPath(props.version, props.path);
const baseAssetDir = useAssetPath(props.baseVersion, props.path);
const baseAssetDirWithCompare = useAssetPath(props.baseVersion, props.path, props.compareWith);
const assetPathParts = useAssetPathParts(props.version, props.path);
const baseAssetPathPartsWithCompare = useAssetPathParts(props.baseVersion, props.path, props.compareWith);

const dirName = computed(() => {
    return props.path[props.path.length - 1];
});

const assetListPath = computed<string>(() => {
    return assetDir.value + '/_list.json';
});
const assetKey = computed(() => {
    return 'asset-list-' + assetListPath.value;
})

const assetListEl = useTemplateRef('asset-list');

onMounted(() => {
    console.log(assetKey);
})

// const {
//     data: assetListRaw,
//     error: assetError,
//     status: assetStatus
// } = await useLazyAsyncData('asset-list-' + props.version, async () => {
//     return await $fetch('https://assets.mcasset.cloud/' + assetListPath.value, {
//         responseType: 'json'
//     })
// });

const {
    asset: assetState,
    path: assetPath,
    data: assetListRaw,
    error: assetError,
    status: assetStatus
} = useAssets();
watch(assetListPath, (p) => {
    assetPath.value = p;
}, {immediate: true})

const metaTitle = computed(() => {
    if (!dirName.value || dirName.value?.length < 1) return null;
    let title = dirName.value + "/ - ";
    if (props.compareWith) {
        title += props.baseVersion + " vs " + props.compareWith;
    } else {
        title += props.version;
    }
    return title;
});
const metaDescription = computed(() => {
    let meta = '';
    if (props.compareWith) {
        meta += 'Compare ';
    } else {
        meta += 'Browse ';
    }
    meta += 'Minecraft ';
    meta += dirName.value;
    meta += ' assets for version ';
    if (props.compareWith) {
        meta += props.baseVersion;
        meta += ' with ' + props.compareWith;
    } else {
        meta += props.version;
    }
    meta += ' via mcasset.cloud';
    return meta;
})
useSeoMeta({
    title: metaTitle,
    ogTitle: metaTitle,
    twitterTitle: metaTitle,
    description: metaDescription,
    ogDescription: metaDescription,
    twitterDescription: metaDescription
})
const ldJsonContent = computed(() => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": metaTitle.value,
        "url": `https://mcasset.cloud/${ baseAssetDirWithCompare.value }`,
        "description": metaDescription.value
        //TODO: date published
    });
});
const ldBreadcrumbContent = computed(() => {
    const items = [];
    for (let i = 0; i < baseAssetPathPartsWithCompare.value.length; i++) {
        items.push({
            "@type": "ListItem",
            "position": i + 1,
            "name": baseAssetPathPartsWithCompare.value[i],
            "item": `https://mcasset.cloud/${ baseAssetPathPartsWithCompare.value.slice(0, i + 1).join('/') }`
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
            href: computed(() => `https://mcasset.cloud/${ baseAssetDirWithCompare.value }`)
        }
    ],
    script: [
        {
            type: 'application/ld+json',
            'data-ld-id': 'browser-webpage',
            innerHTML: ldJsonContent
        },
        {
            type: 'application/ld+json',
            'data-ld-id': 'browser-breadcrumb',
            innerHTML: ldBreadcrumbContent
        }
    ]
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
    if (!assetListRaw.value) return [];
    console.log(assetListRaw.value)
    const {directories, files} = (assetListRaw.value as AssetList);
    return [
        ...(directories || []).map(dir => ({
            type: 'dir',
            name: dir,
            path: `/${ baseAssetDirWithCompare.value }/${ dir }`,
            pathWithCompare: `/${ baseAssetDirWithCompare.value }/${ dir }`,
            pathNoCompare: `/${ assetDir.value }/${ dir }`,
            extension: null,
            image: false
        })),
        ...(files || []).map(file => ({
            type: 'file',
            name: file,
            path: `/${ baseAssetDirWithCompare.value }/${ file }`,
            pathWithCompare: `/${ baseAssetDirWithCompare.value }/${ file }`,
            pathNoCompare: `/${ assetDir.value }/${ file }`,
            extension: getExtension(file),
            image: getExtension(file) === 'png'
        }))
    ];
});

const getExtension = (fileName: string) => {
    const parts = fileName.split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1];
};

watch([assetList, assetListEl], ([listVal, elVal]) => {
    if (listVal && elVal) {
        elVal.$el.scrollTop = scrollStore.assetListScroll[props.path.join('_')] || 0;
    }
});


const fileCount = computed(() => {
    if (!assetListRaw.value) return 0;
    const {directories, files} = (assetListRaw.value as AssetList);
    return (files || []).length;
});
const dirCount = computed(() => {
    if (!assetListRaw.value) return 0;
    const {directories, files} = (assetListRaw.value as AssetList);
    return (directories || []).length;
});

const cdnUrl = computed(() => {
    return 'https://assets.mcasset.cloud/' + assetDir.value
});
const githubUrl = computed(() => {
    return 'https://github.com/InventivetalentDev/minecraft-assets/tree/' + assetDir.value
});


const dirDownloadUrl = computed(() => {
    return 'https://download-directory.github.io/?url=' + githubUrl.value;
});

const versionRequested = ref(false);
const showRequestedNotice = ref(false);
const requestVersion = async () => {
    if (!props.version) return;
    if (!isNotFound.value) return;
    if (versionRequested.value) return;
    versionRequested.value = true;
    const res = await $fetch(`https://assets.mcasset.cloud/${ props.version }/request`, {
        method: 'POST'
    });
    console.log(res);
    showRequestedNotice.value = true;
}

const storeScroll = (event) => {
    const target = event.target;
    scrollStore.assetListScroll[props.path.join('_')] = target.scrollTop;
}
</script>