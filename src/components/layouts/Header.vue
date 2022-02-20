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
            v-for="(item, i) in items"
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
<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    items: [
      {
        icon: 'mdi-view-dashboard',
        value: 'Dashboard',
        link: '/'
      },
      {
        icon: 'mdi-phone',
        value: 'Meet',
        link: '/meet'
      },
      {
        icon: 'mdi-login-variant',
        value: 'Login',
        link: '/login'
      }
    ]
  }),

  watch: {
    group () {
      this.drawer = false
    }
  }
}
</script>
