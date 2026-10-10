<style scoped>
.search-results {
    max-height: 60vh;
    overflow-y: auto;
}

.result-dir {
    direction: rtl; /* force overflow ellipses to be on the left */
    text-align: left;
}

.extension-icon {
    font-size: 0.6rem;
}

.search-help code {
    white-space: nowrap;
}
</style>
<template>
    <v-dialog v-model="dialogOpen" max-width="800" scrollable @after-enter="searchInput?.focus()">
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

        <template v-slot:default>
            <v-card>
                <template #title>Search</template>
                <v-card-text class="pb-0 flex-grow-0">
                    <v-text-field
                        ref="searchInput"
                        label="Query"
                        v-model="query"
                        placeholder="e.g. diamond sword, ext:ogg creeper, is:folder mob"
                        :loading="assetStatus === 'pending'"
                        clearable
                        hide-details
                        @keydown.down.prevent="moveSelection(1)"
                        @keydown.up.prevent="moveSelection(-1)"
                        @keydown.enter.prevent="openSelected"
                    >
                        <template #append-inner>
                            <v-icon icon="mdi-help-circle-outline" size="small"
                                    title="Search syntax"
                                    @click="showHelp = !showHelp"/>
                        </template>
                    </v-text-field>

                    <div v-if="showHelp" class="search-help text-caption text-medium-emphasis mt-2">
                        Words are matched against file and folder names (prefixes work, so <code>creep</code>
                        finds <code>creeper</code>). All words must match. Filters:
                        <ul class="ml-4">
                            <li><code>type:image</code>, <code>type:sound</code>, <code>type:json</code>,
                                <code>is:folder</code>, <code>is:file</code></li>
                            <li><code>ext:png</code> or <code>ext:png,ogg</code> &mdash; only these extensions</li>
                            <li><code>in:textures/item</code> &mdash; only inside folders matching this path</li>
                            <li>Prefix a filter with <code>-</code> to exclude, e.g. <code>-ext:json</code></li>
                        </ul>
                        Click the <v-icon icon="mdi-play" size="x-small"/> button next to a sound to listen to it
                        without opening it.
                    </div>

                    <div class="d-flex flex-wrap align-center ga-1 mt-2">
                        <v-chip-group v-model="typeFilter" selected-class="text-primary" class="py-0">
                            <v-chip v-for="t in TYPE_CHIPS" :key="t.value" :value="t.value"
                                    :prepend-icon="t.icon" size="small" filter>
                                {{ t.label }}
                            </v-chip>
                        </v-chip-group>
                        <v-spacer/>
                        <v-chip v-if="pathPrefix" size="small" variant="outlined"
                                :prepend-icon="globalSearch ? 'mdi-earth' : 'mdi-folder-search-outline'"
                                @click="globalSearch = !globalSearch"
                                title="Toggle search scope">
                            <span v-if="globalSearch">Everywhere</span>
                            <span v-else>In <code>{{ pathPrefix }}</code></span>
                        </v-chip>
                    </div>

                    <div class="text-caption text-medium-emphasis mt-1" v-if="hasQuery && assetIndex">
                        {{ searchResults.length.toLocaleString() }} result{{ searchResults.length === 1 ? '' : 's' }}
                    </div>
                </v-card-text>

                <v-card-text class="pt-1">
                    <div v-if="assetError" class="text-error text-center py-4">
                        Failed to load the search index.
                    </div>
                    <div v-else-if="!hasQuery" class="text-medium-emphasis text-center py-4">
                        Type to search all files and folders in {{ version }}
                    </div>
                    <div v-else-if="assetIndex && searchResults.length === 0"
                         class="text-medium-emphasis text-center py-4">
                        No results found
                    </div>
                    <v-list v-else density="compact" lines="two" class="search-results" ref="resultList">
                        <v-list-item
                            v-for="(result, i) in visibleResults"
                            :key="result.path"
                            :to="linkTo(result.path)"
                            :active="i === selectedIndex"
                            :data-result-index="i"
                            @click="dialogOpen = false"
                            @mouseenter="selectedIndex = i"
                        >
                            <template #prepend>
                                <v-avatar
                                    :color="result.isDir ? 'secondary' : result.ext === 'png' ? 'surface-variant' : 'primary'"
                                    rounded="sm">
                                    <v-icon v-if="result.isDir">mdi-folder</v-icon>
                                    <v-img v-else-if="result.ext === 'png'"
                                           style="image-rendering: pixelated"
                                           :src="`https://assets.mcasset.cloud/${ version }/${ result.path }?height=40`"
                                           :aspect-ratio="1">
                                        <template #placeholder>
                                            <code class="text-uppercase extension-icon">{{ result.ext }}</code>
                                        </template>
                                    </v-img>
                                    <SoundPreviewButton v-else-if="result.ext === 'ogg'"
                                                        :src="`https://assets.mcasset.cloud/${ version }/${ result.path }`"/>
                                    <code v-else-if="result.ext && result.ext.length <= 4"
                                          class="text-uppercase extension-icon">{{ result.ext }}</code>
                                    <v-icon v-else>mdi-file</v-icon>
                                </v-avatar>
                            </template>
                            <template #title>
                                <code>{{ result.name }}</code>
                            </template>
                            <template #subtitle>
                                <div class="result-dir text-truncate">
                                    <bdi>{{ result.dir || '/' }}</bdi>
                                </div>
                            </template>
                            <template #append v-if="!result.isDir">
                                <v-btn
                                    :to="linkTo(result.dir)"
                                    @click.stop="dialogOpen = false"
                                    icon="mdi-folder-arrow-right-outline"
                                    variant="text"
                                    size="small"
                                    title="Open containing folder"
                                />
                            </template>
                        </v-list-item>
                        <v-list-item v-if="searchResults.length > visibleResults.length" class="text-center">
                            <v-btn variant="text" size="small" @click="visibleCount += PAGE_SIZE">
                                Show more ({{ (searchResults.length - visibleResults.length).toLocaleString() }} remaining)
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import { useLazyAsyncData } from "#app";
import { refDebounced } from "@vueuse/core";
import type { AssetIndex } from "~/types/assets";
import {
    type AssetSearchResult,
    createAssetSearch,
    searchAssets,
    toSearchableAssets
} from "~/composables/assetSearch";
import { useSoundPreview } from "~/composables/useSoundPreview";

const props = defineProps<{
    version: string,
    path: string[]
}>();

const PAGE_SIZE = 50;
const TYPE_CHIPS = [
    {value: 'folder', label: 'Folders', icon: 'mdi-folder'},
    {value: 'image', label: 'Images', icon: 'mdi-image'},
    {value: 'sound', label: 'Sounds', icon: 'mdi-music-note'},
    {value: 'json', label: 'JSON', icon: 'mdi-code-json'},
];

const router = useRouter();

const assetIndexPath = computed<string>(() => {
    return props.version + '/_index.json';
});

const pathPrefix = computed(() => {
    return props.path.length > 0 ? props.path.join('/') + '/' : '';
});
const globalSearch = ref(false);

// The full version index is a multi-megabyte JSON file (~23k entries) and is only needed
// once somebody actually opens the search dialog. It must never be fetched during SSR:
// it used to be fetched, parsed and serialised into the payload on every page render.
const {
    data: assetIndex,
    error: assetError,
    status: assetStatus,
    execute: loadAssetIndex
} = await useLazyAsyncData('asset-index-' + props.version, async () => {
    return await $fetch<AssetIndex>('https://assets.mcasset.cloud/' + assetIndexPath.value, {
        responseType: 'json'
    })
}, {
    server: false,
    immediate: false,
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
});

// Built once per loaded index (not per keystroke); markRaw keeps Vue from deep-proxying 20k+ objects
const searchableAssets = computed(() => {
    if (!assetIndex.value) return [];
    return markRaw(toSearchableAssets(assetIndex.value.tree));
});
const miniSearch = computed(() => {
    if (!assetIndex.value) return null;
    return markRaw(createAssetSearch(searchableAssets.value));
});

const query = ref<string>('');
const debouncedQuery = refDebounced(query, 80);
const typeFilter = ref<string | undefined>();
const showHelp = ref(false);
const dialogOpen = ref(false);
const selectedIndex = ref(0);
const visibleCount = ref(PAGE_SIZE);
const resultList = ref<{ $el: HTMLElement } | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);

const fullQuery = computed(() => {
    const parts = [debouncedQuery.value?.trim() || ''];
    if (typeFilter.value) parts.push('type:' + typeFilter.value);
    return parts.join(' ').trim();
});
const hasQuery = computed(() => fullQuery.value.length > 0);

const searchResults = computed<AssetSearchResult[]>(() => {
    const search = miniSearch.value;
    if (!search || !fullQuery.value) return [];
    const prefix = globalSearch.value ? '' : pathPrefix.value;
    return searchAssets(search, searchableAssets.value, fullQuery.value, prefix);
});
// Only render a page at a time; broad queries like "ext:ogg" match thousands of entries
const visibleResults = computed(() => searchResults.value.slice(0, visibleCount.value));

watch(searchResults, () => {
    selectedIndex.value = 0;
    visibleCount.value = PAGE_SIZE;
});

const {stop: stopSoundPreview} = useSoundPreview();

watch(dialogOpen, (open) => {
    if (open && !assetIndex.value && assetStatus.value !== 'pending') {
        loadAssetIndex();
    }
    if (!open) {
        stopSoundPreview();
    }
});
onBeforeUnmount(stopSoundPreview);

const linkTo = (path: string) => `/${ props.version }/${ path }`;

const moveSelection = (delta: number) => {
    const count = visibleResults.value.length;
    if (count === 0) return;
    selectedIndex.value = (selectedIndex.value + delta + count) % count;
    nextTick(() => {
        resultList.value?.$el
            ?.querySelector(`[data-result-index="${ selectedIndex.value }"]`)
            ?.scrollIntoView({block: 'nearest'});
    });
};

const openSelected = () => {
    const result = visibleResults.value[selectedIndex.value];
    if (!result) return;
    dialogOpen.value = false;
    router.push(linkTo(result.path));
};

const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        dialogOpen.value = !dialogOpen.value;
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>
