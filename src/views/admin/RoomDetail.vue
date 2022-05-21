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
      Room 詳細情報
    </v-card-title>
    <v-card-text>
      <v-from
        @submit.prevent="handleSubmit"
      >
        <v-text-field
          v-model="roomDetail.name"
          :label="`名前`"
          counter
          class="shrink"
        />
        <v-text-field
          v-model="roomDetail.inviteUrl"
          :label="`招待URL`"
          counter
          class="shrink"
        />
        <v-text-field
          v-model="roomDetail.joinMemberCount"
          :label="`参加者数`"
          counter
          type="number"
          class="shrink"
        />
        <v-text-field
          v-model="roomDetail.token"
          :label="`トークン`"
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

const AdminRoomRepository = RepositoryFactory.get('adminRoom')

type RoomDetailType = {
  id: number
  name: string
  inviteUrl: string
  joinMemberCount: number
  token: string
  createdAt: Date | null
}

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const route = useRoute()

    const { errorHandling } = useErrorHandling()

    const roomDetail = reactive<RoomDetailType>({
      id: 0,
      name: '',
      inviteUrl: '',
      joinMemberCount: 0,
      token: '',
      createdAt: null
    })

    const handleSubmit = async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })

        const param = {
          id: roomDetail.id,
          name: roomDetail.name,
          token: roomDetail.token,
          join_member_count: roomDetail.joinMemberCount,
          invite_url: roomDetail.inviteUrl
        }
        const res = await AdminRoomRepository.put(param)
        if (!res.status) return
        router.push('admin/dashboard')
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

        const res = await AdminRoomRepository.delete(roomDetail.id)
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
      store.commit(MutationTypes.SHOW_LOADER, {
        isLoading: true
      })

      const roomId = Number(route.params.id)
      const res = await AdminRoomRepository.show(roomId)

      roomDetail.createdAt = new Date(res.data.data.created_at)
      roomDetail.id = res.data.data.id as number
      roomDetail.inviteUrl = res.data.data.invite_url
      roomDetail.joinMemberCount = res.data.data.join_member_count as number
      roomDetail.name = res.data.data.name
      roomDetail.token = res.data.data.token

      store.commit(MutationTypes.SHOW_LOADER, {
        isLoading: false
      })
    })

    return {
      roomDetail,
      handleSubmit,
      handleDelete
    }
  }
})
</script>
