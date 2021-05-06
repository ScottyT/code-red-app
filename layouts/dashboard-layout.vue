<template>
  <v-app :dark="appTheme">
    <v-navigation-drawer dark v-model="drawer" :mini-variant="miniVariant" clipped open app width="300">
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
      <v-list v-show="isLoggedIn && getUser.role === 'admin'">
        <v-list-item router exact to="/profile/create">
          <v-list-item-content>
            Create Employee
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dark :clipped-left="true" fixed app class="header-navigation">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <button type="button" aria-label="Toggle navigation" class="header-navigation__navbar-toggler">
        <span aria-hidden>
          <span class="header-navigation__toggler--top header-navigation__toggler"></span>
          <span class="header-navigation__toggler--middle header-navigation__toggler"></span>
          <span class="header-navigation__toggler--bottom header-navigation__toggler"></span>
        </span>
      </button> -->

      <v-toolbar-title v-text="title" />
      <ul class="menu-items" v-if="!$vuetify.breakpoint.sm">
        <li class="menu-items__item">
          <a @click="signOut">{{$fire.auth.currentUser ? "Logout" : "Login"}}</a>
        </li>
        <span>{{getUser ? getUser.name : null}}</span>
        <li class="menu-items__item" v-if="user">
          <nuxt-link to="/profile">View saved forms</nuxt-link>
        </li>
        <li class="menu-items__item" v-if="user && $store.state.user.role === 'admin'">
          <nuxt-link to="/completed-jobs">View certificates of completion</nuxt-link>
        </li>
        <li class="menu-items__item" v-if="user && $store.state.user.role === 'admin'">
          <nuxt-link to="/saved-aob-contracts">View AOB & Mitigation Contracts</nuxt-link>
        </li>
      </ul>
      <template v-slot:extension v-if="$vuetify.breakpoint.sm">
        <ul class="menu-items__extended-menu menu-items">
          <li class="menu-items__item">
            <a @click="signOut">{{$fire.auth.currentUser !== null ? "Logout" : "Login"}}</a>
          </li>
          <span>{{getUser ? getUser.name : null}}</span>
          <li class="menu-items__item" v-if="$fire.auth.currentUser">
            <nuxt-link to="/profile">View saved forms</nuxt-link>
          </li>
          <li class="menu-items__item" v-if="$fire.auth.currentUser && $store.state.user.role === 'admin'">
            <nuxt-link to="/completed-jobs">View certificates of completion</nuxt-link>
          </li>
          <li class="menu-items__item" v-if="$fire.auth.currentUser && $store.state.user.role === 'admin'">
            <nuxt-link to="/saved-aob-contracts">View AOB & Mitigation Contracts</nuxt-link>
          </li>
        </ul>
      </template>
    </v-app-bar>
    <v-main>
      <span v-if="!user"><LazyFormsLogin /></span>
      <nuxt class="pa-6" v-else />
    </v-main>
    <v-footer dark :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
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
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Rapid Response Report',
          to: '/rapid-response-form',
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
          title: 'Sketches',
          to: '/sketches',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Atmospheric Readings',
          to: '/atmospheric-readings',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Unit Quantity and Equipment Inventory',
          to: '/inventory-log',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Psychrometric Chart',
          to: '/psychrometric-charting',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'AOB & Mitigation Contract',
          to: '/aob-contract-form',
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
          title: 'Field Jacket',
          to: '/field-jacket',
          access: 'admin'
        },
        {
          icon: 'mdi-folder',
          title: 'Storage',
          to: '/storage'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Code Red Claims',
      user: false
    }
  },
  computed: {
    appTheme() {
      switch (this.user) {
        case true:
          return this.$vuetify.theme.dark = false         
        case false:
          return this.$vuetify.theme.dark = true
        default:
          return this.$vuetify.theme.dark = false    
      }
    },
    matchUrl() {
      return this.$route.path.match(/^(?:^|\W)reports(?:$|\W)(?:\/(?=$))?/gm)
    },
    ...mapGetters(["getUser", "getEmployees", "isLoggedIn"]),
    isOnline() {
      return this.$nuxt.isOnline
    }
  },
  watch: {
    isOnline(val) {
      if (val) {
        this.fetchReports(this.$fire.auth.currentUser)
      }
    }
  },
  methods: {
    ...mapActions({
      fetchReports: 'fetchReports',
      fetchLogs: 'fetchLogs'
    }),
    async signOut() {
      this.$store.dispatch("signout")
    }
  },
  mounted() {
    this.fetchReports(this.$fire.auth.currentUser)
    this.$nextTick(() => {
      this.user = this.$fire.auth.currentUser ? true : false
      
    })
  }
}
</script>