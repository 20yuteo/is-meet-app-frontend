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
          <v-checkbox
            v-model="selected"
            label="ログイン情報を保持する`"
            color="indigo"
            hide-details
          ></v-checkbox>
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
import { defineComponent, computed, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'
import { useRouter } from 'vue-router'

const LoginRepository = RepositoryFactory.get('login')

const CsrfRepository = RepositoryFactory.get('csrf')

const userRepository = RepositoryFactory.get('user')

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const selected = ref<boolean>(false)

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

    const handleClick = async () => {
      if (passwordError.value === undefined &&
          emailError.value === undefined &&
          passwordValid.value !== undefined &&
          emailValid.value !== undefined
      ) {
        try {
          store.commit(MutationTypes.SHOW_LOADER, {
            isLoading: true
          })
          /** csrfトークン発行 */
          await CsrfRepository.index()
          /** ログイン処理実行 */
          const res = await LoginRepository.post({
            email: emailValid.value,
            password: passwordValid.value,
            remember: selected.value
          })
          /** ユーザー情報取得に失敗した時 */
          if (res.status !== 200 || res.statusText !== 'OK') throw Error('ログインに失敗しました。ログイン情報を確認してください。')

          /** ログインユーザー情報を取得 */
          const response = await userRepository.get()
          /** ユーザー情報をstateに保存 */
          store.commit(MutationTypes.ADD_USER, {
            id: response.data.data.id,
            email: response.data.data.email,
            name: response.data.data.name
          })

          /** ホーム画面に遷移 */
          router.push('/')
        } catch (error: any) {
          store.commit(MutationTypes.ADD_ALERT, {
            hasAlert: true,
            AlertMessage: error.message
          })
        } finally {
          store.commit(MutationTypes.SHOW_LOADER, {
            isLoading: false
          })
        }
      }
    }

    return {
      handleClick,
      passwordValid,
      passwordError,
      emailValid,
      emailError,
      selected
    }
  }
})
</script>
