<template>
  <v-app>
    <Header/>
    <Alert/>
    <Loader/>
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
import Alert from './components/atomic/Alert.vue'
import Loader from './components/atomic/Loader.vue'

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer,
    Alert,
    Loader
  }
})
</script>
