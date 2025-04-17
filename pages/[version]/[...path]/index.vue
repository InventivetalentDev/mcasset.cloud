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
    <Breadcrumbs v-if="version&&path" :version="version" :path="path"></Breadcrumbs>
    <AssetListOrView v-if="version&&path" :version="version" :path="path"></AssetListOrView>
    <!--    <p>{{path}}</p>-->
  </div>
</template>
<script setup lang="ts">
import {useRoute} from 'vue-router';
import AssetListOrView from "~/components/AssetListOrView.vue";
import {useVersionPath} from "~/composables/useVersionPath";


const route = useRoute();

const {version, path} = useVersionPath();
</script>

