<style scoped>
</style>
<template>
    <Suspense>
        <NuxtPage/>
        <template #fallback>
            <v-skeleton-loader type="card"/>
        </template>
    </Suspense>
</template>
<script setup lang="ts">
</script>