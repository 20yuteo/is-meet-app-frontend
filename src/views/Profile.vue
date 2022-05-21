<template>
  <v-row
    justify="center"
    align="center"
  >
    <v-card
      width="400px"
      class="py-16 ma-16"
    >
        <v-card-title class="white--text mt-8">
            <v-avatar
                size="56"
                color="info"
            >
                <v-icon>
                mdi-account-circle
                </v-icon>
            </v-avatar>
            <p class="ml-3">
                John Doe
            </p>
        </v-card-title>
        <v-card-text>
            test text
        </v-card-text>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Profile'
})
</script>
