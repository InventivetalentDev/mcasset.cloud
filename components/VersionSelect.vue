<template>
    <div>
        <v-autocomplete :label="compare?'Compare With':'Minecraft Version'"
                        :loading="manifestStatus === 'pending' || availableStatus === 'pending'"
                        :items="items"
                        v-model="model"
                        :clearable="compare"
                        hide-details>

        </v-autocomplete>
        <div class="px-2 text-center">
            <a @click.prevent="useLatestRelease" href="/latest">Latest Release</a> | <a
            @click.prevent="useLatestSnapshot" href="/snapshot">Latest Snapshot</a>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { AvailableVersions, ManifestVersion, VersionManifest } from "~/types";
import { useAsyncData, useLazyAsyncData, useRouter } from "#app";
import { useVersionManifest } from "~/composables/useVersionManifest";

const props = defineProps<{
    compare?: boolean
}>();

const {
    manifest,
    manifestStatus,
    versions,
    latestRelease,
    latestSnapshot
} = await useVersionManifest();

const {
    data: availableVersions,
    status: availableStatus
} = await useLazyAsyncData('version-list', async () => {
    return await $fetch<AvailableVersions>('https://assets.mcasset.cloud/versions.json', {
        responseType: 'json'
    })
});
const availableVersionNames = computed<string[]>(() => {
    return availableVersions.value?.versions?.map(version => version.name) || [];
});

const isAvailable = (version: string) => {
    return availableVersionNames.value?.includes(version);
}

const items = computed(() => {
    const mapped = (versions.value || []).map(v => ({
        id: v.id,
        title: v.id,
        props: {
            subtitle: v.type,
            prependIcon: v.type === 'release' ? 'mdi-package' : 'mdi-test-tube',
            appendIcon: isAvailable(v.id) ? null : 'mdi-close',
        }
    }));
    // if (props.compare) {
    //     mapped.unshift({
    //         id: 'none',
    //         title: 'None',
    //     });
    // }
    return mapped;
});

const model = defineModel<string>({required: true});
watch(model, () => {
    console.log("version changed");
    resolveLatest();
}, {immediate: false});

watch(manifest, () => {
    resolveLatest();
}, {immediate: false});


const useLatestRelease = () => {
    const latest = manifest.value?.versions?.find((version) => version.id === latestRelease.value);
    console.log(latest)
    if (latest) {
        model.value = latest.id;
    }
};
const useLatestSnapshot = () => {
    const latest = manifest.value?.versions?.find((version) => version.id === latestSnapshot.value);
    if (latest) {
        model.value = latest.id;
    }
};

const resolveLatest = () => {
    if (latestRelease.value && model.value === 'latest') {
        model.value = latestRelease.value;
    }
    if (latestSnapshot.value && model.value === 'snapshot') {
        model.value = latestSnapshot.value;
    }
    // if(model.value === 'none') {
    //     model.value = '';
    // }
}

onMounted(() => {
    resolveLatest();
})


</script>