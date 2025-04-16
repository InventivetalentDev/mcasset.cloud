<template>
  <ClientOnly>
    <div>hi</div>

    <VersionSelect/>
    <dbg :data="versions"/>
    <dbg :data="githubUser"/>
  </ClientOnly>
</template>
<script setup lang="ts">
import {useGitHubUser} from "~/query/github";
import {useVersionManifest} from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";

const {
  data: githubUser
} = useGitHubUser();

const {
  data: versions,
  versionManifest
} = useVersionManifest();
</script>