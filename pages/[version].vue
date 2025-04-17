<style scoped>
div {
  border: 2px dashed #f36d33;
}
</style>
<template>
  <div>
    <div>hi</div>

    <VersionSelect v-model="version"/>
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

const version = ref<string>(router.currentRoute.value.params.version as string);
const path = ref<string[]>(router.currentRoute.value.params.path as string[]);
watch(version, () => {
  const p = path.value.filter(p => p.length > 0).join("/");
  router.push({path: `/${version.value}/${p}`})
})
</script>