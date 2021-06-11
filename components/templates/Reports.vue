<template>
  <div class="block-group__content">
    <UiAutocomplete :items="reports" @sendReportsToParent="reportsFetched" :theme="theme" />
    <div class="block-group--grid">
      <div class="reports-wrapper__data block-group__col" v-for="(item, i) in reportslist" :key="`item-${i}`">
        <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.JobId}`">
          <p>{{item.JobId}}</p>
          <p v-show="item.formType !== ''">{{item.formType}}</p>
          <p>{{item.ReportType}}</p>
        </nuxt-link>
      </div>
      <p v-if="reportslist.length === 0">No reports to show</p>
    </div>
  </div>
</template>
<script>
export default {
    name: "Reports",
    props: ['reports', 'theme'],
    data: () => ({
      reportslist: []
    }),
    methods: {
      routeSwitching(item) {
        var route = ""
        switch (item.ReportType) {
          case "case-file-report":
            route = "case-file-" + item.formType
            break;
          case "logs-report":
            route = "logs-report/"+item.formType
            break;
          case "sketch-report":
            route = "sketch-report/"+item.formType
            break;
          case "chart-report":
            route = "chart-report/"+item.formType
            break;
          default:
            route = item.ReportType
        }
        return route
      },
      reportsFetched(reports) {
        this.reportslist = reports.value
      }
    },
    
    created() {
      this.reportslist = this.reports
    }
}
</script>