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
      <p v-if="reportslist.length <= 0">No reports to show</p>
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
</script>