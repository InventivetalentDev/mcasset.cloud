<style scoped>
.audio-player {
    width: 100%;
    max-width: 520px;
}

.time-display {
    font-variant-numeric: tabular-nums;
}
</style>
<template>
    <div class="audio-player">
        <audio ref="audioEl" :src="src" :loop="loop" preload="metadata"/>
        <v-row align="center" no-gutters>
            <v-col cols="auto">
                <v-btn
                    icon
                    variant="text"
                    :color="playing ? 'primary' : undefined"
                    @click="togglePlay">
                    <v-icon :icon="playing ? 'mdi-pause' : 'mdi-play'" size="large"/>
                </v-btn>
            </v-col>
            <v-col cols="auto" class="px-2 text-caption text-medium-emphasis text-no-wrap time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </v-col>
            <v-col class="px-2">
                <v-slider
                    :model-value="currentTime"
                    :min="0"
                    :max="duration || 0"
                    :step="0.05"
                    color="primary"
                    density="compact"
                    hide-details
                    @update:model-value="onSeek"/>
            </v-col>
            <v-col cols="auto">
                <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="toggleMute">
                    <v-icon :icon="volumeIcon"/>
                </v-btn>
            </v-col>
            <v-col cols="auto" class="pe-2" style="width: 90px">
                <v-slider
                    v-model="volume"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    color="primary"
                    density="compact"
                    hide-details/>
            </v-col>
            <v-col cols="auto">
                <v-btn
                    icon
                    variant="text"
                    size="small"
                    :color="loop ? 'primary' : undefined"
                    @click="loop = !loop">
                    <v-icon icon="mdi-repeat"/>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>
<script setup lang="ts">
import { useMediaControls } from "@vueuse/core";

defineProps<{
    src: string
}>();

const audioEl = ref<HTMLAudioElement>();
const loop = ref(false);

const {
    playing,
    currentTime,
    duration,
    volume,
    muted,
} = useMediaControls(audioEl);

const togglePlay = () => {
    playing.value = !playing.value;
};

const toggleMute = () => {
    muted.value = !muted.value;
};

const onSeek = (value: number) => {
    currentTime.value = value;
};

const volumeIcon = computed(() => {
    if (muted.value || volume.value <= 0) return 'mdi-volume-off';
    if (volume.value < 0.5) return 'mdi-volume-medium';
    return 'mdi-volume-high';
});

const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${ mins }:${ secs.toString().padStart(2, '0') }`;
};
</script>
