<template>
  <v-app>
    <Header/>
    <v-main>
      <router-view/>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from './components/layouts/Header.vue'
import Footer from './components/layouts/Footer.vue'
export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer
  }
})
</script>
