<style scoped>
div {
  border: 2px dashed #f36d33;
}
</style>
<template>
  <div>
    <div>hi</div>

    <VersionSelect v-model="version"/>
    <dbg :data="{version}"/>
    [version].vue
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
  router.push({path: `/${version.value}`})
})
</script>