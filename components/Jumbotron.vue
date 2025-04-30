<style>
.jumbotron {
    background: linear-gradient(to bottom, #4F9D98 0%, #217E7C 100%);
}

.jumbotron .mcasset-logo img {
    filter: drop-shadow(0 0 2px rgba(255,255,255, 0.4));
}

.jumbotron .v-card__image img {
    transform: scale(1.1);
    filter: blur(2px);
}

.jumbotron h1, span {
    text-shadow: 0 0  4px rgba(0, 0, 0, 0.8);
}
</style>
<template>
    <v-card class="jumbotron" color="#217E7C" :image="image">
        <v-card-text>
            <v-row>
                <v-col cols="2" lg="1" class="px-md-8 ml-md-4">
                    <v-img max-width="64" class="mcasset-logo" alt="MCAsset Logo" src="/img/mc-assets-2-64.png"/>
                </v-col>
                <v-col>
                    <h1 class="font-weight-bold text-grey-lighten-3 mb-2">
                        <span class="d-md-none">MC</span>
                        <span class="d-md-inline-block d-none">Minecraft</span>
                        Assets
                        <span class="text-h5 font-weight-light">Explorer</span>
                    </h1>
                    <span class="text-grey-lighten-3 text-h6 text-wrap">
          Browse Minecraft assets,
          including Textures, Sounds, Models, Fonts, Shaders, and more
        </span>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import { useVersionPath } from "~/composables/useVersionPath";

const {version, path} = useVersionPath();
const image = computed(() => {
    if (!version.value) return undefined;
    // select a random image (1-5)
    const random = Math.floor(Math.random() * 5) + 1;
    return `https://assets.mcasset.cloud/${ version.value }/assets/minecraft/textures/gui/title/background/panorama_${ random }.png`;
})
</script>