<template>
    <MainLayout/>
</template>
<script setup lang="ts">
import MainLayout from "~/components/MainLayout.vue";
import { useScrollStore } from "~/stores/scroll";

definePageMeta({
    scrollToTop: false
})

const scrollStore = useScrollStore();

onMounted(() => {
    setTimeout(() => {
        window.scrollTo({
            top: scrollStore.rootScroll || 0
        });
    })
})
onUnmounted(() => {
    scrollStore.rootScroll = window.scrollY;
})
</script>