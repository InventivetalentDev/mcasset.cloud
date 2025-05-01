<style scoped>
</style>
<template>
    <Suspense>
        <NuxtPage/>
        <template #fallback>
            <div style="min-height: 100vh">
                <v-skeleton-loader type="card"/>
            </div>
        </template>
    </Suspense>
</template>
<script setup lang="ts">
</script>