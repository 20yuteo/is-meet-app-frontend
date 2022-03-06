<template>
  <v-alert
    v-model="alert"
    prominent
    type="error"
    class="ma-2"
    closable
    @click="handleClick"
  >
    <div class="d-flex flex-row align-center">
      <div>
        {{ alertMessage }}
      </div>
    </div>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'

export default defineComponent({
  name: 'Alert',
  setup () {
    const store = useStore()

    const alert = ref<boolean>(false)

    const alertMessage = ref<string>('')

    const handleClick = () => {
      store.commit(MutationTypes.ADD_ALERT, {
        hasAlert: false,
        AlertMessage: ''
      })
    }

    watchEffect(() => {
      alert.value = store.state.alert.hasAlert
      alertMessage.value = store.state.alert.AlertMessage
    })

    return {
      alert,
      alertMessage,
      handleClick
    }
  }
})
</script>
