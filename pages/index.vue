<style scoped></style>
<template>
  <v-container>
    <NuxtLayout>
      <div>Index</div>

      <VersionSelect v-model="version"/>
      Root 0
      <NuxtPage></NuxtPage>
    </NuxtLayout>
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