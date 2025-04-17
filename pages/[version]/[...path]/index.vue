<style scoped>
</style>
<template>
  <v-row>
    <v-col>
      <Breadcrumbs v-if="version&&path" :version="version" :path="path"></Breadcrumbs>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <AssetListOrView v-if="version&&path" :version="version" :path="path"></AssetListOrView>
    </v-col>
  </v-row>
  <!--    <p>{{path}}</p>-->
</template>
<script setup lang="ts">
import {useRoute} from 'vue-router';
import AssetListOrView from "~/components/AssetListOrView.vue";
import {useVersionPath} from "~/composables/useVersionPath";

const route = useRoute();

const {version, path} = useVersionPath();
</script>

