<template>
  <div class="storage-page">
    <LayoutReportsList :reportslist="reports" :sortoptions="sortOptions" page="storagePage" />
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
    }
  }
</script>
<style lang="scss">
  .storage-page {
    padding: 45px 4vw;
  }
</style>