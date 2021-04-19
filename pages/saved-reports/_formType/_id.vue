<template>
    <div class="pa-6 report-details-wrapper">
        <!-- <LazyLogsPdf :formType="formType" :formName="formName" :report="report" company="Water Emergency Services Incorporated" /> -->
        <LazySavedLogReports :formType="formType" :formName="formName" :report="finalArr" :shadowArr="cloneArr" company="Water Emergency Services Incorporated" />
        <!-- <v-btn class="button--normal" @click="deleteReport(report)">Submit Report</v-btn> -->
    </div>
</template>
<script>
import {mapActions} from 'vuex';
export default {
    name: "updateform",
    async middleware({$fire, redirect}) {
        if ($fire.auth.currentUser == null) {
            return redirect("/")
        }
    },
    async asyncData({$axios, params, store}) {
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
            let user = await $axios.$get(`/api/employee/${store.state.user.email}`);
            let savedReport = user.savedreports.filter((v) => {
                return v.formType === params.formType && v.JobId === params.id
            })
            let finalArr = {...savedReport[0]}
            let cloneArr = JSON.parse(JSON.stringify(finalArr))
            return {
                finalArr,
                cloneArr,
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