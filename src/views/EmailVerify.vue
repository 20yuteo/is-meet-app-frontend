<template>
  <v-container>
    <v-row
      class="blue lighten-4" style="height: 450px;"
      justify="center" align-content="center"
    >
      <v-col>
        <div
          class="text-center text-sm-h5"
        >
          登録処理を行っています。少々お待ちください。
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'

const EmailVerifyRepository = RepositoryFactory.get('emailVerify')
const userRepository = RepositoryFactory.get('user')

export default defineComponent({
  name: 'EmailVerify',

  setup () {
    const store = useStore()

    const route = useRoute()

    const router = useRouter()

    const emailVerify = String(route.query.url).split('/')

    const signature = String(route.query.signature)

    const isLoading = ref<boolean>(false)

    const executeEmailVerify = async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })

        if (route.query.url === undefined || route.query.signature === undefined) throw Error('不正なアクセスです。')

        const param = `${emailVerify[emailVerify.length - 2]}/${emailVerify[emailVerify.length - 1]}&signature=${signature}`
        const res = await EmailVerifyRepository.show(param)
        if (res.status !== 204 && res.statusText !== 'No Content') throw Error('メールアドレス認証に失敗しました。')
        /** ログインユーザー情報を取得 */
        const response = await userRepository.get()
        /** ユーザー情報をstateに保存 */
        store.commit(MutationTypes.ADD_USER, {
          id: response.data.data.id,
          email: response.data.data.email,
          name: response.data.data.name
        })
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

    onMounted(async () => {
      await executeEmailVerify()
    })
    return {

    }
  }
})
</script>
