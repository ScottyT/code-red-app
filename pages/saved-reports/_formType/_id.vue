<template>
    <div class="pa-6 report-details-wrapper">
        <LazyLogsPdf :formType="formType" :formName="formName" :report="report" company="Water Emergency Services Incorporated" />
        <v-btn class="button--normal" @click="deleteReport(report)">Submit Report</v-btn>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
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
    },
    methods: {
        ...mapActions({
            deleteReport: 'deleteSavedReport'
        })
    }
}
</script>