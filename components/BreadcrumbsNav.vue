<template>
  <div>
    <v-sheet color="grey-lighten-2">
      <Breadcrumbs v-bind="{...$attrs,...$props}"/>
    </v-sheet>
  </div>
</template>
<script setup lang="ts">
import Breadcrumbs from "~/components/Breadcrumbs.vue";

const props = defineProps<{
  version: string,
  path: string[],
    compare?:string
}>();
</script>