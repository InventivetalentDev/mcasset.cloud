<style scoped>
div {
  border: 2px dashed #40cd18;
}
</style>
<template>
  <div>
    <h1>Version {{ version }}</h1>
    <p>This is the asset page.</p>
    <span>path index</span>
    <dbg :data="{version,path}"/>
    <AssetListOrView v-if="version&&path" :version="version" :path="path"></AssetListOrView>
<!--    <p>{{path}}</p>-->
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import AssetListOrView from "~/components/AssetListOrView.vue";


const route = useRoute();

const version = computed<string>(()=> {
  const versionParam = route.params.version as string;
  return versionParam ? versionParam : 'unknown';
});
const path = computed<string[]>(()=> {
  return route.params.path as string[];

});
</script>

