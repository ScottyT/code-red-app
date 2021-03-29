<template> 
  <div>
    <login-form v-if="!isLoggedIn" />
    <reports-dash v-else :reports="reports" :employees="empList" :shadowArr="reportsdata" />
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: "Reports",
  layout: "dashboard-layout",
  head() {
    return {
      title: "Reports Dashboard"
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    /* reportslist() {
      return reports.filter((v) => {
        return v.ReportType !== 'credit-card'
      })
    } */
  },
  async middleware({store, redirect}) {
    if (store.state.user.role !== "admin") {
      return redirect("/")
    }
  },
  async asyncData({ $axios }) {
    try {
      let data = await $axios.$get("/api/reports")
      let employees = await $axios.$get("/api/employees")
      let dataFilters = data.filter((v) => {
        return v.ReportType !== 'credit-card'
      })
      return {
        reports: dataFilters,
        empList: employees
      }
    } catch (e) {
      console.error("SOMETHING WENT WRONG: " + e)
    }
  },
  data() {
    return {
      loading:true,
      empList:[],
      reportsdata:[],
      //reportsList:[],
      //reports: []
    }
  }
}
</script>