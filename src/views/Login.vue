<template>
  <v-row
    justify="center"
    align="center"
  >
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
          @submit.prevent="handleClick"
        >
          <v-text-field
           v-model="emailValid"
           :label="`email`"
           counter
           class="shrink"
          />
          <span>
            {{ emailError }}
          </span>
          <v-text-field
           v-model="passwordValid"
           :label="`password`"
           counter
           class="shrink"
          />
          <span>
            {{ passwordError }}
          </span>
          <v-btn
              color="grey"
              class="white--text text-h6"
              @click="handleClick"
          >
            SUBMIT
          </v-btn>
        </v-from>
    </v-card-text>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

export default defineComponent({
  setup () {
    const loginSchema = yup.object({
      password: yup.string().required('パスワードを入力してください。')
        .matches(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
          { excludeEmptyString: true, message: 'パスワードは半角英字と半角数字それぞれ1文字以上含む8文字以上100文字以下の文字列で入力してください。' }),
      email: yup.string().required('Eメールを入力してください。')
        .email('Eメールの形式で入力してください。')
    })

    useForm({
      validationSchema: loginSchema
    })

    const { value: email, errorMessage: emailError } = useField<string>('email')

    const { value: password, errorMessage: passwordError } = useField<string>('password')

    const emailValid = computed({
      get: (): string => email.value,
      set: (value: string) => {
        email.value = value
      }
    })

    const passwordValid = computed({
      get: (): string => password.value,
      set: (value: string) => {
        password.value = value
      }
    })

    const handleClick = () => {
      if (passwordError.value === undefined &&
          emailError.value === undefined &&
          passwordValid.value !== undefined &&
          emailValid.value !== undefined
      ) {
        console.log('success')
      }
    }

    return {
      handleClick,
      passwordValid,
      passwordError,
      emailValid,
      emailError
    }
  }
})
</script>
