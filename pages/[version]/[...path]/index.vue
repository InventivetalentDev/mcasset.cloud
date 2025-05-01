<template>
    <MainLayout/>
</template>
<script setup lang="ts">
import MainLayout from "~/components/MainLayout.vue";

definePageMeta({
    scrollToTop: false
})

onMounted(() => {
    setTimeout(() => {
        window.scrollTo({
            top: window.lastScrollY || 0
        });
    })
})
onUnmounted(() => {
    window.lastScrollY = window.scrollY;
})
</script>