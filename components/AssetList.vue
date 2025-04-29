<style scoped>
.asset-list {
    overflow-y: auto;
    max-height: 70vh
}

</style>
<template>
    <v-col>
        <v-row>
            <v-col class="pb-0" cols="12" md="auto">
                <h3>
                    <BackBtn/>
                    <code>{{ dirName }}/</code>
                </h3>
            </v-col>
             <v-col cols="4" md="auto">
                <AssetSearchDialog :version="version"/>
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
                <h4 v-if="isNotFound">{{ path.length <= 1 ? 'Version Not Found' : 'Folder Not Found' }}</h4>
                <h4 v-else-if="assetStatus==='error'">
                    Failed to load asset list
                </h4>
                <div v-else-if="assetStatus==='pending'">
                    <v-skeleton-loader type="list-item-avatar@16"/>
                </div>
                <div v-else>
                    <v-list class="asset-list">
                        <v-list-item v-for="asset in assetList" :key="asset.name">
                            <template v-slot:prepend>
                                <v-avatar :color="asset.type==='dir'?'secondary':'primary'">
                                    <v-icon v-if="asset.type==='dir'">mdi-folder</v-icon>
                                    <span v-else-if="asset.extension?.length<=4" class="text-uppercase extension-icon">
                      <code>{{ getExtension(asset.name) }}</code>
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
                    </v-list>
                </div>
            </v-col>
        </v-row>
    </v-col>
</template>
<script setup lang="ts">
import type { AssetList } from "~/types/assets";
import { useAssetPath } from "~/composables/useAssetPath";
import { useAsyncData, useLazyAsyncData } from "#app";
import BackBtn from "~/components/BackBtn.vue";

const props = defineProps<{
    version: string,
    path: string[],
    baseVersion?: string,
    compareWith?: string
}>();

const assetDir = useAssetPath(props.version, props.path);
const assetDirWithCompare = useAssetPath(props.baseVersion, props.path, props.compareWith);

const dirName = computed(() => {
    return props.path[props.path.length - 1];
});

const assetListPath = computed<string>(() => {
    return assetDir.value + '/_list.json';
});
const assetKey = computed(() => {
    return 'asset-list-' + assetListPath.value;
})

onMounted(() => {
    console.log(assetKey);
})

const {
    data: assetIndex,
    error: assetError,
    status: assetStatus
} = await useLazyAsyncData('asset-list-' + props.version, async () => {
    return await $fetch('https://assets.mcasset.cloud/' + assetListPath.value, {
        responseType: 'json'
    })
})

const metaTitle = computed(() => {
    if (!dirName.value || dirName.value?.length < 1) return null;
    return dirName.value + "/ - " + props.version;
});
useSeoMeta({
    title: metaTitle,
    ogTitle: metaTitle,
    twitterTitle: metaTitle
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
    const {directories, files} = (assetIndex.value as AssetList);
    return [
        ...(directories || []).map(dir => ({
            type: 'dir',
            name: dir,
            path: `/${ assetDirWithCompare.value }/${ dir }`
        })),
        ...(files || []).map(file => ({
            type: 'file',
            name: file,
            path: `/${ assetDirWithCompare.value }/${ file }`,
            extension: getExtension(file)
        }))
    ];
});

const getExtension = (fileName: string) => {
    const parts = fileName.split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1];
};

const fileCount = computed(() => {
    if (!assetIndex.value) return 0;
    const {directories, files} = (assetIndex.value as AssetList);
    return (files || []).length;
});
const dirCount = computed(() => {
    if (!assetIndex.value) return 0;
    const {directories, files} = (assetIndex.value as AssetList);
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
</script>