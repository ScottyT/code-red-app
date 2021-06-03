<template>
    <p v-if="$fetchState.pending">Fetching reports...</p>
    <div class="pa-6 reports-wrapper" v-else>
        <button class="button--normal" type="button" @click="$fetch">Refresh</button>
        <div class="block-group" v-if="sketchReports.length > 0">
            <h3 class="reports-wrapper__heading">
                Sketch Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="sketchReports" theme="light" v-else />
        </div>
        <div class="block-group" v-if="logReports.length > 0">
            <h3 class="reports-wrapper__heading">
                Log Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="logReports" theme="light" v-else />
        </div>
        <div class="block-group" v-if="chartData.length > 0">
            <h3 class="reports-wrapper__heading">Charts</h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="chartData" theme="light" v-else />
        </div>
        <div class="block-group" v-if="defaultData.length > 0">
            <h3 class="reports-wrapper__heading">
                Dispatch and Rapid Response Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="defaultData" theme="light" v-else />
        </div>
        <div class="block-group" v-if="caseFileData.length > 0">
            <h3 class="reports-wrapper__heading">
                Daily Containment and Tech Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="caseFileData" theme="light" v-else />
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
export default {
    name: "FieldJacket",
    layout: "dashboard-layout",
    head() {
        return {
            title: "Field Jacket"
        }
    },
    data: () => ({
        sketchReports:[],
        logReports:[],
        chartData: [],
        defaultData: [],
        caseFileData: [],
        reports:[]
    }),
    async fetch() {
        if (this.$nuxt.isOnline) {
            await this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
                this.$axios.$get("/api/reports", {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    this.reports = res
                    this.sketchReports = this.reports.filter((v) => {
                        return v.formType === 'sketch-report'
                    })
                    this.logReports = this.reports.filter((v) => {
                        return v.formType === 'logs-report'
                    })
                    
                    this.chartData = this.reports.filter((v) => {
                        return v.formType === 'chart-report'
                    })
                    this.defaultData = this.reports.filter((v) => {
                        return v.ReportType === 'dispatch' || v.ReportType == 'rapid-response'
                    })
                    this.caseFileData = this.reports.filter((v) => {
                        return v.formType === "case-report"
                    })
                })
            }).catch((err) => {
                console.log(err)
            })
        } else {
            this.reports = this.getReports
            this.sketchReports = this.reports.filter((v) => {
                        return v.formType === 'sketch-report'
                    })
                    this.logReports = this.reports.filter((v) => {
                        return v.formType === 'logs-report'
                    })
                    
                    this.chartData = this.reports.filter((v) => {
                        return v.formType === 'chart-report'
                    })
                    this.defaultData = this.reports.filter((v) => {
                        return v.ReportType === 'dispatch' || v.ReportType == 'rapid-response'
                    })
                    this.caseFileData = this.reports.filter((v) => {
                        return v.formType === "case-report"
                    })
        }
    },
    computed: {
        ...mapGetters({getReports: 'reports/getReports'}),
        isOnline() {
            return this.$nuxt.isOnline
        }
    },
    watch: {
        isOnline(val) {
            if(val) {
                this.$fetch()
                //this.fetchReports(this.$fire.auth.currentUser)
            } else {
                this.reports = this.getReports
            }
        }
    },
    methods: {
        ...mapActions({
            fetchReports: 'reports/fetchReports',
            checkStorage: 'indexDb/checkStorage',
        })
    },
    mounted() {
        this.checkStorage()
    },
    /* created() {
        this.fetchReports(this.$fire.auth.currentUser)
    } */
}
</script>