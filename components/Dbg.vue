<style scoped>
pre {
        border: 1px dashed #f36d33;
    max-height: 250px;
    overflow: auto;
    }
script {
        display: none !important;
}
</style>
<template>
    <pre v-if="config.public.isDev">{{ json }}</pre>
    <component v-else is="script" type="application/json">{{ json }}</component>
</template>
<script setup lang="ts">
const props = defineProps<{
    data: any
}>();
const config = useRuntimeConfig();
const json = computed(() => {
    try {
        return JSON.stringify(props.data, null, 2);
    } catch (e) {
        return (e as any).message;
    }
});
</script>