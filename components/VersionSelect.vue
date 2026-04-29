<template>
    <div>
        <v-autocomplete :label="compare?'Compare With':'Minecraft Version'"
                        :loading="manifestStatus === 'pending' || availableStatus === 'pending'"
                        :items="items"
                        v-model="model"
                        :clearable="compare"
                        hide-details>
            <template #prepend-item>
                <v-list-item prepend-icon="mdi-package" title="Latest Release" density="compact" @click="useLatestRelease"/>
                <v-list-item prepend-icon="mdi-test-tube" title="Latest Snapshot" density="compact" @click="useLatestSnapshot"/>
                <v-divider/>
                <div class="px-4 py-1" @click.stop>
                    <v-switch v-model="settings.showSnapshots" label="Show Snapshots" density="compact" color="primary" hide-details/>
                </div>
                <v-divider/>
            </template>
        </v-autocomplete>
    </div>
</template>
<script setup lang="ts">
import type { AvailableVersions, ManifestVersion, VersionManifest } from "~/types";
import { useAsyncData, useLazyAsyncData, useRouter } from "#app";
import { useVersionManifest } from "~/composables/useVersionManifest";
import { useSettingsStore } from "~/stores/settings";

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
}, {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
});
const availableVersionNames = computed<string[]>(() => {
    return availableVersions.value?.versions?.map(version => version.name) || [];
});

const isAvailable = (version: string) => {
    return availableVersionNames.value?.includes(version);
}

const settings = useSettingsStore();

const model = defineModel<string>({required: true});

const items = computed(() => {
    const all = versions.value || [];
    const filtered = !settings.showSnapshots
        ? all.filter(v => v.type === 'release' || v.id === model.value)
        : all;
    return filtered.map(v => ({
        id: v.id,
        title: v.id,
        props: {
            subtitle: v.type,
            prependIcon: v.type === 'release' ? 'mdi-package' : 'mdi-test-tube',
            appendIcon: isAvailable(v.id) ? null : 'mdi-close',
        }
    }));
});
watch(model, () => {
    console.log("version changed");
    resolveLatest();
}, {immediate: false});

watch(manifest, () => {
    resolveLatest();
}, {immediate: false});


const useLatestRelease = () => {
    const latest = manifest.value?.versions?.find((version) => version.id === latestRelease.value);
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