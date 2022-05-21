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
      class="headline justify-center text-h5"
    >
      参加者名を入力
    </v-card-title>
    <v-card-text>
      <v-from
        @submit.prevent="handleSubmit"
      >
        <text-input
          :label="`参加者名`"
          @changeValue="changeValue"
          @handleSubmit="handleSubmit"
        />
        <div
          class='pa-2 text-center'
        >
          <v-btn
              color="grey"
              class="white--text text-h6"
              @click="handleSubmit"
          >
            SUBMIT
          </v-btn>
        </div>
      </v-from>
    </v-card-text>
    </v-card>
  </v-row>
</template>

<script lang='ts'>
import { defineComponent, ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TextInput from '@/components/atomic/TextInput.vue'
import { RepositoryFactory } from '@/Repositories/RepositoryFactory'
import { useStore } from '@/store/index'
import * as MutationTypes from '@/store/mutationType'
import useErrorHandling from '@/Repositories/ErrorHandling'

const MemberRepository = RepositoryFactory.get('member')

export default defineComponent({

  components: {
    TextInput
  },

  setup () {
    const store = useStore()

    const route = useRoute()

    const router = useRouter()

    const text = ref<string>('')

    const textError = ref<string | undefined>(undefined)

    const { errorHandling } = useErrorHandling()

    const handleSubmit = async (value: string, error: string | undefined) => {
      if (text.value === '' || textError.value !== undefined || route.query.token === undefined) return

      const token = route.query.token as string

      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })
        const res = await MemberRepository.post({
          name: text.value,
          token: token
        })

        router.push({
          path: '/room',
          query: {
            name: res.data.data.name,
            user_name: text.value,
            member_id: res.data.data.member_id,
            token: res.data.data.token
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

    const changeValue = (value: string, error: string | undefined) => {
      text.value = value
      textError.value = error
    }

    onBeforeMount(async () => {
      /** auth check と tokenがあるがどうか */
      if (!store.getters.isLogin || route.query.token === undefined) return

      try {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: true
        })

        const res = await MemberRepository.post({
          name: store.state.user.name,
          token: route.query.token
        })

        router.push({
          path: '/room',
          query: {
            name: res.data.data.name,
            user_name: store.state.user.name as string,
            member_id: res.data.data.member_id,
            token: res.data.data.token
          }
        })
      } catch (error: any) {
        errorHandling(error, store, router)
      } finally {
        store.commit(MutationTypes.SHOW_LOADER, {
          isLoading: false
        })
      }
    })

    return {
      handleSubmit,
      changeValue
    }
  }
})
</script>
