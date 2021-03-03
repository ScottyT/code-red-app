<template>
  <div class="storage-page">
    <login-form v-if="!isLoggedIn" />
    <reports-list :reportslist="filteredRep" :sortoptions="sortOptions" page="storagePage" />
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
      sortOptions: [{
          value: 'JobId',
          text: 'Report Id'
        },
        {
          value: 'teamMember',
          text: 'Employee'
        }
      ]
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
    computed: {
      ...mapGetters(["getReports", "isLoggedIn"]),
      filteredRep() {
        return this.getReports.filter((report) => {
          return report.ReportType == "rapid-response"
        })
      }
    }
  }
</script>
<style lang="scss">
  .storage-page {
    padding: 45px 4vw;
  }
</style>