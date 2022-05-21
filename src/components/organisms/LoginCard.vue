<template>
  <v-card
    width="400px"
    class="py-16 ma-16"
  >
    <v-card-title
        class="headline justify-center text-h4"
    >
        LOGIN
    </v-card-title>
    <v-card-text>
      <v-from
        @submit.prevent="handleSubmit"
      >
        <email-input
          @changeValue="emailChangeValue"
          @handleSubmit="handleSubmit"
        />
        <password-input
          @changeValue="passwordChangeValue"
          @handleSubmit="handleSubmit"
        />
        <v-checkbox
          v-model="selected"
          label="ログイン情報を保持`"
          color="indigo"
          hide-details
        />
        <v-btn
          color="grey"
          class="white--text text-h6"
          @click="handleSubmit"
        >
            SUBMIT
        </v-btn>
      </v-from>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EmailInput, { EmailInputDataType } from '@/components/atomic/EmailInput.vue'
import PasswordInput, { PasswordInputDataType } from '@/components/atomic/PasswordInput.vue'

export default defineComponent({
  name: 'LoginCard',

  components: {
    'email-input': EmailInput,
    'password-input': PasswordInput
  },

  emits: ['emailChangeValue', 'passwordChangeValue', 'handleSubmit'],

  setup (_, { emit }) {
    const selected = ref<boolean>(false)

    const emailChangeValue = (emailInputData: EmailInputDataType) => {
      emit('emailChangeValue', emailInputData)
    }

    const passwordChangeValue = (passwordInputData: PasswordInputDataType) => {
      emit('passwordChangeValue', passwordInputData)
    }

    const handleSubmit = () => {
      emit('handleSubmit', selected.value)
    }

    return {
      selected,
      emailChangeValue,
      passwordChangeValue,
      handleSubmit
    }
  }
})
</script>
