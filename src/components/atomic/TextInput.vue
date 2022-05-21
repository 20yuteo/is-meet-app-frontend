<template>
  <v-text-field
    v-model="textInputValid"
    :label="props.label"
    counter
    class="shrink"
    dense
    @keypress.prevent.enter.exact="handleSubmit"
    @input="changeValue"
  ></v-text-field>

  <strong
    class="text-red text--darken-4"
  >
    {{ textInputError }}
  </strong>

</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

export default defineComponent({
  name: 'TextInput',

  props: {
    label: {
      type: String,
      required: true
    }
  },

  emits: ['changeValue', 'handleSubmit'],

  setup (props, { emit }) {
    const value = ref<string>('')

    const TextSchema = yup.object({
      textInput: yup.string().required('入力してください。')
        .max(255, '最大入力数は255文字です。')
    })

    useForm({
      validationSchema: TextSchema
    })

    const { value: textInput, errorMessage: textInputError } = useField<string>('textInput')

    const textInputValid = computed({
      get: (): string => textInput.value,
      set: (value: string) => {
        textInput.value = value
      }
    })

    const changeValue = () => {
      console.log(textInputValid.value)
      console.log(textInputError)
      emit('changeValue', textInputValid.value, textInputError.value)
    }

    const handleSubmit = () => {
      emit('handleSubmit')
    }

    return {
      props,
      value,
      textInputValid,
      textInputError,
      changeValue,
      handleSubmit
    }
  }
})
</script>
