<template>
  <v-row>
    <v-col>
<!--      <BreadcrumbsNav v-if="version" :version="version" path="/"></BreadcrumbsNav>-->
      <VersionCard v-if="version"  v-model="version" :path="[]"/>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <AssetBrowserCard v-if="version" :version="version" :path="[]"/>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import {useGitHubUser} from "~/query/github";
import {useVersionManifest} from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import {useRouter} from "#app";
import AssetListOrView from "~/components/AssetListOrView.vue";
import BreadcrumbsNav from "~/components/BreadcrumbsNav.vue";
import {useVersionPath} from "~/composables/useVersionPath";
import VersionCard from "~/components/VersionCard.vue";

const router = useRouter();
const {version,path} =useVersionPath();
</script>