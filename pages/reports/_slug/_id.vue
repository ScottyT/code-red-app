<template>
  <div class="reports-detail-wrapper">
    <h1>Report details</h1>

    <response-report-details :report="report"
      v-if="reportType == 'rapid-response'"
    />
    <report-details :report="report" v-else />
  </div>
</template>
<script>
export default {
  data() {
    return {
      report: {},
      loading: true,
    }
  },
  layout: "dashboard-layout",
  head() {
    return {
      title: "Report " + this.repId
    }
  },
  /* async middleware({ store, redirect, route }) {
    if (store.state.user.role !== "admin") {    
      return redirect("/")
    }
  }, */
  async asyncData({ $prismic, params, $axios }) {
    try {
      const reportType = params.slug
      const repId = params.id
      let data = await $axios.$get(`/api/reports/${reportType}/${repId}`)
      return { report: data, reportType }
    } catch (e) {
      console.error("SOMETHING WENT WRONG: " + e)
    }
  },
  methods: {
    
  }
}
</script>