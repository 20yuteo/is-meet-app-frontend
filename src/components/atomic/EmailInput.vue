<template>
    <v-text-field
        v-model="value"
        :rules="emailRules"
        label="E-mail"
        required
    ></v-text-field>
    <span>
    {{ errorMessage }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useField } from 'vee-validate'
import * as yup from 'yup'

export default defineComponent({
  name: 'EmailInput',

  setup () {
    const { value, errorMessage } =
      useField('field',
        yup.string().required('Eメールを入力してください。')
          .email('Eメールの形式で入力してください。')
      )
    return {
      value,
      errorMessage
    }
  }
})
</script>
