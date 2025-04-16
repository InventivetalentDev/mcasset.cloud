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
    <dbg :data="{version}"/>
    <AssetList :assets="['idk']"></AssetList>
<!--    <p>{{path}}</p>-->
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';


const route = useRoute();

const version = computed(()=> {
  const versionParam = route.params.version;
  return versionParam ? versionParam : 'unknown';
});
const path = computed(()=> {
  const pathParam = route.params.path;
  return pathParam ? pathParam : 'unknown';
});
</script>

