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
        <v-btn @click="close" variant="outline">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'select'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const sizes = [32, 64, 128, 256, 512, 1024]

const selectSize = (size: number) => {
  emit('select', size)
  show.value = false
}

const close = () => {
  show.value = false
}
</script>