<template>
  <skyway-video
    :room-name="roomName"
    :user-id="userId"
    :user-name="userName"
    :token="token"
    @disconnect="disconnect"
  >
  </skyway-video>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'
import VideoRoom from '@/components/VideoRoom.vue'
import SkywayVideo from '@/components/SkywayVideo.vue'
import { useStore } from '@/store/index'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Room',

  components: {
    SkywayVideo
  },

  setup () {
    const store = useStore()

    const route = useRoute()

    const router = useRouter()

    const roomName = ref<string>('')

    const userName = ref<string>('')

    const userId = ref<string>('')

    const token = ref<string>('')

    const disconnect = () => {
      router.push('/meets')
    }

    onBeforeMount(async () => {
      if (route.query === undefined) return
      roomName.value = String(route.query.name)
      userName.value = String(route.query.user_name)
      userId.value = String(route.query.member_id)
      token.value = String(route.query.token)
      if (!store.state.user.isLogin) return
      userName.value = String(store.state.user.name)
      userId.value = String(store.state.user.id)
    })

    return {
      roomName,
      userName,
      userId,
      token
    }
  }
})
</script>
<style lang="scss" scoped>
// .skyway-video
</style>
