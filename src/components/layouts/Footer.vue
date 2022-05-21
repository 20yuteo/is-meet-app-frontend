<template>
    <v-footer
        class="bg-grey-lighten-1 text-white text-center d-flex flex-column"
    >
        <div>
            <v-btn
                v-for="icon in icons"
                :key="icon"
                class="mx-4 text-white"
                :icon="icon"
                variant="text"
            ></v-btn>
        </div>
        <v-divider></v-divider>
        <div class="text-white">
            {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </div>
    </v-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',
  data: () => ({
    icons: [
      'mdi-twitter'
    ]
  })
})
</script>
