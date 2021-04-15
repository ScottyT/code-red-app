<template>
    <div class="pa-6 report-details-wrapper">
        <span v-if="report.formType === 'atmospheric-readings'">
            <LazyLogsPdf :formType="formType" :formName="formName" :report="report" company="Water Emergency Services Incorporated" />
        </span>
    </div>
</template>
<script>
export default {
    name: "updateform",
    async asyncData({$axios, params}) {
        try {
            var formName = ""
            let formType = params.formType;
            switch (formType) {
                case "atmospheric-readings":
                    formName = "Atmospheric Readings"
                    break;
                case "quantity-inventory-logs":
                    formName = "Unit Quantity and Equipment Inventory"
                    break;
                default:
                    formName = "Sketch Form"
            }
            let report = await $axios.$get(`/api/logs-report/${params.formType}/${params.id}`);
            return {
                report,
                formName,
                formType
            }
        } catch (e) {
            console.error(e)
        }
    }
}
</script>