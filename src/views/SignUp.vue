<template>
  <v-row
    justify="center"
    align="center"
  >
    <v-card
      width="400px"
      class="py-8 ma-16"
    >
    <v-card-title
      class="headline justify-center text-h4"
    >
      SIGN UP
    </v-card-title>
      <v-card-text>
        <v-from
          @submit.prevent="handleClick"
        >
          <v-text-field
            v-model="nameValid"
            :label="`name`"
            counter
            class="shrink"
          />
          <span>
            {{ nameError }}
          </span>
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
          <v-text-field
            v-model="passwordConfirmationValid"
            :label="`password（確認）`"
            counter
            class="shrink"
          />
          <span>
            {{ passwordConfirmationError }}
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
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'
import { useRouter } from 'vue-router'

const RegisterRepository = RepositoryFactory.get('register')

const CsrfRepository = RepositoryFactory.get('csrf')

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const SignInSchema = yup.object({
      name: yup.string().required('名前を入力してください。'),
      password: yup.string().required('パスワードを入力してください。')
        .matches(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
          { excludeEmptyString: true, message: 'パスワードは半角英字と半角数字それぞれ1文字以上含む8文字以上100文字以下の文字列で入力してください。' }),
      passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'パスワードが不一致しています。'),
      email: yup.string().required('Eメールを入力してください。')
        .email('Eメールの形式で入力してください。')
    })

    useForm({
      validationSchema: SignInSchema
    })

    const { value: name, errorMessage: nameError } = useField<string>('name')

    const { value: email, errorMessage: emailError } = useField<string>('email')

    const { value: password, errorMessage: passwordError } = useField<string>('password')

    const { value: passwordConfirmation, errorMessage: passwordConfirmationError } = useField<string>('passwordConfirmation')

    const nameValid = computed({
      get: (): string => name.value,
      set: (value: string) => {
        name.value = value
      }
    })

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

    const passwordConfirmationValid = computed({
      get: (): string => passwordConfirmation.value,
      set: (value: string) => {
        passwordConfirmation.value = value
      }
    })

    const handleClick = async () => {
      if (nameError.value === undefined &&
          passwordError.value === undefined &&
          passwordConfirmationError.value === undefined &&
          emailError.value === undefined &&
          nameValid.value !== undefined &&
          passwordValid.value !== undefined &&
          passwordConfirmationValid.value !== undefined &&
          emailValid.value !== undefined
      ) {
        try {
          store.commit(MutationTypes.SHOW_LOADER, {
            isLoading: true
          })
          /** csrfトークン発行 */
          await CsrfRepository.index()
          /** ログイン処理実行 */
          const res = await RegisterRepository.post({
            name: nameValid.value,
            email: emailValid.value,
            password: passwordValid.value,
            password_confirmation: passwordConfirmation.value
          })

          /** ユーザー情報取得に失敗した時 */
          if (res.status !== 201 && res.statusText !== 'Created') throw Error('ユーザー登録が失敗しました。')

          /** ホーム画面に遷移 */
          router.push('/send_email')
        } catch (error: any) {
          store.commit(MutationTypes.ADD_ALERT, {
            hasAlert: true,
            AlertMessage: error.message
          })
          console.log(error.status)
          console.log(error.message)
        } finally {
          store.commit(MutationTypes.SHOW_LOADER, {
            isLoading: false
          })
        }
      }
    }

    return {
      handleClick,
      nameValid,
      nameError,
      passwordValid,
      passwordError,
      passwordConfirmationValid,
      passwordConfirmationError,
      emailValid,
      emailError
    }
  }
})
</script>
