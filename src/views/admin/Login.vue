<template>
  <v-row
    justify="center"
    align="center"
  >
    <login-card
      @emailChangeValue='emailChangeValue'
      @passwordChangeValue='passwordChangeValue'
      @handleSubmit='handleClick'
    />
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'
import { useRouter, useRoute } from 'vue-router'
import useErrorHandling from '@/Repositories/ErrorHandling'
import LoginCard from '@/components/organisms/LoginCard.vue'
import { EmailInputDataType } from '@/components/atomic/EmailInput.vue'
import { PasswordInputDataType } from '@/components/atomic/PasswordInput.vue'

const AdminLoginRepository = RepositoryFactory.get('adminLogin')

const CsrfRepository = RepositoryFactory.get('csrf')

const { errorHandling } = useErrorHandling()

export default defineComponent({
  name: 'Login',

  components: {
    'login-card': LoginCard
  },

  setup () {
    const store = useStore()

    const router = useRouter()

    const route = useRoute()

    const emailInput = reactive<EmailInputDataType>({
      email: '',
      error: ''
    })

    const passwordInput = reactive<PasswordInputDataType>({
      password: '',
      error: ''
    })

    const emailChangeValue = (emailInputData: EmailInputDataType) => {
      emailInput.email = emailInputData.email
      emailInput.error = emailInputData.error
    }

    const passwordChangeValue = (passwordInputData: PasswordInputDataType) => {
      passwordInput.password = passwordInputData.password
      passwordInput.error = passwordInputData.error
    }

    const handleClick = async (selected: boolean) => {
      if (passwordInput.error === undefined &&
          emailInput.error === undefined &&
          passwordInput.password !== undefined &&
          emailInput.email !== undefined
      ) {
        try {
          store.commit(MutationTypes.SHOW_LOADER, {
            isLoading: true
          })
          /** csrfトークン発行 */
          await CsrfRepository.index()
          /** ログイン処理実行 */
          const res = await AdminLoginRepository.post({
            email: emailInput.email,
            password: passwordInput.password
          })
          console.log({ res })
          /** ユーザー情報取得に失敗した時 */
          if (res.status !== 200 || res.statusText !== 'OK') throw Error('ログインに失敗しました。ログイン情報を確認してください。')
          // /** ユーザー情報をstateに保存 */
          store.commit(MutationTypes.ADD_ADMIN, {
            id: res.data.data.id,
            email: res.data.data.email,
            name: res.data.data.name,
            isLogin: true
          })

          /** redirect 処理を実行 */
          route.query.redirect === undefined ? router.push('/admin/dashboard') : router.push(String(route.query.redirect))
        } catch (error: unknown) {
          console.log(error)
          errorHandling(error, store, router)
        } finally {
          store.commit(MutationTypes.SHOW_LOADER, {
            isLoading: false
          })
        }
      }
    }

    return {
      emailChangeValue,
      passwordChangeValue,
      handleClick
    }
  }
})
</script>
