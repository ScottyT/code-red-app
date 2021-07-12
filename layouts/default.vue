<template>
  <v-app :dark="appTheme">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" clipped open app :width="$vuetify.breakpoint.width < 768 ? 300 : 400">
      <button v-if="$vuetify.breakpoint.width < 1200" type="button" class="button__icon" icon @click.stop="drawer = !drawer">
        <v-icon :size="$vuetify.breakpoint.width < 991 ? 60 : 36">mdi-chevron-left</v-icon>
      </button>
      <v-list class="nav-list">
        <span v-if="isLoading"><v-skeleton-loader type="list-item" height="50px" width="200" v-for="(item, i) in items" :key="`item-${i}`"></v-skeleton-loader></span>
        <nuxt-link class="nav-list-item" exact v-for="(item, i) in filteredNavItems" :key="i" :to="item.to" v-else>
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
      <div class="d-flex align-center">
        <button type="button" aria-label="Toggle navigation" @click.stop="drawer = !drawer" class="button__icon button__icon--nav">
          <span>
            <i class="button__icon-content button__icon-content--top"></i>
            <i class="button__icon-content button__icon-content--middle"></i>
            <i class="button__icon-content button__icon-content--bottom"></i>
          </span>
        </button>

        <nuxt-link class="v-toolbar__title ml-4" to="/">{{title}}</nuxt-link>
      </div>
      <span v-if="isLoading" class="d-flex flex-row">
        <v-skeleton-loader type="list-item-avatar-two-line" width="300px"></v-skeleton-loader>
      </span>

      <UiProfileDropdown v-else />
      <!-- <ul class="menu-items" v-if="!isMobile">
        
      </ul> -->
    </v-app-bar>
    <v-main :class="matchUrl !== null ? 'reports-page' : ''">
      <span v-if="!user"><LazyFormsLogin /></span>
      <nuxt class="px-5 mx-auto" v-else />
      <v-footer :fixed="fixed" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-main>
    
  </v-app>
</template>

<script>
import { computed, defineComponent, reactive, ref, useStore, watch, onMounted, useFetch, useContext } from '@nuxtjs/composition-api'
import useReports from "@/composable/reports"
export default defineComponent({
  setup(props, context) {
    const { $fire } = useContext()
    let authUser = context.root.$fire.auth.currentUser
    const store = useStore()
    const fetchReports = (user) => { store.dispatch("reports/fetchUserReports", user) }
    const items = ref([
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
          title: 'Psychrometric Chart',
          to: '/forms/psychrometric-charting',
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
    ]);
    const clipped = ref(true); 
    const drawer = ref(false); 
    const fixed = ref(false); 
    const miniVariant = ref(false);
    const right = ref(true); 
    const rightDrawer = ref(false); 
    const title = ref("Code Red Claims"); 
    const user = ref(false);  
    const isMobile = ref(false);
    const filteredNavItems = ref([]);
    const reports = ref([])
    const appTheme = computed(() => context.root.$vuetify.theme.dark = true);
    const matchUrl = computed(() => context.root.$route.path.match(/^(?:^|\W)reports(?:$|\W)(?:\/(?=$))?/gm))
    const getUser = computed(() => store.getters['users/getUser'])
    const isLoggedIn = computed(() => store.getters['users/isLoggedIn'])
    const isOnline = computed(() => context.root.$nuxt.isOnline)
    const isLoading = computed(() => store.state.users.loading)
    //const isLoading = ref(true)

    const filtered = (role) => items.value.filter((v) => {
      return v.access === role
    })
    const itemsArr = () => {
      switch(getUser.value.role) {
        case "user":
          filteredNavItems.value = filtered("user")
          break;
        case "admin":
          filteredNavItems.value = items.value
      }
    }
    
    const userLoggedIn = () => {
      user.value = authUser ? true : false
    }
    
    onMounted(userLoggedIn)
    onMounted(itemsArr)
    fetchReports($fire.auth.currentUser)
    watch(() => getUser.value, (val) => {
      if (Object.keys(val).length !== 0) {
        itemsArr()        
      }
    })

    return { 
      items, clipped, drawer, fixed, miniVariant, right, rightDrawer, title, user: computed(() => user.value),
      filteredNavItems,
      appTheme,
      matchUrl,
      isLoggedIn,
      getUser,
      reports,
      isOnline,
      isLoading,
      fetchReports
    }
  }
})
</script>
<style lang="scss">
.reports-page {
  background-color:$color-white;
  color:$color-black;
}
</style>