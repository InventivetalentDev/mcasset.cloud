<style scoped>
@media (max-width: 800px) {
    .v-breadcrumbs {
        overflow-x: auto;
    }
}
</style>
<template>
    <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{item,index}">
            <v-breadcrumbs-item :key="index">
                <NuxtLink :to="item.href" class="text-decoration-none text-high-emphasis text-body-1">
                    <code>{{ item.title }}</code>
                </NuxtLink>
            </v-breadcrumbs-item>
        </template>
    </v-breadcrumbs>
    <!--  <dbg :data="{assetPath,breadcrumbs}"/>-->
</template>
<script setup lang="ts">
import { useAssetPath, useAssetPathParts } from "~/composables/useAssetPath";

const props = defineProps<{
    version: string,
    path: string[],
    compare?: string
}>();

const assetPath = useAssetPathParts(props.version, props.path, props.compare);
const breadcrumbs = computed(() => {
    return assetPath.value.map((part, index) => {
        return {
            title: part.split('...')[0], // hide compare in breadcrumb
            disabled: index === assetPath.value.length - 1,
            href: '/' + assetPath.value.slice(0, index + 1).join('/')
        }
    });
});
</script>
