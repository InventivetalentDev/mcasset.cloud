<template>
    <v-row v-if="assetIsFile">
        <AssetView :version="version" :path="path"/>
        <AssetView v-if="compareWith" :version="compareWith" :path="path"/>
    </v-row>
    <v-row v-else>
        <AssetList :version="version" :path="path" :base-version="version" :compare-with="compareWith"/>
        <AssetList v-if="compareWith" :version="compareWith" :path="path" :base-version="version"
                   :compare-with="compareWith"/>
    </v-row>
    <v-row class="text-right">
        <v-col>
            <a href="https://forms.gle/1P7vMomYP16zC5ix5" target="_blank">Give Feedback
                <v-icon icon="mdi-open-in-new"></v-icon>
            </a>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import AssetView from "~/components/AssetView.vue";
import AssetList from "~/components/AssetList.vue";

const props = defineProps<{
    version: string,
    path: string[],
    compareWith?: string
}>();

const assetIsFile = computed(() => {
    return props.path.length > 0 && props.path[props.path.length - 1].includes('.');
});
</script>