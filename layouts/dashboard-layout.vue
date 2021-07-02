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
    <v-app-bar dark :clipped-left="true" fixed app extension-height="60" height="80" class="header-navigation">
      <div class="d-flex align-center">
        <button type="button" aria-label="Toggle navigation" @click.stop="drawer = !drawer" class="button__icon button__icon--nav">
          <span>
            <i class="button__icon-content button__icon-content--top"></i>
            <i class="button__icon-content button__icon-content--middle"></i>
            <i class="button__icon-content button__icon-content--bottom"></i>
          </span>
        </button>

        <nuxt-link class="v-toolbar__title" to="/">{{title}}</nuxt-link>
      <!-- <ul class="menu-items" v-if="!isMobile">
        
      </ul> -->
      </div>
      <UiProfileDropdown v-if="user" />
    </v-app-bar>
    <v-main>
      <span v-if="!user"><LazyFormsLogin /></span>
      <nuxt class="px-5 mx-auto mt-6 mb-6" v-else />
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
          title: 'AOB & Mitigation Contract',
          to: '/forms/aob-contract-form',
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
          title: 'Certificate of Completion',
          to: '/forms/certificate-of-completion',
          access: 'user'
        },
        {
          icon: 'mdi-clipboard',
          title: 'Field Jacket',
          to: '/field-jacket',
        },
        {
          icon: 'mdi-folder',
          title: 'Storage',
          to: '/storage',
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
      return this.$vuetify.theme.dark = false
    },
    matchUrl() {
      return this.$route.path.match(/^(?:^|\W)reports(?:$|\W)(?:\/(?=$))?/gm)
    },
    ...mapGetters({getUser:"users/getUser", getEmployees:"users/getEmployees", isLoggedIn:"users/isLoggedIn"}),
    isOnline() {
      return this.$nuxt.isOnline
    }
  },
  watch: {
    getUser(val) {
      if (Object.keys(val).length !== 0) {
        this.itemsArr()
      }
    }
  },
  methods: {
    ...mapActions({
      fetchReports: 'reports/fetchReports',
      fetchLogs: 'reports/fetchLogs'
    }),
    itemsArr() {
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
    },
    onResize() {
      setTimeout(() => {
        this.isMobile = window.innerWidth < 1200
      }, 100)     
    },
    async signOut() {
      this.$store.dispatch("users/signout")
    },
  },
  beforeDestroy() {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  mounted() { 
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
    
    this.$nextTick(() => {
      //this.fetchReports(this.$fire.auth.currentUser)
      this.itemsArr()
      this.user = this.$fire.auth.currentUser ? true : false
      
    })
  }
}
</script>