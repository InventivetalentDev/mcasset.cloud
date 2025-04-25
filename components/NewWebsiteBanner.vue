<style scoped>
.new-website-banner {
    right: 0;
    bottom: 0;
    z-index: 1000;
}
</style>
<template>
    <v-alert
        v-if="showBanner"
        position="fixed"
        class="new-website-banner ma-8"
        variant="elevated"
        type="info"
        closable
        @click:close="onClosed"
    >
        <template v-slot:title>
            Welcome to the new MCAssets Browser!
        </template>
        <template v-slot:text>
            Please <a class="text-decoration-none text-indigo"
                                                      href="https://forms.gle/1P7vMomYP16zC5ix5" target="_blank">share your Feedback</a>.<br/>
            <small>You can also go back
                to the <a class="text-decoration-none text-purple text-indigo"
                          href="https://classic.mcasset.cloud?utm_source=website_v2&utm_medium=link&utm_campaign=announcement_banner">classic
                    browser</a></small>
        </template>
    </v-alert>
</template>
<script setup lang="ts">
import { useSettingsStore } from "#imports";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();
const {newWebsiteBannerClosed} = storeToRefs(settingsStore);

const isHydrated = ref(false);
const showBanner = computed(() => {
    return isHydrated.value && (!newWebsiteBannerClosed.value || newWebsiteBannerClosed.value < Math.floor(Date.now()) - 1000 * 60 * 60 * 24 * 7);
});

const onClosed = () => {
    newWebsiteBannerClosed.value = Math.floor(Date.now());
}

onMounted(() => {
    isHydrated.value = true;
})
</script>