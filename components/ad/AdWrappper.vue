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
                       crossorigin="anonymous" @error="emit('blocked')"></component>
            <slot name="ad">
                <!-- With width and height set, the unit has a fixed size, so Google's responsive attributes are left out. -->
                <ins class="adsbygoogle"
                     ref="ins"
                     :style="fixedSize ? `display:inline-block;width:${ width }px;height:${ height }px` : 'display:block'"
                     :data-adtest="isDev ? 'on': undefined"
                     :data-ad-client="clientId"
                     :data-ad-slot="adSlot"
                     :data-ad-format="fixedSize ? undefined : adFormat||'auto'"
                     :data-ad-layout-key="adLayoutKey"
                     :data-full-width-responsive="fixedSize ? undefined : responsive||true"></ins>
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

const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const props = defineProps<{
    adSlot?: string;
    adFormat?: string;
    adLayoutKey?: string;
    responsive?: boolean;
    noFallback?: boolean;
    width?: number;
    height?: number;
}>();

// blocked: the AdSense script failed to load, usually because of an ad blocker.
// unfilled: AdSense answered but had no ad for this slot.
const emit = defineEmits<{ blocked: [], unfilled: [] }>();

const fixedSize = computed(() => !!(props.width && props.height));

const ready = ref(false);
onMounted(() => {
    ready.value = true;
});

// AdSense sets data-ad-status on the <ins> once the request finishes: "filled", "unfilled" or "unfill-optimized".
const ins = useTemplateRef<HTMLElement>('ins');
let statusObserver: MutationObserver | undefined;
watch(ins, el => {
    statusObserver?.disconnect();
    if (!el) return;
    statusObserver = new MutationObserver(() => {
        if (el.dataset.adStatus === 'unfilled') emit('unfilled');
    });
    statusObserver.observe(el, {attributes: true, attributeFilter: ['data-ad-status']});
});
onBeforeUnmount(() => statusObserver?.disconnect());
</script>