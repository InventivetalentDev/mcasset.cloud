import {useRoute} from "#vue-router";
import {useRouter} from "#app";

export const useVersionPath = () => {
    const router = useRouter();
    const route = useRoute();

    const version = computed<string>({
        get: () => {
            return route.params.version as string;
        },
        set: (v: string) => {
            router.push({path:`/${v}/${(path.value||[]).join('/')}`})
        }
    });
    const path = computed<string[]>({
        get: () => {
            return (route.params.path as string[])?.filter(p => p !== '' && p !== '/');
        },
        set: (p: string[]) => {
             router.push({path:`/${version.value}/${(p||[]).join('/')}`})
        }
    });

    return {version, path}
}