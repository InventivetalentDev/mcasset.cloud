<style scoped>
</style>
<template>
  <v-row>
    <v-col>
      <VersionSelectWithBreadcrumbs v-model="version" :path="path"></VersionSelectWithBreadcrumbs>
<!--      <VersionSelect v-model="version" :path="path"/>-->
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
import BreadcrumbsNav from "~/components/BreadcrumbsNav.vue";

const route = useRoute();

const {version, path} = useVersionPath();
</script>

