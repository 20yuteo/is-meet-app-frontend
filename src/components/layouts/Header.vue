<template>
  <v-card>
    <v-layout>
      <v-app-bar
        prominent
        app
      >
        <v-toolbar-title
          class="text-h5"
        >
          Meet APP
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="text" icon="mdi-magnify"></v-btn>

        <v-btn variant="text" icon="mdi-filter"></v-btn>

        <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
        <p
          v-for="(item, i) in fetchItems"
          :key="i"
        >
          <v-btn variant="text" :icon="item.icon" :to="item.to"></v-btn>
        </p>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        bottom
        temporary
      >
      </v-navigation-drawer>
      <v-main/>
    </v-layout>
  </v-card>
</template>
<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { useStore } from '@/store/index'
import { AuthStatusType } from '../../../constants/index'

export default defineComponent({
  setup () {
    const store = useStore()
    const drawer = ref<boolean>(false)
    const group = ref<any>(null)
    const items = [
      {
        icon: 'mdi-view-dashboard',
        value: 'Dashboard',
        link: '/',
        authStatus: AuthStatusType.ACCESSABLE
      },
      {
        icon: 'mdi-account-group-outline',
        value: 'Meets',
        link: '/meets',
        authStatus: AuthStatusType.AUTHENTICATED
      },
      {
        icon: 'mdi-card-account-details-outline',
        value: 'Profile',
        link: '/profile',
        authStatus: AuthStatusType.AUTHENTICATED
      },
      {
        icon: 'mdi-login-variant',
        value: 'Login',
        link: '/login',
        authStatus: AuthStatusType.UN_AUTHENTICATED
      },
      {
        icon: 'mdi-account-plus',
        value: 'SignUp',
        link: '/sign_up',
        authStatus: AuthStatusType.UN_AUTHENTICATED
      },
      {
        icon: 'mdi-logout-variant',
        value: 'Logout',
        link: '/logout',
        authStatus: AuthStatusType.AUTHENTICATED
      }
    ]
    watch(group, () => {
      drawer.value = !drawer.value
    })

    const fetchItems = computed(() => {
      return items.filter(function (i) {
        return i.authStatus === AuthStatusType.ACCESSABLE ||
          (store.state.user.id === 0 && i.authStatus === AuthStatusType.UN_AUTHENTICATED) ||
          (store.state.user.id !== 0 && i.authStatus === AuthStatusType.AUTHENTICATED)
      })
    })

    return {
      drawer,
      group,
      fetchItems
    }
  }
})
</script>
