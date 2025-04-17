<style scoped>
div {
  border: 2px dashed #3376f3;
}
</style>
<template>
  <v-container>
    <Suspense >
      <NuxtPage/>
      <template #fallback>
        Loading Path...
      </template>
    </Suspense>
  </v-container>
</template>
<script setup lang="ts">
</script>