<template>
  <v-container
    class="grey lighten-5"
  >
    <v-row
      no-gutters
    >
      <v-col
        cols="12"
        md="12"
      >
        <v-card>
          <v-card-actions>
            <v-row
              justify='center'
            >
              <v-btn
                color="success"
                class="white--text text-h6"
                @click="handleGoToRoomIndex"
              >
                ルーム一覧へ
              </v-btn>
            </v-row>
            <v-row
              justify='center'
            >
              <v-btn
                color="primary"
                class="white--text text-h6"
                @click="handleGoToUserIndex"
              >
                ユーザー一覧へ
              </v-btn>
            </v-row>
            <v-row
              justify='center'
            >
              <v-btn
                color="primary"
                class="white--text text-h6"
                @click="handleLogout"
              >
                ログアウト
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import useErrorHandling from '@/Repositories/ErrorHandling'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'

const AdminLogoutRepository = RepositoryFactory.get('adminLogout')

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const { errorHandling } = useErrorHandling()

    const handleGoToRoomIndex = () => {
      router.push('/admin/room')
    }

    const handleGoToUserIndex = () => {
      router.push('/admin/user')
    }

    const handleLogout = async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        const res = await AdminLogoutRepository.post()
        if (res.status !== 204) return
        // /** ユーザー情報をstateに保存 */
        store.commit(MutationTypes.ADD_ADMIN, {
          id: 0,
          email: '',
          name: '',
          isLogin: false
        })
        router.push('/admin/login')
      } catch (error: any) {
        console.log({ error })
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }
    return {
      handleGoToRoomIndex,
      handleGoToUserIndex,
      handleLogout
    }
  }
})
</script>
