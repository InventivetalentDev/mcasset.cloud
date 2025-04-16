<template>
      <div>
        Root 1 index
        <AssetList v-if="version" :version="version" path="/"></AssetList>
      </div>
</template>
<script setup lang="ts">
import {useGitHubUser} from "~/query/github";
import {useVersionManifest} from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import {useRouter} from "#app";
import AssetListOrView from "~/components/AssetListOrView.vue";

const router = useRouter();

const {
  data: githubUser
} = useGitHubUser();

const {
  data: versions,
  versionManifest
} = useVersionManifest();

const version = ref(router.currentRoute.value.params.version);
watch(version, () => {
  router.push(`/${version.value}`)
})
</script>