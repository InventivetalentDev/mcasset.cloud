<style scoped>
</style>
<template>
  <Suspense>
    <NuxtPage/>
    <template #fallback>
      Loading Path...
    </template>
  </Suspense>
</template>
<script setup lang="ts">
</script>