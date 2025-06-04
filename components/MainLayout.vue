<template>
  <v-row>
    <v-col>
      <!--      <BreadcrumbsNav v-if="version" :version="version" path="/"></BreadcrumbsNav>-->
      <VersionCard v-if="version" v-model="version" v-model:compare-with="compare" :path="path ||[]"/>
    </v-col>
  </v-row>
  <v-row class="mt-0"  style="min-height: 50vh">
    <v-col>
      <AssetBrowserCard v-if="version" :version="version" v-model:compare-with="compare" :path="path||[]"/>
    </v-col>
  </v-row>
  <v-row class="mt-1" style="min-height: 30vh">
    <v-col>
      <AdInfoWrapper>
        <AdWrappper ad-slot="6046448840"/>
      </AdInfoWrapper>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import {useRouter} from "#app";
import {useVersionPath} from "~/composables/useVersionPath";
import VersionCard from "~/components/VersionCard.vue";

const router = useRouter();
const {version, path, compare} = useVersionPath();
</script>