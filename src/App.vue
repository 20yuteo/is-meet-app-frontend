<template>
  <v-app>
    <Header/>
    <Alert/>
    <Loader/>
    <v-main>
      <router-view/>
    </v-main>
    <Footer/>
    <vue-cookie-accept-decline
      :debug="false"
      :disableDecline="false"
      :showPostponeButton="false"
      @clicked-accept="cookieClickedAccept"
      @clicked-decline="cookieClickedDecline"
      @clicked-postpone="cookieClickedPostpone"
      @removed-cookie="cookieRemovedCookie"
      @status="cookieStatus"
      elementId="myPanel1"
      position="bottom-left"
      ref="myPanel1"
      transitionName="slideFromBottom"
      type="floating"
    >
      <!-- Optional -->
      <template #postponeContent>&times;</template>

      <!-- Optional -->
      <template #message>
        当サイトはCookieを使用します。
      </template>

      <!-- Optional -->
      <template #declineContent>拒否</template>

      <!-- Optional -->
      <template #acceptContent>同意</template>
    </vue-cookie-accept-decline>
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
  },
  setup () {
    const cookieClickedAccept = () => {
      console.log('cookieClickedAccept')
    }

    const cookieClickedDecline = () => {
      console.log('cookieClickedDecline')
    }

    const cookieClickedPostpone = () => {
      console.log('cookieClickedPostpone')
    }

    const cookieRemovedCookie = () => {
      console.log('cookieRemovedCookie')
    }

    const cookieStatus = () => {
      console.log('cookieStatus')
    }
    return {
      cookieClickedAccept,
      cookieClickedDecline,
      cookieClickedPostpone,
      cookieRemovedCookie,
      cookieStatus
    }
  }
})
</script>
