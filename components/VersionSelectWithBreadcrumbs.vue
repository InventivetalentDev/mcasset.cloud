<template>
  <v-row>
    <v-col cols="12" md="2" xl="1" >
      <VersionSelect v-model="model"/>
    </v-col>
    <v-col cols="auto">
      <Breadcrumbs :version="model" :path="path"/>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const model = defineModel<string>({required: true});

const theme = useTheme();

const {name} = useDisplay();

const props = defineProps<{
  path: string[]
}>();
</script>