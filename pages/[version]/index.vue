<template>
      <div>
        Root 1 index
        <NuxtPage></NuxtPage>
      </div>
</template>
<script setup lang="ts">
import {useGitHubUser} from "~/query/github";
import {useVersionManifest} from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import {useRouter} from "#app";

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