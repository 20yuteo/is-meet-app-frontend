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
       <v-table>
          <template
            v-slot:default
          >
            <thead>
              <tr>
                <th
                  class="text-left"
                >
                    ルーム ID
                </th>
                <th
                  class="text-left"
                >
                    ルーム名
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
              v-for="room in roomList"
              :key="room.name"
              >
              <td>
                <router-link
                  :to="{ path: 'room/' + room.id }"
                >
                  {{ room.id }}
                </router-link>
              </td>
              <td>
                <router-link
                  :to="{ path: 'room/' + room.id }"
                >
                  {{ room.name }}
                </router-link>
              </td>
              </tr>
            </tbody>
          </template>
       </v-table>
      </v-col>
    </v-row>
  </v-container>
  <div class="text-center">
    <v-pagination
      v-model="page"
      :length="lastPage"
      circle
    ></v-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import useErrorHandling from '@/Repositories/ErrorHandling'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'

const AdminRoomRepository = RepositoryFactory.get('adminRoom')

type RoomData = {
  id: string,
  name: string
}

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const { errorHandling } = useErrorHandling()

    const roomList = ref<RoomData[]>([])

    const page = ref<number>(1)

    const lastPage = ref<number>(1)

    watch(
      () => (page.value),
      async (page) => {
        await fetchRoomData(page)
      }
    )

    const fetchRoomData = async (page: number) => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        const res = await AdminRoomRepository.index(page)
        conversionRoomData(res.data.data)
        lastPage.value = res.data.meta.last_page as number
      } catch (error: any) {
        console.log({ error })
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    }

    const initialize = async () => {
      await fetchRoomData(page.value)
    }

    const conversionRoomData = (roomArray: any) => {
      roomList.value = roomArray.map((room: any) => {
        return {
          id: room.id,
          name: room.name
        }
      })
    }

    onBeforeMount(async () => {
      await initialize()
    })

    return {
      page,
      lastPage,
      roomList
    }
  }
})
</script>
