<template>
    <v-dialog max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                variant="flat"
                prepend-icon="mdi-magnify"
                class=""
            >
                Search
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Search" :subtitle="pathPrefix ? 'in ' + pathPrefix : ''">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field
                                label="Query"
                                v-model="query"
                                @keyup="updateSearch"
                                @change="updateSearch"
                                hide-details
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-list density="compact" lines="one">
                                <v-list-item v-if="searchResults.length === 0">
                                    <template v-slot:title>
                                        <span class="text-center">No results found</span>
                                    </template>
                                </v-list-item>
                                <v-list-item v-for="result in searchResults" :key="result.path">
                                    <template v-slot:title>
                                        <NuxtLink :to="result.href">
                                            <code>{{ result.path }}</code>
                                        </NuxtLink>
                                    </template>
                                    <template v-slot:append>
                                        <NuxtLink :to="result.dir">
                                            <v-icon icon="mdi-chevron-right"></v-icon>
                                        </NuxtLink>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-card-text>

                <!--                <v-card-actions>-->
                <!--                    <v-spacer></v-spacer>-->

                <!--                    <v-btn-->
                <!--                        text="Search"-->
                <!--                        @click="isActive.value = false"-->
                <!--                    ></v-btn>-->
                <!--                </v-card-actions>-->
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import { useLazyAsyncData } from "#app";
import { useDebounceFn } from "@vueuse/core";
import type { AssetIndex, AssetIndexEntry } from "~/types/assets";
import MiniSearch, { type SearchResult } from 'minisearch'

const props = defineProps<{
    version: string,
    path: string[]
}>();

const assetIndexPath = computed<string>(() => {
    return props.version + '/_index.json';
});

const pathPrefix = computed(() => {
    return props.path.length > 0 ? props.path.join('/') + '/' : '';
})

const {
    data: assetIndex,
    error: assetError,
    status: assetStatus
} = await useLazyAsyncData('asset-index-' + props.version, async () => {
    return await $fetch<AssetIndex>('https://assets.mcasset.cloud/' + assetIndexPath.value, {
        responseType: 'json'
    })
});

type AssetIndexEntryWithMeta = AssetIndexEntry & { href?: string; dir?: string; };

const assetIndexList = computed(() => {
    if (!assetIndex.value) return [];
    return assetIndex.value.tree.map(v => ({
        ...v,
        href: `/${ props.version }/${ v.path }`,
        dir: '/' + props.version + '/' + (v.type === 'blob' ? v.path.split('/').slice(0, -1).join('/') : v.path),
    }))
})

const miniSearch = computed(() => {
    if (!assetIndex.value) return null;
    const search = new MiniSearch<AssetIndexEntryWithMeta>({
        fields: ['path'],
        storeFields: ['path', 'type', 'size', 'href', 'dir'],
        idField: 'path',
    });
    search.addAll(assetIndexList.value);
    return search;
})


const query = ref<string>('');
const searchResults = ref<(SearchResult & AssetIndexEntryWithMeta)[]>([]);

const updateSearch = useDebounceFn(() => {
    // searchResults.value = searchAssets();
    const search = miniSearch.value;
    if (!search) return;
    searchResults.value = search.search(query.value, {
        filter: (result) => {
            if (props.path.length <= 0) {
                return true;
            }
            return result.path.startsWith(pathPrefix.value);
        }
    });
}, 300);

// const searchAssets = () => {
//     const query_ = query.value.toLowerCase();
//     if (!query_) {
//         return [];
//     }
//     return (assetIndex.value?.tree || [])
//         .filter(a => {
//             return a.path.toLowerCase().includes(query_)
//         })
//         .slice(0, 20)
//         .map(a => ({
//             ...a,
//             href: `/${ props.version }/${ a.path }`,
//             dir: '/' + props.version + '/' + (a.type === 'blob' ? a.path.split('/').slice(0, -1).join('/') : a.path),
//         }))
// }
</script>