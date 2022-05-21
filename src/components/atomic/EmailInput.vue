<template>
  <v-text-field
    v-model="emailInputValid"
    :label="`Email`"
    counter
    class="shrink"
    dense
    @keypress.prevent.enter.exact="handleSubmit"
    @input="changeValue"
  ></v-text-field>

  <strong
    class="text-red text--darken-4"
  >
    {{ emailInputError }}
  </strong>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

export type EmailInputDataType = {
  email: string,
  error: string | undefined
}

export default defineComponent({
  name: 'EmailInput',

  emits: ['changeValue', 'handleSubmit'],

  setup (_, { emit }) {
    const TextSchema = yup.object({
      emailInput: yup.string().required('Eメールを入力してください。')
        .email('Eメールの形式で入力してください')
    })

    useForm({
      validationSchema: TextSchema
    })

    const { value: emailInput, errorMessage: emailInputError } = useField<string>('emailInput')

    const emailInputValid = computed({
      get: (): string => emailInput.value,
      set: (value: string) => {
        emailInput.value = value
      }
    })

    const changeValue = () => {
      const emailInputData: EmailInputDataType = {
        email: emailInputValid.value,
        error: emailInputError.value
      }
      emit('changeValue', emailInputData)
    }

    const handleSubmit = () => {
      emit('handleSubmit')
    }

    return {
      emailInputValid,
      emailInputError,
      changeValue,
      handleSubmit
    }
  }
})
</script>
