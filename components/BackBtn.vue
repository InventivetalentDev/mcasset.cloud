<template>
  <v-btn icon size="small" @click="goBack">
    <v-icon icon="mdi-arrow-left"/>
  </v-btn>
</template>
<script setup lang="ts">
import {useRouter} from "#app";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>