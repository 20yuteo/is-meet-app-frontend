<template>
    <v-text-field
        v-model="value"
        label="Password"
        counter
        class="shrink"
    ></v-text-field>
    <span>{{ errorMessage }}</span>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { useField } from 'vee-validate'
import * as yup from 'yup'

export default defineComponent({
  name: 'PasswordInput',

  props: {
    value: {
      type: String,
      required: true
    },
    errorMessage: {
      value: String,
      required: true
    }
  }

  setup () {
    const { value, errorMessage } =
      useField('field', yup.string().required('パスワードを入力してください。')
        .matches(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
          { excludeEmptyString: true, message: 'パスワードは半角英字と半角数字それぞれ1文字以上含む8文字以上100文字以下の文字列で入力してください。' }
        )
      )

    return {
      value,
      errorMessage
    }
  }
})
</script>
