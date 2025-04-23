import type { ComputedRef } from "vue";

export const useAssetPathParts = (version: string | ComputedRef<string>, path: string[] | ComputedRef<string[]>, compare?: string | ComputedRef<string>): ComputedRef<string[]> => {
    const v = unref(version);
    const p = unref(path);
    const c = unref(compare);
    return computed(() => {
        if (!v || !p) return [];
        let v1 = v;
        if (c) {
            v1 = `${ v }...${ c }`;
        }
        return [v1, ...p].filter(p => p !== '' && p !== '/')
    });
}

export const useAssetPath = (version: string | ComputedRef<string>, path: string[] | ComputedRef<string[]>, compare?: string | ComputedRef<string>): ComputedRef<string> => {
    const parts = useAssetPathParts(version, path, compare);
    return computed(() => parts.value.join('/'));
}