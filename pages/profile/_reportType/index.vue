<template>
    <div class="block-group">
        <h1>{{title}}</h1>
    </div>
</template>
<script>
import { computed, defineComponent, useContext, ref, onMounted, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
    setup(props, context) {
        const { $route } = useContext()
        const store = useStore();
        const title = ref('')
        const reports = ref([])
        const reportType = computed(() => context.root.$route.params.reportType)
        const savedReports = computed(() => store.getters['indexDb/getSavedReports'])
        /* const submittedLogs = computed(() => {
            return store.state.reports.logreports.filter(
                report => report.ReportType === reportType.value
            )
        }) */

        /* const logReports = computed(() => {
            var saved = savedReports.value.filter(
                report => report.ReportType === reportType.value
            )
            return saved.concat(submittedLogs.value)
        }) */
        const formattingTitle = () => {
            switch (reportType.value) {
                case "quantity-inventory-logs":
                    title.value = "Quantity Inventory Logs"
                    break;
                case "atmospheric-readings":
                    title.value = "Atmospheric Readings"
                    break;
                case "moisture-map":
                    title.value = "Moisture Map"
                    break;
                case "dispatch":
                    title.value = "Dispatch Reports"
                    break;
                case "rapid-response":
                    title.value = "Rapid Response Reports"
                    break;
                case "case-file-containment":
                    title.value = "Daily Containment Reports"
                    break;
                case "case-file-technician":
                    title.value = "Daily Technician Reports"
                    break;
                case "moisture-sketch":
                    title.value = "Moisture Mapping Location and Sketchs"
                    break;
                case "measurements-sketch":
                    title.value = "Measurements and Sketch"
                    break;
                case "equipment-location-sketch":
                    title.value = "Equipment Location and Sketch"
                    break;
                default:
                    title.value = "Reports"
            }
        }
        onMounted(formattingTitle)

        return {
            reportType,
            title,
            savedReports,
            reports
        }
    },
})
</script>
