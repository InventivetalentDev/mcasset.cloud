import { defineStore } from "pinia";

export const useSettingsStore = defineStore('settings', () => {

    const newWebsiteBannerClosed = ref<number>(0);

    return {
        newWebsiteBannerClosed
    }

}, {
    persist: {
        storage: piniaPluginPersistedstate.cookies({
            domain: '.mcasset.cloud',
            maxAge: 60 * 60 * 24 * 7
        })
    }
})