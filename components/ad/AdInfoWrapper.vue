<style scoped>
.dismiss-button {
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 1000;
  text-decoration: none;
  color: rgba(145, 145, 145, 0.5);
}

.dismiss-button-bottom {
  top: unset;
  bottom: 4px;
}

.ad-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(80, 80, 80, 0.8);
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
}
</style>
<template>
  <ClientOnly>
    <v-row v-if="ready" v-show="!dismissed"
           class="ad-info-wrapper my-2" justify="center">

      <v-col cols="12"><!-- Info Below -->
        <v-sheet color="grey-darken-3" style="position: relative">
          <a href="#" class="dismiss-button" @click.prevent="dismiss">
            <v-icon icon="mdi-close"></v-icon>
          </a>
          <div class="ad-ribbon">Ad</div>
          <v-row>
            <v-col>
              <slot></slot>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>

    </v-row>
  </ClientOnly>
</template>
<script setup lang="ts">
import {useNuxtApp} from "nuxt/app";

const {smAndUp, mdAndUp, lgAndUp} = useDisplay();

const {$flags, $gtag} = useNuxtApp();

const dismissed = ref(false);
const dismiss = () => {
  dismissed.value = true;
  try {
    $gtag('event', 'dismiss_ad')
  } catch (e) {
    console.error(e);
  }
}

const ready = ref(false);
onMounted(() => {
  ready.value = true;
});
</script>