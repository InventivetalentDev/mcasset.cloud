import { defineStore } from "pinia";

export const useScrollStore = defineStore('scroll', () => {

    const rootScroll = ref<number>(0);
    const assetListScroll = ref<Record<string, number>>({});

    return {
        rootScroll,
        assetListScroll
    }

})