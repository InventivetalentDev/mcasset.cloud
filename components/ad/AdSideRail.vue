<style scoped>
.side-rail-ad {
    position: sticky;
    top: 16px;
}

.side-rail-ad-box {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
    border-radius: 4px;
    overflow: hidden;
}
</style>
<template>
    <!-- The column is shown on lg+ by CSS only, so the server render and the first client render match. -->
    <v-col v-if="!dismissed && !blocked && !unfilled" cols="auto" class="d-none d-lg-block">
        <div class="side-rail-ad" :style="{width: `${ width }px`}">
            <!-- The label and close button sit above the ad so they never cover it. -->
            <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
                <span>Ad</span>
                <v-spacer/>
                <v-btn icon="mdi-close" size="x-small" variant="text" density="comfortable"
                       aria-label="Hide ad" @click="dismiss"/>
            </div>
            <div class="side-rail-ad-box" :style="{width: `${ width }px`, height: `${ height }px`}">
                <ClientOnly>
                    <!-- Only request an ad when the column is visible; a hidden <ins> has no width to fill. -->
                    <AdWrappper v-if="lgAndUp" :ad-slot="adSlot" :width="width" :height="height"
                                @blocked="onBlocked" @unfilled="onUnfilled"/>
                </ClientOnly>
            </div>
        </div>
    </v-col>
</template>
<script setup lang="ts">
import { useNuxtApp } from "nuxt/app";

const props = withDefaults(defineProps<{
    adSlot: string;
    width?: number;
    height?: number;
}>(), {
    // 300x250 fits beside the shortest pages (the version root and /assets) without making the row taller.
    width: 300,
    height: 250
});

const {$gtag} = useNuxtApp();
const {lgAndUp} = useDisplay();
const isDev = useRuntimeConfig().public.isDev;

// Kept in useState so the rail stays hidden on later pages; MainLayout remounts on every folder click.
const dismissed = useState('side-rail-ad-dismissed', () => false);
const dismiss = () => {
    dismissed.value = true;
    $gtag('event', 'dismiss_ad', {placement: 'side_rail'});
};

// Collapse the column when no ad shows, so the browser gets the space back.
// A blocked script stays blocked, so that is remembered for the session; otherwise the list would jump wider
// on every folder click. A plain no-fill only collapses this page, and the next page asks again.
// Not in dev: without a GOOGLE_ADSENSE client nothing fills, and the reserved box is what we want to see.
const blocked = useState('side-rail-ad-blocked', () => false);
const onBlocked = () => {
    if (!isDev) blocked.value = true;
};
const unfilled = ref(false);
const onUnfilled = () => {
    if (!isDev) unfilled.value = true;
};
</script>
