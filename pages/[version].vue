<style scoped>
div {
  border: 2px dashed #f36d33;
}
</style>
<template>
  <v-container>
    <VersionSelect v-model="version"/>
    <Suspense>
      <NuxtPage></NuxtPage>
      <template #fallback>
        Loading Version...
      </template>
    </Suspense>
  </v-container>
</template>
<script setup lang="ts">
import {useGitHubUser} from "~/query/github";
import {useVersionManifest} from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import {useRouter} from "#app";
import {useVersionPath} from "~/composables/useVersionPath";

const router = useRouter();

const {
  data: githubUser
} = useGitHubUser();

const {
  data: versions,
  versionManifest
} = useVersionManifest();

const {version,path} = useVersionPath();
// watch(version, () => {
//   const p = (path.value || []).filter(p => p !== '' && p !== '/').join("/");
//   router.push({path: `/${version.value}/${p}`})
// })
</script>