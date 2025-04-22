<template>
    <pre><code>{{ text }}</code></pre>
</template>
<script setup lang="ts">
const props = defineProps<{
    blob: Blob
}>();
const asText = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (e) => {
            reject(e);
        };
        reader.readAsText(blob);
    });
};

const text = await asText(props.blob);
</script>