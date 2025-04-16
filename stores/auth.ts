
export const useAuthStore = defineStore('auth', () => {

    const ghToken = ref<string | null>(null);


    return {
        ghToken,
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});