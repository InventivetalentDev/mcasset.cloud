<style scoped></style>
<template>
    <v-container>
        <v-skeleton-loader type="card"/>
    </v-container>
</template>
<script setup lang="ts">
import { useRouter } from "#app";
import { useVersionPath } from "~/composables/useVersionPath";

const router = useRouter();

const {version, path} = useVersionPath();
onMounted(() => {
    if (!version.value && !path.value) {
        router.push({path: '/latest'})
    }
})
</script>