<template>
    <p v-if="$fetchState.pending">Fetching content...</p>
    <span v-else><div class="pa-6 report-details-wrapper" v-if="$nuxt.isOnline">
        <LazySavedLogReports :company="companyName" :reportType="reportType" :formName="formName" :report="logreport" />
    </div>
    <div class="pa-6 report-details-wrapper" v-else>
        <LazySavedLogReports :formName="formName" :reportType="reportType" :company="companyName" :report="offlinereport" />
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
        const savedreports = computed(() => {
            let reps = store.getters['indexDb/getSavedReports']
            return offlinereport.value = reps.find((v) => { 
                v.ReportType === root.$route.params.reportType && v.JobId === root.$route.params.id
            })
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
        
        return { formName, companyName: company.value, jobId, logreport: report, offlinereport: savedreports, reportType }
    }
})
/* export default {
    head() {
        return {
            title: ``
        }
    },
    async fetch() {

    },
    async asyncData({$axios, params, store, $fire}) {
        try {
            var formName = ""
            let reportType = params.reportType;
            let logreports = {}
            await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
                $axios.$get(`/api/report/${params.reportType}/${params.id}`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    logreports = res
                    if (logreports.hasOwnProperty('error')) {
                        logreports = store.state.indexDb.reports.find((v) => {
                            return v.JobId === params.id && v.ReportType === params.reportType
                        })
                    }
                    switch (reportType) {
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
                        reportType,
                        logreport: logreports
                    }
                }).catch((err) => {
                    console.log(err)
                })
                
            })
            
            //let logreports = await $axios.$get(`/api/report/${params.reportType}/${params.id}`);
            
            
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
            company: "",
            formName: "",
            reportType: ""
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
                return v.ReportType === this.$route.params.reportType && v.JobId === this.$route.params.id
            })
            this.report = saved
        }
    },
    mounted() {
        this.checkStorage()
        this.offlinereport()
    }
} */
</script>