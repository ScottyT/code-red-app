<template>
    <div class="pa-6 reports-wrapper">
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Sketch Reports
            </h3>
            <LazyReports :reports="sketchReports" theme="light" />
            <!-- <div class="block-group--grid">
                <div class="reports-wrapper__data block-group__col" v-for="(item, i) in sketchReports" :key="`item-${i}`">
                    <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.formType}/${item.JobId}`">
                        <p>{{item.JobId}}</p>
                        <p>{{item.formType}}</p>
                    </nuxt-link>
                </div>
            </div> -->
        </div>
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Log Reports
            </h3>
            <LazyReports :reports="logReports" theme="light" />
            <!-- <div class="block-group--grid">
                <div class="reports-wrapper__data block-group__col" v-for="(item, i) in logReports" :key="`logs-${i}`">
                    <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.formType}/${item.JobId}`">
                        <p>{{item.JobId}}</p>
                        <p>{{item.formType}}</p>
                    </nuxt-link>
                </div>
            </div> -->
        </div>
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Dispatch and Rapid Response Reports
            </h3>
            <LazyReports :reports="defaultData" theme="light" />
            <!-- <div class="block-group--grid">
                <div class="reports-wrapper__data block-group__col" v-for="(item, i) in defaultData" :key="`logs-${i}`">
                    <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.JobId}`">
                        <p>{{item.JobId}}</p>
                        <p>{{item.ReportType}}</p>
                    </nuxt-link>
                </div>
            </div> -->
        </div>
        <div class="block-group">
            <h3 class="reports-wrapper__heading">
                Daily Containment and Tech Reports
            </h3>
            <LazyReports :reports="conTechData" theme="light" />
            <!-- <div class="block-group--grid">
                <div class="reports-wrapper__data block-group__col" v-for="(item, i) in conTechData" :key="`logs-${i}`">
                    <nuxt-link :to="`/field-jacket/${item.ReportType}-${item.CaseFileType}/${item.JobId}`">
                        <p>{{item.JobId}}</p>
                        <p>{{item.CaseFileType}}</p>
                    </nuxt-link>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
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
    computed: {
        isOnline() {
            return this.$nuxt.isOnline
        }
    },
    watch: {
        isOnline(val) {
            if (val) {
                this.fetchReports()
            }
        }
    },
    async middleware({store, redirect}) {
        if (store.state.user.role !== "admin") {
            return redirect("/")
        }
    },
    async asyncData({$axios, params}) {
        try {
            let reports = await $axios.$get("/api/reports");
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
            

            let data = sketchData.concat(logsData)
            return {
                sketchReports: sketchData,
                logReports: logsData,
                defaultData,
                conTechData
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