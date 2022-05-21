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
                  ユーザー ID
                </th>
                <th
                  class="text-left"
                >
                    ユーザー名
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
              v-for="user in userList"
              :key="user.id"
              >
              <td>
                <router-link
                  :to="{ path: 'user/' + user.id }"
                >
                {{ user.id }}
                </router-link>
              </td>
              <td>
                <router-link
                  :to="{ path: 'user/' + user.id }"
                >
                  {{ user.name }}
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

const AdminUserRepository = RepositoryFactory.get('adminUser')

type UserDetailType = {
  id: string
  name: string,
}

export default defineComponent({
  setup () {
    const store = useStore()

    const router = useRouter()

    const { errorHandling } = useErrorHandling()

    const userList = ref<UserDetailType[]>([])

    const page = ref<number>(1)

    const lastPage = ref<number>(1)

    watch(
      () => (page.value),
      async (page) => {
        await fetchUserData(page)
      }
    )

    const fetchUserData = async (page: number) => {
      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        const res = await AdminUserRepository.index(page)
        conversionUserData(res.data.data)
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

    const conversionUserData = (userArray: UserDetailType[]) => {
      userList.value = userArray.map((user: UserDetailType) => {
        return {
          id: user.id,
          name: user.name
        }
      })
    }

    const initialize = async () => {
      await fetchUserData(page.value)
    }

    onBeforeMount(async () => {
      await initialize()
    })

    return {
      userList,
      page,
      lastPage
    }
  }
})
</script>
