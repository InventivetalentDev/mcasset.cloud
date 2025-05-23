import { useRoute } from "#vue-router";
import { useRouter } from "#app";

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

    const routeVersion = computed<string>({
        get: () => {
            return route.params.version as string;
        },
        set: (v: string) => {
            console.debug('set version', v);
            router.push({path: `/${ v }/${ (path.value || []).join('/') }`})
        }
    });
    const version = computed<string>({
        get: () => {
            return routeVersion.value?.split('...')[0];
        },
        set: (v: string) => {
            routeVersion.value = compare.value ? `${ v }...${ compare.value }` : v;
        }
    });
    const compare = computed<string>({
        get: () => {
            return routeVersion.value?.includes('...') ? routeVersion.value?.split('...')[1] : '';
        },
        set: (v: string) => {
            if (v) {
                routeVersion.value = `${ version.value }...${ v }`;
            } else {
                routeVersion.value = version.value;
            }
        }
    });

    const path = computed<string[]>({
        get: () => {
            return (route.params.path as string[])?.filter(p => p !== '' && p !== '/');
        },
        set: (p: string[]) => {
            console.debug('set path', p);
            router.push({path: `/${ version.value }/${ (p || []).join('/') }`})
        }
    });

    return {version, path, compare}
}