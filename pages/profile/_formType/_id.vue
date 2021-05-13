<template>
    <div class="pa-6 report-details-wrapper" v-if="$nuxt.isOnline">
        <LazySavedLogReports :formName="formName" :formType="formType" :company="company" :report="logreport" />
    </div>
    <div class="pa-6 report-details-wrapper" v-else>
        <LazySavedLogReports :formName="formName" :formType="formType" :company="company" :report="report" />
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
export default {
    async asyncData({$axios, params, store}) {
        try {
            var formName = ""
            let formType = params.formType;
            let logreports = await $axios.$get(`/api/logs-report/${formType}/${params.id}`);
            if (logreports.hasOwnProperty('status')) {
                logreports = store.state.indexDb.reports.find((v) => {
                    return v.JobId === params.id && v.formType === params.formType
                })
            }
            switch (formType) {
                case "atmospheric-readings":
                    formName = "Atmospheric Readings"
                    break;
                case "quantity-inventory-logs":
                    formName = "Unit Quantity and Equipment Inventory"
                    break;
                case "moisture-map":
                    formName = "Moisture Readings Map Readings"
                    break;
                default:
                    formName = "Sketch Form"
            }
            return {
                formName,
                formType,
                logreport: logreports
            }
        } catch(e) {
            console.error(e)
        }
    },
    data() {
        return {
            reports: [],
            clonedreports: [],
            report: {},
            logreport: {},
            company: "Water Emergency Services Incorporated"
        }
    },
    computed: {
        ...mapGetters({
            getSavedReports: 'indexDb/getSavedReports',
        }),
        isOnline() {
            return this.$nuxt.isOnline
        }
    },
    methods: {
        ...mapActions({
            checkStorage: 'indexDb/checkStorage'
        }),
        offlinereport() {
            var saved = this.getSavedReports.find((v) => {
                return v.formType === this.$route.params.formType && v.JobId === this.$route.params.id
            })
            this.report = saved
        }
    },
    mounted() {
        this.checkStorage()
        this.offlinereport()
    }
}
</script>