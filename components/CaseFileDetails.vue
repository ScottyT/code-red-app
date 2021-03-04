<template>
    <div class="report-details">
        <div class="report-details__section">
            <div class="report-details__data">
                <h2>Job ID:</h2>
                <span>{{report.JobId}}</span>
            </div>
            <div class="report-details__data">
                <h2>Team Lead ID #:</h2>
                <span>{{report.id}}</span>
            </div>
            <div class="report-details__data">
                <h2>Date:</h2>
                <span>{{report.date}}</span>
            </div>
            <div class="report-details__data">
                <h2>Address:</h2>
                <span class="report-details__data-field">{{report.location.address}}</span>
            </div>
            <div class="report-details__data">
                <h2>City, State, Zip:</h2>
                <span class="report-details__data-field">{{report.location.cityStateZip}}</span>
            </div>
        </div>
        <div class="report-details__section">
            <div class="report-details__data" v-if="report && report.contentCleaningInspection.length > 0">
                <!-- content cleaning section -->
                <h2>{{report.contentCleaningInspection[0].group}}</h2>
                <ul>                   
                    <li v-for="(item, i) in report.contentCleaningInspection" :key="`cleaning-${i}`">
                        {{item.label}}
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.selectedTmpRepairs.length > 0">
                <!-- tmp repairs -->
                <h2>TMP Repairs</h2>
                <ul>
                    <li v-for="(item, i) in report.selectedTmpRepairs" :key="`tmp-repairs-${i}`">
                        {{item}}
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.selectedContent.length > 0">
                <ul>
                    <li v-for="(item, i) in filteringArrays(report.selectedContent, 'Content - (On-site)')" :key="`content-${i}`">
                        <h3>{{item.group}}</h3>
                        <ul>
                            <li v-for="subitem in filteringArrays(report.selectedContent, 'Content - (On-site)')" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                    <li v-for="(item, i) in filteringArrays(report.selectedContent, 'Content - (Off-site)')" :key="`contentoff-${i}`">
                        <h3>{{item.group}}</h3>
                        <ul>
                            <li v-for="subitem in filteringArrays(report.selectedContent, 'Content - (Off-site)')" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.selectedStructualDrying.length > 0">
                
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "CaseFileDetails",
    props: ['report'],
    /* computed: {
        contentOnSite() {
            filteringArrays(this.report.selectedContent, 'Content - (On-site)')
        }
    }, */
   /*  mounted() {
        function filteringArray(arr, groupFilter) {
            return arr.filter(item => {
                return item.group === groupFilter
            })
        }
    }, */
    methods: {
        filteringArrays(arr, groupFilter) {
            return arr.filter(item => {
                return item.group === groupFilter
            })
        }
    }
}
</script>