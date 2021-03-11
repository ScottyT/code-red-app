<template>
  <v-app :dark="appTheme">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" clipped open app width="300">
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="true" fixed app class="header-navigation">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <button type="button" aria-label="Toggle navigation" class="header-navigation__navbar-toggler">
        <span aria-hidden>
          <span class="header-navigation__toggler--top header-navigation__toggler"></span>
          <span class="header-navigation__toggler--middle header-navigation__toggler"></span>
          <span class="header-navigation__toggler--bottom header-navigation__toggler"></span>
        </span>
      </button> -->

      <v-toolbar-title v-text="title" />
      <ul class="menu-items">
        <li class="menu-items__item">
          <a @click="signOut">{{$fire.auth.currentUser !== null ? "Logout" : "Login"}}</a>
        </li>
        <span>{{getUser ? getUser.name : null}}</span>
        <li class="menu-items__item">
          <nuxt-link to="/profile">View saved forms</nuxt-link>
        </li>
        <li class="menu-items__item">
          <nuxt-link to="/completed-jobs">View certificates of completion</nuxt-link>
        </li>
      </ul>
      
    </v-app-bar>
    <v-main :class="matchUrl !== null ? 'reports-page' : ''">
      <nuxt />
    </v-main>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dispatch Report',
          to: '/',
          access: 'user'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Rapid Response Report',
          to: '/rapid-response-form',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Daily Containment Case File Report',
          to: '/daily-containment-report',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Daily Technician Case File Report',
          to: '/daily-technician-report',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Certificate of Completion',
          to: '/certificate-of-completion',
          access: 'user'
        },
        {
          icon: 'mdi-clipboard',
          title: 'Reports',
          to: '/reports',
          access: 'admin'
        },
        {
          icon: 'mdi-folder',
          title: 'Storage',
          to: '/storage',
          access: 'admin'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Code Red Claims',
      user: null
    }
  },
  computed: {
    appTheme() {
      return this.$vuetify.theme.dark = true
    },
    matchUrl() {
      return this.$route.path.match(/^(?:^|\W)reports(?:$|\W)(?:\/(?=$))?/gm)
    },
    ...mapGetters(["getUser"]),
  },
  methods: {
    async signOut() {
      this.$store.dispatch("signout")
    }
  },
  created() {
    /* auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        this.$store.dispatch("fetchUser", user.email)
        this.$store.dispatch("fetchEmployees")
        this.$store.dispatch("fetchReports")
      } else {
        auth.signOut()
        this.$router.push('/login')
      }
    }) */
  }
}
</script>
<style lang="scss">
.reports-page {
  background-color:$color-white;
  color:$color-black;
}
</style>