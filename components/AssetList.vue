<template>
  <v-list>
    <v-list-item v-for="asset in  assets">
      {{ asset }}
    </v-list-item>
  </v-list>
</template>
<script setup lang="ts">
const props = defineProps<{
  assets: string[]
}>()
</script>