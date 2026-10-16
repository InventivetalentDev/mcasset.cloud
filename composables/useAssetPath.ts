import type { ComputedRef } from "vue";

export const escapeVersion = (version: string): string => version.replace(/_/g, '__').replace(/ /g, '_');

export const useAssetPathParts = (version: string | ComputedRef<string>, path: string[] | ComputedRef<string[]>, compare?: string | ComputedRef<string>): ComputedRef<string[]> => {
    const v = unref(version);
    const p = unref(path);
    const c = unref(compare);
    return computed(() => {
        if (!v || !p) return [];
        let v1 = escapeVersion(v);
        let c1 = c ? escapeVersion(c) : '';
        if (c1) {
            v1 = `${ v1 }...${ c1 }`;
        }
        return [v1, ...p].filter(p => p !== '' && p !== '/')
    });
}

export const useAssetPath = (version: string | ComputedRef<string>, path: string[] | ComputedRef<string[]>, compare?: string | ComputedRef<string>): ComputedRef<string> => {
    const parts = useAssetPathParts(version, path, compare);
    return computed(() => parts.value.join('/'));
}