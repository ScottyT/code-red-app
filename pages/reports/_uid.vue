<template>
    <div class="report-details mt-4">
        <h1>Job</h1>
        <div class="accordion box" role="presentation">
            <div class="accordion-item" v-for="(cat, i) in reportTypes" :key="`cat-${i}`" v-show="filteringReports(reports, cat).length > 0">               
                <lazy-accordion-item :item="report" :titleIsArray="true" v-for="(report, i) in filteringReports(reports, cat)" :key="`report-${i}`">
                    <template v-slot:category>
                        <button @click="report.active = !report.active" class="accordion__item--trigger">               
                            <h2 class="accordion__title--text">{{prettyHeadings(cat)}}</h2>
                            <span class="accordion__item--trigger-icon"></span>
                        </button>
                    </template>
                    <template v-slot:details>
                        <lazy-report-details :report="report" v-if="cat === 'dispatch'" />
                        <lazy-case-file-details :report="report" v-if="cat === 'case-file'" />
                    </template>
                </lazy-accordion-item>
            </div>
        </div>
        <!-- <div v-for="(cat, i) in reportTypes" :key="`cat-${i}`" v-show="filteringReports(reports, cat).length > 0">
            <lazy-base-accordion :content="filteringReports(reports, cat)" :arraytitles="reportTypes" />
            
            <div v-for="(report, i) in filteringReports(reports, cat)" :key="`report-${i}`">
                <div class="report-details__tabs">
                    {{report.JobId}}
                    {{report.active}}
                    <transition name="accordion-item" @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition" @after-leave="endTransition">
                        <div class="accordion-item__details" v-if="report.active">
                            <lazy-report-details :report="report" v-if="cat === 'dispatch'" />
                            <lazy-case-file-details :report="report" v-if="cat === 'case-file'" />
                        </div>
                    </transition>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
export default {
    data() {
        return {
            dispatchArr: [],
            rapidArr: [],
            reports: [],
            reportId: ""
        }
    },
    computed: {
        ...mapGetters({
            getReports: 'getReports'
        }),
        
        uniqueReports() {
            return [...new Set(this.getReports.map(v => v.JobId))]
        },
        reportTypes() {
            return [...new Set(this.getReports.map(v => v.ReportType))]
        }
    },
    async asyncData({$axios, params}) {
        try {
            const reportType = params.slug
            const repId = params.uid
            let data = await $axios.$get("/api/reports")
            return { reports: data, reportId: repId }
        } catch (e) {
            console.log('SOMETHING HAPPENED: '+ e)
        }
    },
    methods: {
        toggle(event) {
            this.item.active = !this.item.active
        },
        filteringReports(array, repType) {
            return array.filter(o => {
                o.active = false;
                return o.ReportType === repType && o.JobId === this.reportId
            })
        },
        prettyHeadings(type) {
            var output = "";
            switch (type) {
                case "dispatch":
                    output = "Dispatch"
                    break;
                case "rapid-response":
                    output = "Rapid Response"
                    break;
                case "case-file":
                    output = "Case File"
                    break;
                case "coc":
                    output = "Certificate of Completion"
                    break;
                case "aob":
                    output = "AOB & Mitigation Contract"
                    break;
                case "credit-card":
                    output = "Card"
                    break;
                default:
                    output = type
            }
            return output
        }
    },
    created() {
        
    }
}
</script>