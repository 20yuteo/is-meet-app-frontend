<template>
  <v-text-field
    v-model="passwordInputValid"
    :label="`password`"
    counter
    class="shrink"
    dense
    @keypress.prevent.enter.exact="handleSubmit"
    @input="changeValue"
  ></v-text-field>

  <strong
    class="text-red text--darken-4"
  >
    {{ passwordInputError }}
  </strong>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

export type PasswordInputDataType = {
  password: string,
  error: string | undefined
}

export default defineComponent({
  name: 'PasswordInput',

  emits: ['changeValue', 'handleSubmit'],

  setup (_, { emit }) {
    const TextSchema = yup.object({
      passwordInput: yup.string().required('パスワードを入力してください。')
        .matches(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
          { excludeEmptyString: true, message: 'パスワードは半角英字と半角数字それぞれ1文字以上含む8文字以上100文字以下の文字列で入力してください。' })
    })

    useForm({
      validationSchema: TextSchema
    })

    const { value: passwordInput, errorMessage: passwordInputError } = useField<string>('passwordInput')

    const passwordInputValid = computed({
      get: (): string => passwordInput.value,
      set: (value: string) => {
        passwordInput.value = value
      }
    })

    const changeValue = () => {
      const passwordInputData: PasswordInputDataType = {
        password: passwordInputValid.value,
        error: passwordInputError.value
      }
      emit('changeValue', passwordInputData)
    }

    const handleSubmit = () => {
      emit('handleSubmit')
    }

    return {
      passwordInputValid,
      passwordInputError,
      changeValue,
      handleSubmit
    }
  }
})
</script>
