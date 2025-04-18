import {useRoute} from "#vue-router";
import {useRouter} from "#app";

export const useVersionPath = () => {
    const router = useRouter();
    const route = useRoute();

    // const version = ref(route.params.version as string);
    // const path = ref((route.params.path as string[])?.filter(p => p !== '' && p !== '/') || []);

    // watch(version, (v) => {
    //     console.debug('set version', v);
    //     router.push({path: `/${v}/${(path.value || []).join('/')}`});
    // });
    // watch(path, (p) => {
    //     console.debug('set path', p);
    //     router.push({path: `/${version.value}/${(p || []).join('/')}`});
    // });
    //
    // watch(() => route.params.version, (v) => {
    //     console.debug('watch version', v);
    //     version.value = v as string;
    // });
    // watch(() => route.params.path, (p) => {
    //     console.debug('watch path', p);
    //     path.value = (p as string[])?.filter(p => p !== '' && p !== '/') || [];
    // });

    const version = computed<string>({
        get: () => {
            return route.params.version as string;
        },
        set: (v: string) => {
            console.debug('set version', v);
            router.push({path: `/${v}/${(path.value || []).join('/')}`})
        }
    });
    const path = computed<string[]>({
        get: () => {
            return (route.params.path as string[])?.filter(p => p !== '' && p !== '/');
        },
        set: (p: string[]) => {
            console.debug('set path', p);
            router.push({path: `/${version.value}/${(p || []).join('/')}`})
        }
    });

    return {version, path}
}