<template>
    <div class="pa-6 reports-wrapper">
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Sketch Reports
            </h3>
            <LazyLayoutReports :reports="sketchReports" theme="light" />
        </div>
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Log Reports
            </h3>
            <LayoutReports :reports="logReports" theme="light" />
        </div>
        <div class="block-group">
            <h3 class="reports-wrapper__heading">Charts</h3>
            <LayoutReports :reports="chartData" theme="light" />
        </div>
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Dispatch and Rapid Response Reports
            </h3>
            <LayoutReports :reports="defaultData" theme="light" />
        </div>
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Daily Containment and Tech Reports
            </h3>
            <LayoutReports :reports="conTechData" theme="light" />
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
    data() {
        return {
            sketchReports:[],
            logReports:[],
            reports:[]
        }
    },
    async asyncData({$axios, store, params}) {
        try {
            let reports = await $axios.$get("/api/reports");
            let chartData = reports.filter((v) => {
                return v.ReportType === 'chart-report'
            })
            let sketchData = reports.filter((v) => {
                return v.ReportType === 'sketch-report'
            })
            let logsData = reports.filter((v) => {
                return v.ReportType === 'logs-report'
            })
            let defaultData = reports.filter((v) => {
                return v.ReportType == 'dispatch' || v.ReportType == 'rapid-response'
            })
            let conTechData = reports.filter((v) => {
                return v.CaseFileType == 'containment' || v.CaseFileType == 'technician'
            })
            
            return {
                sketchReports: sketchData,
                logReports: logsData,
                defaultData,
                conTechData,
                chartData
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    },
    methods: {
        ...mapActions({
            fetchReports: 'fetchReports'
        })
    }
}
</script>