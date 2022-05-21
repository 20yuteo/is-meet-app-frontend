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
      User 詳細情報
    </v-card-title>
    <v-card-text>
      <v-from
        @submit.prevent="handleSubmit"
      >
        <v-text-field
          v-model="userDetail.name"
          :label="`名前`"
          counter
          class="shrink"
        />
        <v-text-field
          v-model="userDetail.email"
          :label="`メールアドレス`"
          counter
          class="shrink"
        />
        <v-btn
          color="grey"
          class="white--text text-h6 pa-4"
          @click="handleSubmit"
        >
          SUBMIT
        </v-btn>
        <v-btn
          color="red"
          class="black--text text-h6"
          @click="handleDelete"
        >
          DELETE
        </v-btn>
      </v-from>
    </v-card-text>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import useErrorHandling from '@/Repositories/ErrorHandling'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'

const AdminUserRepository = RepositoryFactory.get('adminUser')

type UserDetail = {
  id: number
  name: string
  email: string
}

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const route = useRoute()

    const { errorHandling } = useErrorHandling()

    const userDetail = reactive<UserDetail>({
      id: 0,
      name: '',
      email: ''
    })

    const handleSubmit = async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })

        const param = {
          id: userDetail.id,
          name: userDetail.name,
          email: userDetail.email
        }
        const res = await AdminUserRepository.put(param)
        if (!res.status) return
        router.push('/admin/dashboard')
      } catch (error: any) {
        console.log({ error })
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }

    const handleDelete = async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })

        const res = await AdminUserRepository.delete(userDetail.id)
        if (res.status !== 200) return
        router.push('/admin/dashboard')
      } catch (error: any) {
        console.log({ error })
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }

    onBeforeMount(async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        const userId = Number(route.params.id)
        const res = await AdminUserRepository.show(userId)
        userDetail.id = res.data.data.id as number
        userDetail.name = res.data.data.name
        userDetail.email = res.data.data.email
      } catch (error: any) {
        console.log(error)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    })

    return {
      userDetail,
      handleSubmit,
      handleDelete
    }
  }
})
</script>
