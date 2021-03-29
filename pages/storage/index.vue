<template>
  <div class="storage-page">
    <login-form v-if="!authUser" />
    <reports-list :reportslist="reports" :sortoptions="sortOptions" page="storagePage" />
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    head() {
      return {
        title: "Storage"
      }
    },
    layout: 'dashboard-layout',
    data: () => ({
      authUser: false,
      sortOptions: [{
          value: 'JobId',
          text: 'Report Id'
        },
        {
          value: 'teamMember',
          text: 'Employee'
        }
      ],
      reports: []
    }),
    async middleware({
      store,
      redirect,
      route
    }) {
      if (store.state.user.role !== "admin") {    
        return redirect("/")
      }
    },
    async asyncData({ $axios }) {
      try {
        let data = await $axios.$get("/api/reports");
        let dataFilters = data.filter((v) => {
          return v.ReportType !== 'credit-card'
        })
        return { reports: dataFilters }
      } catch (e) {
        console.error("SOMETHING WENT WRONG: " + e)
      }
    },
    computed: {
      ...mapGetters(["getReports", "isLoggedIn"]),
      filteredRep() {
        return this.getReports.filter((report) => {
          return report.ReportType == "rapid-response"
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.authUser = this.$fire.auth.currentUser ? true : false
      })
    }
  }
</script>
<style lang="scss">
  .storage-page {
    padding: 45px 4vw;
  }
</style>