<template>
    <div>
        <div v-if="properties.length" class="d-flex flex-wrap ga-2 mb-2">
            <v-select v-for="property in properties" :key="property.name"
                      v-model="selection[property.name]" :label="property.name"
                      :items="[
                          ...(property.optional ? [{title: 'unset', value: ''}] : []),
                          ...property.values.map(value => ({title: value, value}))
                      ]"
                      density="compact" hide-details/>
        </div>
        <v-skeleton-loader v-if="!resolvedVersion" type="image"/>
        <iframe v-else :src="embedUrl" :title="target.id" loading="lazy"/>
    </div>
</template>
<script setup lang="ts">
import { blockStateProperties } from "~/composables/mineRenderEmbed";
import type { BlockStateProperty, MineRenderTarget } from "~/composables/mineRenderEmbed";
import { escapeVersion } from "~/composables/useAssetPath";
import { useVersionManifest } from "~/composables/useVersionManifest";

const props = defineProps<{ version: string, target: MineRenderTarget, content?: unknown }>();
const EMBED_URL = 'https://beta.minerender.org/embed/';
const {latestRelease, latestSnapshot} = await useVersionManifest();
const resolvedVersion = computed(() => {
    if (props.version === 'latest') return latestRelease.value;
    if (props.version === 'snapshot') return latestSnapshot.value;
    return props.version;
});
const properties = ref<BlockStateProperty[]>([]);
const selection = ref<Record<string, string>>({});

watch([() => props.target, () => props.content], async ([target, content], _, onCleanup) => {
    properties.value = [];
    selection.value = {};
    if (target.param !== 'block' || !(content instanceof Blob)) return;
    let cancelled = false;
    onCleanup(() => { cancelled = true; });
    const text = await content.text();
    let json: unknown;
    try {
        json = JSON.parse(text);
    } catch {
        return;
    }
    if (cancelled) return;
    const result = blockStateProperties(json);
    properties.value = result.properties;
    selection.value = result.defaults;
}, {immediate: true});

const embedUrl = computed(() => {
    if (!resolvedVersion.value) return '';
    let subject = props.target.id;
    if (props.target.param === 'block') {
        const pairs = properties.value
            .filter(property => selection.value[property.name])
            .map(property => `${property.name}=${selection.value[property.name]}`);
        if (pairs.length) subject += `[${pairs.join(',')}]`;
    }
    const params = new URLSearchParams({[props.target.param]: subject, version: escapeVersion(resolvedVersion.value)});
    return `${EMBED_URL}?${params}`;
});
</script>
<style scoped>
iframe {
    /* The embed declares no color scheme. Matching it keeps the iframe transparent on the dark theme instead of white. */
    color-scheme: normal;
    border: 0;
    display: block;
    width: 100%;
    height: min(60vh, 480px);
}
</style>
