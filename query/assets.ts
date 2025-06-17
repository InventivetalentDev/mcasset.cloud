export const useAssets = defineQuery(() => {

    const path = ref<string>('');
    const responseType = ref<'json' | 'blob' | 'text' | 'arrayBuffer' | 'stream'>('json');
    const {state, ...rest} = useQuery({
        key: () => ['assets', path.value],
        query: async () => {
            return await $fetch('https://assets.mcasset.cloud/' + path.value, {
                responseType: responseType.value
            }).catch(e => {
                if (!import.meta.server) {
                    throw e;
                }
                console.error(e);
            })
        },
        enabled: () => !!path.value
    });

    return {
        ...rest,
        asset: state,
        path,
        responseType
    }
});
