<template>
    <v-btn
        class="sound-preview-btn"
        variant="text"
        icon
        :size="size"
        rounded="sm"
        :title="title"
        :aria-label="title"
        :aria-pressed="isActive && status !== 'error'"
        @click.stop.prevent="toggle(src)"
        @mousedown.stop
        @touchstart.stop
    >
        <v-progress-circular
            v-if="isActive && status !== 'error'"
            :indeterminate="status === 'loading'"
            :model-value="progress"
            :size="size - 8"
            :width="2"
            color="currentColor"
        >
            <v-icon :icon="status === 'playing' ? 'mdi-pause' : 'mdi-play'" size="small"/>
        </v-progress-circular>
        <v-icon v-else-if="isActive && status === 'error'" icon="mdi-alert-circle-outline"/>
        <v-icon v-else icon="mdi-play"/>
    </v-btn>
</template>
<script setup lang="ts">
import { useSoundPreview } from "~/composables/useSoundPreview";

const props = withDefaults(defineProps<{
    /** Absolute URL of the sound file */
    src: string,
    /** Button size in px; defaults to the size of a list avatar */
    size?: number
}>(), {
    size: 40
});

const {state, toggle} = useSoundPreview();

const isActive = computed(() => state.src === props.src);
const status = computed(() => isActive.value ? state.status : 'idle');
const progress = computed(() => isActive.value ? state.progress : 0);

const title = computed(() => {
    switch (status.value) {
        case 'playing':
            return 'Stop';
        case 'loading':
            return 'Loading…';
        case 'error':
            return 'Could not play this sound';
        default:
            return 'Play sound';
    }
});
</script>
