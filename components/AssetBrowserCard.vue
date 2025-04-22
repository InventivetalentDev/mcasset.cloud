<template>
    <v-card>
        <v-card-text>
            <AssetListOrView :version="version" :path="path" :compare-with="compareWith"/>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import AssetView from "~/components/AssetView.vue";
import AssetList from "~/components/AssetList.vue";

const props = defineProps<{
    version: string,
    path: string[],
    compareWith?: string
}>();

</script>