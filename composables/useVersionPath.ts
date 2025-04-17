import {useRoute} from "#vue-router";

export const useVersionPath = () => {
    const route = useRoute();

    const version = computed<string>(() => {
        return route.params.version as string;
    });
    const path = computed<string[]>(() => {
        return (route.params.path as string[])?.filter(p => p.length > 0);
    });

    return {version, path}
}