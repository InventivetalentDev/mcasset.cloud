<style scoped></style>
<template>
    <v-container>
        <v-skeleton-loader type="card"/>
    </v-container>
</template>
<script setup lang="ts">
import { useVersionManifest } from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import { useRouter } from "#app";
import { useVersionPath } from "~/composables/useVersionPath";
import MainLayout from "~/components/MainLayout.vue";

const router = useRouter();


const {
    data: versions,
    versionManifest
} = useVersionManifest();

const {version, path} = useVersionPath();
onMounted(() => {
    if (!version.value && !path.value) {
        router.push({path: '/latest'})
    }
})
// watch(version, () => {
//   const p = (path.value || []).filter(p => p !== '' && p !== '/').join("/");
//   router.push({path: `/${version.value}/${p}`})
// })
</script>