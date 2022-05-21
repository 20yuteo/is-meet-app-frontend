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
          ログアウトしています。
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'
import { useRouter } from 'vue-router'
import useErrorHandling from '@/Repositories/ErrorHandling'

const CsrfRepository = RepositoryFactory.get('csrf')

const LogoutRepository = RepositoryFactory.get('logout')

const { errorHandling } = useErrorHandling()

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const handleLogout = async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        const res = await LogoutRepository.post({})
        if (res.status !== 204 && res.statusText !== 'No Content') throw Error('ログアウトに失敗しました。')
        /** ユーザー情報をstateに保存 */
        store.commit(MutationTypes.ADD_USER, {
          id: 0,
          email: '',
          name: '',
          isLogin: false
        })
        router.push('/meets')
      } catch (error: any) {
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }

    onMounted(async () => {
      await handleLogout()
    })
  }
})
</script>
