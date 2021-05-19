<template>
  <v-app :dark="appTheme">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" clipped open app :width="$vuetify.breakpoint.width < 768 ? 300 : 400">
      <button v-if="$vuetify.breakpoint.width < 1200" type="button" class="button__icon" icon @click.stop="drawer = !drawer">
        <v-icon :size="$vuetify.breakpoint.width < 991 ? 60 : 36">mdi-chevron-left</v-icon>
      </button>
      <v-list class="nav-list">
        <nuxt-link class="nav-list-item" exact v-for="(item, i) in filteredNavItems" :key="i" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <div class="nav-list-item__content">
            <p class="nav-list-item__title">{{item.title}}</p>
          </div>
        </nuxt-link>
      </v-list>
      <v-list v-show="isLoggedIn && getUser.role === 'admin'">
        <v-list-item router exact to="/profile/create">
          <v-list-item-content>
            Create Employee
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="true" fixed app extension-height="60" height="80" class="header-navigation">
      <button type="button" aria-label="Toggle navigation" @click.stop="drawer = !drawer" class="button__icon button__icon--nav">
        <span>
          <i class="button__icon-content button__icon-content--top"></i>
          <i class="button__icon-content button__icon-content--middle"></i>
          <i class="button__icon-content button__icon-content--bottom"></i>
        </span>
      </button>

      <nuxt-link class="v-toolbar__title" to="/">{{title}}</nuxt-link>
      <ul class="menu-items" v-if="!isMobile">
        <li class="menu-items__item">
          <a @click="signOut">{{isLoggedIn ? "Logout" : "Login"}}</a>
        </li>
        <span>{{getUser ? getUser.name : null}}</span>
        <li class="menu-items__item" v-if="user">
          <nuxt-link to="/profile">Saved forms</nuxt-link>
        </li>
        <li class="menu-items__item" v-if="user && $store.state.user.role === 'admin'">
          <nuxt-link to="/completed-jobs">Certificates of completion</nuxt-link>
        </li>
        <li class="menu-items__item" v-if="user && $store.state.user.role === 'admin'">
          <nuxt-link to="/saved-aob-contracts">AOB & Mitigation Contracts</nuxt-link>
        </li>
      </ul>
      <template v-slot:extension v-if="isMobile">
        <ul class="menu-items__extended-menu menu-items">
          <li class="menu-items__item">
            <a @click="signOut">{{$fire.auth.currentUser !== null ? "Logout" : "Login"}}</a>
          </li>
          <span>{{getUser ? getUser.name : null}}</span>
          <li class="menu-items__item" v-if="user">
            <nuxt-link to="/profile">Saved forms</nuxt-link>
          </li>
          <li class="menu-items__item" v-if="user && $store.state.user.role === 'admin'">
            <nuxt-link to="/completed-jobs">Certificates of completion</nuxt-link>
          </li>
          <li class="menu-items__item" v-if="user && $store.state.user.role === 'admin'">
            <nuxt-link to="/saved-aob-contracts">AOB & Mitigation Contracts</nuxt-link>
          </li>
        </ul>
      </template>
    </v-app-bar>
    <v-main :class="matchUrl !== null ? 'reports-page' : ''">
      <span v-if="!user"><LazyFormsLogin /></span>
      <nuxt class="mx-auto" v-else />
    </v-main>
    <v-footer :fixed="fixed" app>
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
          to: '/forms/dispatch-report',
          access: 'user'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Rapid Response Report',
          to: '/forms/rapid-response-form',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Daily Containment Case File Report',
          to: '/forms/daily-containment-report',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Daily Technician Case File Report',
          to: '/forms/daily-technician-report',
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
          to: '/forms/atmospheric-readings',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Moisture Readings',
          to: '/forms/moisture-readings',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Unit Quantity and Equipment Inventory',
          to: '/forms/inventory-log',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Psychrometric Chart',
          to: '/forms/psychrometric-charting',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'AOB & Mitigation Contract',
          to: '/forms/aob-contract-form',
          access: 'user'
        },
        {
          icon: 'mdi-form-select',
          title: 'Certificate of Completion',
          to: '/forms/certificate-of-completion',
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
          to: '/storage',
          access: 'admin'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Code Red Claims',
      user: false,
      filteredNavItems: [],
      isMobile: false
    }
  },
  computed: {  
    appTheme() {
      return this.$vuetify.theme.dark = true
    },
    matchUrl() {
      return this.$route.path.match(/^(?:^|\W)reports(?:$|\W)(?:\/(?=$))?/gm)
    },
    ...mapGetters(["getUser", "isLoggedIn"]),
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
    itemsArr() {
      if (this.$fire.auth.currentUser) {
        const filtered = (role) => this.items.filter((v) => {
          return v.access === role
        })
        switch (this.getUser.role) {
          case "user":
            this.filteredNavItems = filtered("user")
            break;
          case "admin":
            this.filteredNavItems = this.items
        }
      }
    },
    async signOut() {
      this.$store.dispatch("signout")
    },
    onResize() {
      setTimeout(() => {
        this.isMobile = window.innerWidth < 1200
      }, 100)     
    }
  },
  mounted() {
    this.onResize()
    this.fetchLogs(this.$fire.auth.currentUser)
    window.addEventListener('resize', this.onResize, { passive: true })
    this.$nextTick(() => {
      this.itemsArr()
      this.user = this.$fire.auth.currentUser ? true : false
      this.fetchReports(this.$fire.auth.currentUser)
      
    })
  },
  beforeDestroy() {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  }
}
</script>
<style lang="scss">
.reports-page {
  background-color:$color-white;
  color:$color-black;
}
</style>