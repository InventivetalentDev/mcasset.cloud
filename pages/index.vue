<style scoped></style>
<template>
    <NuxtLayout>
      <div>hi</div>

      <VersionSelect v-model="version"/>
      Root 0
      <NuxtPage></NuxtPage>
    </NuxtLayout>
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
  router.push({path:`/${version.value}`})
})
</script>