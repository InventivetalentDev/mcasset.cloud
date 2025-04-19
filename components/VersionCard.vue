<template>
  <v-card>
    <v-card-text>
      <VersionSelectWithBreadcrumbs v-model="model" :path="path"/>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
const model = defineModel<string>({required: true});

const theme = useTheme();

const props = defineProps<{
  path: string[]
}>();
</script>