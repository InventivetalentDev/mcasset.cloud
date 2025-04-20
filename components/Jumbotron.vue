<style scoped>
.jumbotron {
background:linear-gradient(to bottom, #4F9D98 0%, #217E7C 100%);
}
</style>
<template>
  <v-card class="jumbotron" color="#217E7C">
    <v-card-text>
      <v-row>
        <v-col cols="2" lg="1" class="px-md-2 ml-md-4">
          <v-img max-width="64" alt="MCAsset Logo" src="/img/mc-assets-2-64.png"/>
        </v-col>
        <v-col>
          <h1 class="font-weight-bold text-black mb-2">
            <span class="d-md-none">MC</span>
            <span class="d-md-inline-block d-none">Minecraft</span>
            Assets
            <span class="text-h5 font-weight-light">Explorer</span>
          </h1>
          <span class="text-black text-h6 text-wrap">
          Browse Minecraft assets,
          including Textures, Sounds, Models, Fonts, Shaders, and more
        </span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
</script>