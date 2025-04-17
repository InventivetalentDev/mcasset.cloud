<template>
      <v-container>
        <Breadcrumbs v-if="version" :version="version" path="/"></Breadcrumbs>
        <AssetList v-if="version" :version="version" path="/"></AssetList>
      </v-container>
</template>
<script setup lang="ts">
import {useGitHubUser} from "~/query/github";
import {useVersionManifest} from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import {useRouter} from "#app";
import AssetListOrView from "~/components/AssetListOrView.vue";

const router = useRouter();
const version = ref(router.currentRoute.value.params.version);
</script>