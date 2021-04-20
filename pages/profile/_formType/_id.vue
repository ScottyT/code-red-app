<template>
    <div class="pa-6 report-details-wrapper">
        <LazySavedLogReports :formType="formType" :formName="formName" :report="reports[0]" :shadowArr="clonedreports[0]"  />
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
export default {
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
            return {
                formName,
                formType
            }
        } catch(e) {
            console.error(e)
        }
    },
    data() {
        return {
            reports: [],
            clonedreports: []
        }
    },
    computed: {
        ...mapGetters({
            getSavedReports: 'indexDb/getSavedReports'
        }),
        savedReport() {
            return this.getSavedReports.filter((v) => {
                return v.logType === this.$route.params.formType && v.JobId === this.$route.params.id
            })
        },
        clonedReport() {
            return JSON.parse(JSON.stringify(this.savedReport))
        }
    },
    methods: {
        ...mapActions({
            checkStorage: 'indexDb/checkStorage'
        })
    },
    mounted() {
        this.checkStorage()
    },
    created() {
        this.reports = this.getSavedReports
        this.clonedreports = JSON.parse(JSON.stringify(this.getSavedReports))
    }
}
</script>