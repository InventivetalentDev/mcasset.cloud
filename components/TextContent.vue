<template>
 <pre><code>{{ text }}</code></pre>
</template>
<script setup lang="ts">
const props = defineProps<{
    url: string
}>();

const {
    data: assetContent,
    status: assetContentStatus,
    error: assetContentError,
    execute: assetContentExecute,
} = await useLazyAsyncData('asset-content-' + props.url, async () => {
    return await $fetch(props.url, {
        responseType: 'text'
    });
});

const text = computed(() => assetContent.value);
</script>