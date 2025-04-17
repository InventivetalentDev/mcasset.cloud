<template>
  <v-row>
    <v-col>
      <Breadcrumbs v-if="version" :version="version" path="/"></Breadcrumbs>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <AssetList v-if="version" :version="version" path="/"></AssetList>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import {useGitHubUser} from "~/query/github";
import {useVersionManifest} from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import {useRouter} from "#app";
import AssetListOrView from "~/components/AssetListOrView.vue";

const router = useRouter();
const version = ref(router.currentRoute.value.params.version as string);
</script>