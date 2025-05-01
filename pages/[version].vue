<style scoped>
</style>
<template>
    <v-container>
        <!--    <v-row>-->
        <!--      <v-col>-->
        <!--        <VersionSelect v-model="version"/>-->
        <!--      </v-col>-->
        <!--    </v-row>-->
        <Suspense>
            <NuxtPage/>
            <template #fallback>
                <div style="min-height: 100vh">
                    <v-skeleton-loader type="card"/>
                </div>
            </template>
        </Suspense>
        <NewWebsiteBanner/>
    </v-container>
</template>
<script setup lang="ts">
import { useVersionManifest } from "~/query/misc";
import VersionSelect from "~/components/VersionSelect.vue";
import { useRouter } from "#app";
import { useVersionPath } from "~/composables/useVersionPath";

const router = useRouter();


const {
    data: versions,
    versionManifest
} = useVersionManifest();

const {version, path} = useVersionPath();
// watch(version, () => {
//   const p = (path.value || []).filter(p => p !== '' && p !== '/').join("/");
//   router.push({path: `/${version.value}/${p}`})
// })
</script>