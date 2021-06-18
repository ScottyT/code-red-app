<template>
  <div class="block-group__content">
    <UiAutocomplete :items="reports" @sendReportsToParent="reportsFetched" :theme="pagetheme" />
    <div class="block-group--grid">
      <div class="reports-wrapper__data block-group__col" v-for="(item, i) in reportslist" :key="`item-${i}`">
        <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.JobId}`">
          <p>{{item.JobId}}</p>
          <p v-show="item.formType !== ''">{{item.formType}}</p>
          <p>{{item.ReportType}}</p>
        </nuxt-link>
      </div>
      <p v-if="reportslist === undefined">No reports to show</p>
    </div>
  </div>
</template>
<script>
import { defineComponent, toRefs, ref, watch, onMounted, computed } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    reports: {
      type: Array
    },
    theme: {
      type: String
    }
  },
  setup(props, context) {
    const { reports, theme } = toRefs(props)
    const reportslist = ref([])
    const items = ref([])
    const reportsFetched = (data) => {
      console.log(data)
      reportslist.value = data.value
    }
    watch(items, (val) => {
      reportslist.value = val
    })
    const initData = () => {
      if (reports.value.length > 0) {
        reportslist.value = reports.value
      }
    }
    onMounted(initData)
    return {
      reportslist,
      pagetheme: theme.value,
      reportsFetched,
      initData,
      items
    }
  }
})
/* export default {
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
} */
</script>