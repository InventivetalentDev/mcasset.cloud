import type {ComputedRef} from "vue";

export const useAssetPathParts = (version: string | ComputedRef<string>, path: string[] | ComputedRef<string[]>): ComputedRef<string[]> => {
    const v = unref(version);
    const p = unref(path);
    return computed(() => {
        if (!v || !p) return [];
        return [v, ...p].filter(p => p.length > 0)
    });
}

export const useAssetPath = (version: string | ComputedRef<string>, path: string[] | ComputedRef<string[]>): ComputedRef<string> => {
    const parts = useAssetPathParts(version, path);
    return computed(() => parts.value.join('/'));
}