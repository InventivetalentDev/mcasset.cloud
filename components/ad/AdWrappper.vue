<style scoped>
.ad-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.ad-fallback {
    position: absolute;
    z-index: 0;
}

.adsbygoogle {
    z-index: 1;
}
</style>
<template>
    <ClientOnly>
        <div class="ad-wrapper" v-if="ready">
<!--            <div class="ad-fallback text-red pa-6 text-center w-100" v-show="!noFallback">-->
<!--                Please disable your ad blocker-->
<!--            </div>-->
            <component is="script" async
                       :src="'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + clientId"
                       crossorigin="anonymous"></component>
            <slot name="ad">
                <ins class="adsbygoogle"
                     style="display:block"
                     :data-adtest="isDev ? 'on': undefined"
                     :data-ad-client="clientId"
                     :data-ad-slot="adSlot"
                     :data-ad-format="adFormat||'auto'"
                     :data-ad-layout-key="adLayoutKey"
                     :data-full-width-responsive="responsive||true"></ins>
            </slot>
            <component is="script">
                {{ isDev ? 'google_adtest = "on";' : '' }}
                (adsbygoogle = window.adsbygoogle || []).push({});
                "{{ ready }}";
            </component>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const props = defineProps<{
    adSlot?: string;
    adFormat?: string;
    adLayoutKey?: string;
    responsive?: boolean;
    noFallback?: boolean
}>();

const authStore = useAuthStore();

const ready = ref(false);
onMounted(() => {
    ready.value = true;
});
</script>