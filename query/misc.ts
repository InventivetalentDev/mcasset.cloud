import type {VersionManifest} from "~/types";

export const useVersionManifest = defineQuery(() => {

    const {state, ...rest} = useQuery({
        key: ['misc','version-manifest'],
        query: async () => {
            return await $fetch<VersionManifest>('https://cloudflare-worker-cors.inventive.workers.dev/?url=https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
        }
    });

    return {
        ...rest,
        versionManifest: state
    }
});
