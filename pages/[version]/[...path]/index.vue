<template>
  <v-row>
    <v-col>
      <VersionCard v-model="version" :path="path"/>
      <!--      <VersionSelect v-model="version" :path="path"/>-->
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <AssetBrowserCard :version="version" :path="path"/>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <AdInfoWrapper>
        <AdWrappper ad-slot="6046448840"/>
      </AdInfoWrapper>
    </v-col>
  </v-row>
  <!--    <p>{{path}}</p>-->
</template>
<script setup lang="ts">
import {useRoute} from 'vue-router';
import AssetListOrView from "~/components/AssetListOrView.vue";
import {useVersionPath} from "~/composables/useVersionPath";
import BreadcrumbsNav from "~/components/BreadcrumbsNav.vue";
import VersionCard from "~/components/VersionCard.vue";

const route = useRoute();

const {version, path} = useVersionPath();
</script>

