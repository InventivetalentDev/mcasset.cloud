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
        <v-btn-toggle v-if="armorAvailable" v-model="view" mandatory density="compact" variant="outlined" class="mb-2">
            <v-btn value="item" prepend-icon="mdi-cube-outline">Item</v-btn>
            <v-btn value="armor" prepend-icon="mdi-shield-outline">Armor</v-btn>
            <v-btn value="worn" prepend-icon="mdi-human">Worn</v-btn>
        </v-btn-toggle>
        <div ref="container" class="minerender-view">
            <v-progress-linear v-if="pending" indeterminate color="primary" class="position-absolute top-0"/>
            <div v-else-if="error" class="position-absolute w-100 h-100 d-flex align-center justify-center">
                Couldn't render this asset in 3D.
            </div>
            <a class="minerender-credit" href="https://minerender.org" target="_blank" rel="noopener">MineRender</a>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { SceneObjectDefinition } from "minerender/browser";
import type { MineRenderViewer } from "~/composables/mineRenderViewer";
import { blockStateProperties, hasArmorLayer } from "~/composables/mineRenderEmbed";
import type { BlockStateProperty, MineRenderTarget } from "~/composables/mineRenderEmbed";
import { escapeVersion } from "~/composables/useAssetPath";
import { useVersionManifest } from "~/composables/useVersionManifest";

const props = defineProps<{ version: string, target: MineRenderTarget, content?: unknown }>();
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

// Armor also shows as the worn piece, alone or on a player, when its equipment asset exists (1.21.4+).
// view stays null until that check settles, so the first render is already the armor piece.
const armorAvailable = ref(false);
const view = ref<'item' | 'armor' | 'worn' | null>(null);

watch([() => props.target.armor, resolvedVersion], async ([armor, version], _, onCleanup) => {
    armorAvailable.value = false;
    view.value = armor ? null : 'item';
    if (!armor || !version || !import.meta.client) return;
    let cancelled = false;
    onCleanup(() => { cancelled = true; });
    const [ns, name] = armor.asset.split(':');
    const available = await $fetch(`https://assets.mcasset.cloud/${escapeVersion(version)}/assets/${ns}/equipment/${name}.json`, {
        responseType: 'json'
    }).then(json => hasArmorLayer(json, armor.slot), () => false);
    if (cancelled) return;
    armorAvailable.value = available;
    view.value = available ? 'armor' : 'item';
}, {immediate: true});

// The armor piece alone is the worn armor with every player mesh hidden; the armor hangs off the part groups, not the meshes.
const PLAYER_PARTS = ['head', 'body', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg',
    'hat', 'jacket', 'rightSleeve', 'leftSleeve', 'rightTrousers', 'leftTrousers'];

const definition = computed<SceneObjectDefinition | null>(() => {
    if (props.target.param === 'structure' || view.value === null) return null;
    if (view.value !== 'item' && props.target.armor) {
        return {
            id: 'preview', type: 'skin', armor: {[props.target.armor.slot]: props.target.armor.asset},
            ...(view.value === 'armor' && {hiddenParts: PLAYER_PARTS})
        };
    }
    if (props.target.param === 'block') {
        const state = Object.fromEntries(properties.value
            .filter(property => selection.value[property.name])
            .map(property => [property.name, selection.value[property.name]]));
        return {id: 'preview', type: 'block', asset: props.target.id, ...(Object.keys(state).length ? {state} : {})};
    }
    return {id: 'preview', type: props.target.param, asset: props.target.id};
});

const container = ref<HTMLElement | null>(null);
const pending = ref(true);
const error = ref(false);
let viewer: MineRenderViewer | undefined;
let started = false;
let unmounted = false;
let stopDefinitionWatch: (() => void) | undefined;

onMounted(() => {
    watch(resolvedVersion, async version => {
        if (!version || started) return;
        started = true;
        if (!import.meta.client) return;
        try {
            const { createMineRenderViewer } = await import("~/composables/mineRenderViewer");
            if (unmounted) return;
            viewer = createMineRenderViewer(container.value!, escapeVersion(version));
        } catch {
            error.value = true;
            pending.value = false;
            return;
        }
        stopDefinitionWatch = props.target.param === 'structure' ? watch(() => props.content, async value => {
            if (!(value instanceof Blob)) {
                error.value = true;
                pending.value = false;
                return;
            }
            try {
                await viewer!.showStructure(value);
                error.value = false;
            } catch {
                error.value = true;
            } finally {
                pending.value = false;
            }
        }, {immediate: true}) : watch(definition, async value => {
            if (!value) return;
            try {
                await viewer!.show(value);
                error.value = false;
            } catch {
                // MineRender has no player model for versions without an entity model dataset, such as snapshots,
                // so show the item instead.
                if (value.type === 'skin') {
                    armorAvailable.value = false;
                    view.value = 'item';
                    return;
                }
                error.value = true;
            }
            pending.value = false;
        }, {immediate: true});
    }, {immediate: true});
});

onBeforeUnmount(() => {
    unmounted = true;
    stopDefinitionWatch?.();
    viewer?.dispose();
});
</script>
<style scoped>
.minerender-view {
    position: relative;
    width: 100%;
    height: min(60vh, 480px);
}

/* Same credit link the MineRender embed shows. */
.minerender-credit {
    position: absolute;
    bottom: 6px;
    right: 8px;
    z-index: 1;
    padding: 2px 6px;
    border-radius: 4px;
    color: #fff;
    background: #1b1d2299;
    font-size: 11px;
    text-decoration: none;
}

.minerender-credit:hover, .minerender-credit:focus-visible {
    background: #1b1d22;
    text-decoration: underline;
}
</style>
