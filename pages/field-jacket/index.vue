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
        this.reports = await this.$axios.$get("/api/reports");
        this.sketchReports = this.reports.filter((v) => {
            return v.ReportType === 'sketch-report'
        })
        this.logReports = this.reports.filter((v) => {
            return v.ReportType === 'logs-report'
        })
        this.chartData = this.reports.filter((v) => {
            return v.ReportType === 'chart-report'
        })
        this.defaultData = this.reports.filter((v) => {
            return v.ReportType === 'dispatch' || v.ReportType == 'rapid-response'
        })
        this.caseFileData = this.reports.filter((v) => {
            return v.CaseFileType == 'containment' || v.CaseFileType == 'technician'
        })
    },
    computed: {
        
    },
    methods: {
        ...mapActions({
            fetchReports: 'fetchReports'
        })
    }
}
</script>