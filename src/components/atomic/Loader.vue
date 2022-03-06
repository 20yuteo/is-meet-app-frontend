<template>
  <v-overlay
   v-model="isLoading"
   class="align-center justify-center"
  >
    <v-progress-circular
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'Loader',

  setup () {
    const store = useStore()

    const isLoading = ref<boolean>(false)

    watchEffect(() => {
      isLoading.value = store.state.loader.isLoading
    })

    return {
      isLoading
    }
  }
})
</script>
