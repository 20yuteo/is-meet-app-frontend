<template>
  <v-card>
    <v-layout>
      <v-app-bar
        prominent
        app
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title
          class="text-h5"
        >
          Meet APP
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="text" icon="mdi-magnify"></v-btn>

        <v-btn variant="text" icon="mdi-filter"></v-btn>

        <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        bottom
        temporary
      >
        <v-list color="transparent">
          <v-list-item
            v-for="(item, i) in fetchItems"
            :key="i"
          >
            <router-link
              style="text-decoration: none; color: inherit;"
              :to="{ path: item.link }"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.value"
                />
              </v-list-item-content>
            </router-link>
          </v-list-item>
        </v-list>

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
