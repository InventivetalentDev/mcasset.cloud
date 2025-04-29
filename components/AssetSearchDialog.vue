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
            <v-card title="Search">
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

const props = defineProps<{
    version: string,
}>();

const assetIndexPath = computed<string>(() => {
    return props.version + '/_index.json';
});

const {
    data: assetIndex,
    error: assetError,
    status: assetStatus
} = await useLazyAsyncData('asset-index-' + props.version, async () => {
    return await $fetch<AssetIndex>('https://assets.mcasset.cloud/' + assetIndexPath.value, {
        responseType: 'json'
    })
});

const query = ref<string>('');
const searchResults = ref<(AssetIndexEntry & { href: string; dir: string; })[]>([]);

const updateSearch = useDebounceFn(() => {
    searchResults.value = searchAssets();
}, 700);

const searchAssets = () => {
    const query_ = query.value.toLowerCase();
    if (!query_) {
        return [];
    }
    return (assetIndex.value?.tree || [])
        .filter(a => {
            return a.path.toLowerCase().includes(query_)
        })
        .slice(0, 20)
        .map(a => ({
            ...a,
            href: `/${ props.version }/${ a.path }`,
            dir: '/' + props.version + '/' + (a.type === 'blob' ? a.path.split('/').slice(0, -1).join('/') : a.path),
        }))
}
</script>