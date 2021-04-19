<template>
  <div class="block-group">
    <LazyAutocomplete :items="reports" @sendReportsToParent="reportsFetched" :theme="theme" />
    <div class="block-group--grid">
      <div class="reports-wrapper__data block-group__col" v-for="(item, i) in fetchreports" :key="`item-${i}`">
        <nuxt-link :to="`/saved-reports/${item.formType}/${item.JobId}`">
          <p>{{item.JobId}}</p>
          <p>{{item.formType}}</p>
          <p>{{item.ReportType}}</p>
        </nuxt-link>
      </div>
      <p v-if="fetchreports.length === 0">No reports to show</p>
    </div>
  </div>
</template>
<script>
export default {
    name: "Reports",
    props: ['reports', 'theme'],
    data() {
        return {
            fetchreports: []
        }
    },
    methods: {
        reportsFetched(reports) {
            this.fetchreports = reports
        }
    },
    created() {
        this.fetchreports = this.reports
    }
}
</script>