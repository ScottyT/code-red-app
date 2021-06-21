<template>
    <p v-if="$fetchState.pending">Fetching content...</p>
    <span v-else><div class="pa-6 report-details-wrapper" v-if="report.error">
        <LazySavedLogReports :formName="formName" :reportType="reportType" :company="companyName" />
    </div>
    <div class="pa-6 report-details-wrapper" v-else-if="!Object.keys(report).error">
        <LazySavedLogReports :company="companyName" :reportType="reportType" :formName="formName" :report="report" />
    </div>   
    <div class="pa-6 report-details-wrapper" v-else>
        <LazySavedLogReports :formName="formName" :reportType="reportType" :company="companyName" :report="savedreports" />
    </div></span>
</template>
<script>
import { computed, defineComponent, ref, useStore } from '@nuxtjs/composition-api';
import useReports from '@/composable/reports';
export default defineComponent({
    setup(props, {root}) {
        const store = useStore()
        let authUser = root.$fire.auth.currentUser
        const formName = ref(""); const company = ref(""); const offlinereport = ref({});
        const reps = computed(() =>store.getters['indexDb/getSavedReports'])
        const savedreports = computed(() => {           
            return reps.value.find(
                report => report.ReportType === root.$route.params.reportType && report.JobId === root.$route.params.id
            )
        })
        let reportType = root.$route.params.reportType
        let jobId = root.$route.params.id
        const { report, getReport } = useReports()
        switch (reportType) {
            case "atmospheric-readings":
                formName.value = "Atmospheric Readings"
                break;
            case "quantity-inventory-logs":
                formName.value = "Unit Quantity and Equipment Inventory"
                break;
            case "moisture-map":
                formName.value = "Moisture Readings Map Readings"
                    break;
            default:
                formName.value = "Sketch Form"
        }
        if (root.$nuxt.isOnline) {
            getReport(`${reportType}/${jobId}`, authUser).fetch
        }
        if (report.error !== '') {
            report.value = savedreports.value
        }
        
        return { formName, companyName: company.value, jobId, report, offlinereport, savedreports, reportType }
    }
})
</script>