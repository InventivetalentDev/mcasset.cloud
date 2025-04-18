<style scoped></style>
<template>
  <v-container>
<!--    <v-row>-->
<!--      <v-col>-->
<!--        <VersionSelect v-model="version"/>-->
<!--      </v-col>-->
<!--    </v-row>-->
    Root 0
    <v-row>
      <v-col>
        Please select a version
      </v-col>
    </v-row>
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

const {version, path} = useVersionPath();
onMounted(()=>{
  if (!version.value && !path.value) {
    router.push({path: '/latest'})
  }
})
// watch(version, () => {
//   const p = (path.value || []).filter(p => p !== '' && p !== '/').join("/");
//   router.push({path: `/${version.value}/${p}`})
// })
</script>