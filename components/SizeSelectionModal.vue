<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
        <template #title>Scale Image</template>
        <template #subtitle>Download the image in an other scale.</template>
      <v-card-text>
        <v-row>
          <v-col v-for="size in sizes" :key="size" cols="4">
            <v-btn @click="selectSize(size)" block variant="flat" color="primary">
              {{ size }}px
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" variant="text">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const show = defineModel<boolean>()

const emit = defineEmits(['select'])

const sizes = [32, 64, 128, 256, 512, 1024]

const selectSize = (size: number) => {
  emit('select', size)
  show.value = false
}

const close = () => {
  show.value = false
}
</script>