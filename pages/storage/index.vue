<template>
  <div class="storage-page">
    <button class="button--normal" type="button" @click="$fetch">Refresh</button>
    <p v-if="$fetchState.pending">Fetching reports...</p>
    <LayoutReportsList :reportslist="storage" :sortoptions="sortOptions" page="storagePage" v-else />
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
      reports: [],
      list: [],
      storage: []
    }),
    async asyncData({ $axios }) {
      /* var data = await $axios.$get("/api/reports");
        var dataFilters = data.filter((v) => {
          return v.ReportType !== 'credit-card'
        })
        return { reports: dataFilters } */
      /* try {
        var data = await $axios.$get("/api/reports");
        var dataFilters = data.filter((v) => {
          return v.ReportType !== 'credit-card'
        })
        return { reports: dataFilters }
      } catch (e) {
        console.error("SOMETHING WENT WRONG: " + e)
      } */
    },
    computed: {
      ...mapGetters(["getReports", "isLoggedIn"]),
      filteredRep() {
        return this.reports.filter((obj1) => {
          return !this.storage.some((obj2) => {
            return obj1.JobId === obj2
          })
        })
      }
    },
    methods: {
      storageItems() {
        var storageRef = this.$fire.storage.ref()
        storageRef.listAll().then((res) => {
          res.prefixes.forEach((folderRef) => {
            this.storage.push(folderRef.name)
          })
        })
        
      },
    },
    mounted() {
      this.storageItems()
    }
  }
</script>
<style lang="scss">
  .storage-page {
    padding: 45px 4vw;
  }
</style>