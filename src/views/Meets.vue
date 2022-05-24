<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
    >
      <room-detail-card
        :RoomDetail="RoomDetail"
        @handleGoToRoom="handleGoToRoom"
        @handleClose="handleRoomDetailClose"
      />
    </v-dialog>
  </div>
  <v-dialog
    v-model="newRoomDialog"
  >
    <room-card
      :cardTitle="`ルームを作成`"
      :label="`ルーム名`"
      @handleSubmit="handleSubmit"
      @handleClose="handleClose"
    />
  </v-dialog>
  <v-dialog
    v-model="searchRoomDialog"
  >
    <room-card
      :cardTitle="`ルームIDを入力`"
      :label="`ルームID`"
      @handleSubmit="handleSearchRoom"
      @handleClose="handleSearchRoomDialog"
    />
  </v-dialog>
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
                x-large
                color="success"
                class="white--text text-h6"
                @click='newRoomDialog = !newRoomDialog'
              >
                ルーム作成
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
    <v-container>
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
                  x-large
                  color="primary"
                  class="white--text text-h6"
                  @click="searchRoomDialog = true"
                >
                  ルームに参加
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import useErrorHandling from '@/Repositories/ErrorHandling'
import { useRouter, useRoute } from 'vue-router'
import RoomDetailCard, { RoomDetailType } from '@/components/organisms/RoomDetailCard.vue'
import RoomCard from '@/components/organisms/RoomCard.vue'

const RoomRepository = RepositoryFactory.get('room')

export default defineComponent({

  components: {
    RoomDetailCard,
    RoomCard
  },

  setup () {
    const store = useStore()

    const router = useRouter()

    const route = useRoute()

    const dialog = ref<boolean>(false)

    const newRoomDialog = ref<boolean>(false)

    const searchRoomDialog = ref<boolean>(false)

    const RoomDetail = reactive<RoomDetailType>({
      name: '',
      token: '',
      inviteUrl: ''
    })

    const { errorHandling } = useErrorHandling()

    const handleClose = () => {
      newRoomDialog.value = false
    }

    const handleRoomDetailClose = () => {
      dialog.value = false
    }

    const handleSubmit = async (value: string, error: string | undefined) => {
      /** 入力値チェック */
      if (value === '' || error !== undefined) return

      /** ダイアログ非表示 */
      newRoomDialog.value = false

      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        /** ルーム作成処理 */
        const res = await RoomRepository.post(store.state.user.id,
          {
            name: value
          }
        )

        if (res.status !== 200) return
        RoomDetail.name = res.data.data.name
        RoomDetail.token = res.data.data.token
        RoomDetail.inviteUrl = res.data.data.invite_url

        dialog.value = true
      } catch (error: any) {
        errorHandling(error, store, router)
        /** ダイアログ表示 */
        newRoomDialog.value = true
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }

    /**
     * handle search room
     * @param { string } value
     * @param { string | undefined } error
     *
     */
    const handleSearchRoom = async (value: string, error: string | undefined) => {
      /** 入力値チェック */
      if (value === '' || error !== undefined) return
      /** searchRoomDialog 非表示 */
      searchRoomDialog.value = false

      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        /** ルーム検索 */
        const res = await RoomRepository.get({ token: value })

        /** ルーム画面に遷移 */
        handleGoToRoom(res.data.data.name, res.data.data.token)
      } catch (error: any) {
        console.log(error)
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }

    /**
     * handle search room dialog
     *
     */
    const handleSearchRoomDialog = () => {
      searchRoomDialog.value = false
    }

    /**
     * handle go to room.
     * @param { string } name
     * @param { string } token
     *
     */
    const handleGoToRoom = (name: string, token: string) => {
      /** ルーム画面に遷移 */
      router.push({
        path: 'call',
        query: {
          name: name,
          token: token
        }
      })
    }

    const initialize = async () => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        if (route.query.token === undefined) return
        const token = String(route.query.token)
        const res = await RoomRepository.get({
          token: token
        })

        router.push({
          path: 'room',
          query: {
            name: res.data.data.name,
            token: res.data.data.token,
            isCalling: 'true'
          }
        })
      } catch (error: any) {
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }

    initialize()

    return {
      handleSubmit,
      handleClose,
      dialog,
      RoomDetail,
      newRoomDialog,
      handleRoomDetailClose,
      searchRoomDialog,
      handleSearchRoom,
      handleSearchRoomDialog,
      handleGoToRoom
    }
  }
})
</script>
