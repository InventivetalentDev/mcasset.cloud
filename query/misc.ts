import type {VersionManifest} from "~/types";

export const useVersionManifest = defineQuery(() => {

    const {state, ...rest} = useQuery({
        key: ['misc','version-manifest'],
        query: async () => {
            return await $fetch<VersionManifest>('https://assets.mcasset.cloud/manifest.json')
        }
    });

    return {
        ...rest,
        versionManifest: state
    }
});
