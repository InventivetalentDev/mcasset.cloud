import type { VersionManifest } from "~/types";

export const useVersionManifest = async () => {
    const {
        data: manifest,
        status: manifestStatus
    } = useLazyAsyncData('version-manifest', async () => {
        return await $fetch<VersionManifest>('https://assets.mcasset.cloud/manifest.json', {
            responseType: 'json'
        });
    }, {
        getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    });

    const versions = computed(() => {
        return manifest.value?.versions;
    });
    const latestRelease = computed<string | null>(() => {
        return manifest.value?.latest?.release || null;
    });
    const latestSnapshot = computed<string | null>(() => {
        return manifest.value?.latest?.snapshot || null;
    });

    return {
        manifest,
        manifestStatus,
        versions,
        latestRelease,
        latestSnapshot
    };
}