<template>
    <v-row v-if="assetIsFile">
        <AssetView :version="version" :path="path" :base-version="version" :compare-with="compareWith"/>
        <AssetView v-if="compareWith" :version="compareWith" :path="path" :base-version="version"
                   :compare-with="compareWith"/>
    </v-row>
    <v-row v-else>
        <AssetList :version="version" :path="path" :base-version="version" :compare-with="compareWith"/>
        <AssetList v-if="compareWith" :version="compareWith" :path="path" :base-version="version"
                   :compare-with="compareWith"/>
    </v-row>
    <v-row class="text-right">
        <v-col>
            <a href="https://forms.gle/1P7vMomYP16zC5ix5" target="_blank">
                Give Feedback
                <v-icon icon="mdi-open-in-new"/>
            </a>
            <span class="mx-2 text-medium-emphasis">·</span>
            <v-tooltip location="top" interactive open-on-click :close-delay="200">
                <template #activator="{ props: activatorProps }">
                    <button type="button" class="support-trigger" v-bind="activatorProps">
                        <v-icon icon="mdi-heart" color="red" size="small"/>
                        Support this Project
                    </button>
                </template>
                <div class="support-links">
                    <a href="https://ko-fi.com/inventivetalent" target="_blank" rel="noopener">
                        <v-icon icon="mdi-coffee" size="small"/>
                        Buy me a Coffee
                    </a>
                    <a href="https://github.com/sponsors/InventivetalentDev" target="_blank" rel="noopener">
                        <v-icon icon="mdi-github" size="small"/>
                        Sponsor on GitHub
                    </a>
                </div>
            </v-tooltip>
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
<style scoped>
.support-trigger {
    color: LinkText;
    text-decoration: underline;
    cursor: pointer;
}

.support-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 2px 0;
}

.support-links a {
    color: inherit;
    text-decoration: none;
    white-space: nowrap;
}

.support-links a:hover {
    text-decoration: underline;
}
</style>
