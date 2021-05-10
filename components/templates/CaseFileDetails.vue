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
        <div class="report-details__section--case-file">
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
                    <li v-for="(item, i) in groupBy(report.selectedContent, 'group')" :key="`content-${i}`">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="(subitem, i) in item" :key="`contentoff-${i}`">
                                {{subitem.label}}
                                
                            </li>
                        </ul>
                    </li>                   
                </ul>               
            </div>
            <div class="report-details__data" v-if="report && report.selectedStructualDrying.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.selectedStructualDrying, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.selectedStructualCleaning.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.selectedStructualCleaning, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.contentCleaningInspection.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.contentCleaningInspection, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.waterRestorationInspection.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.waterRestorationInspection, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.waterRemediationAssesment.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.waterRemediationAssesment, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.overviewScopeOfWork.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.overviewScopeOfWork, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.specializedExpert.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.specializedExpert, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.scopeOfWork.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.scopeOfWork, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="report-details__data" v-if="report && report.projectWorkPlans.length > 0">
                <ul>
                    <li v-for="(item, i) in groupBy(report.projectWorkPlans, 'group')" :key="i">
                        <h3>{{i}}</h3>
                        <ul>
                            <li v-for="subitem in item" :key="subitem.label">
                                {{subitem.label}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="report-details__section--block">
            <h3>Notes</h3>
            <span>{{report.notes}}</span>
        </div>
        <div class="report-details__section">
            <div class="report-details__checklist">
                <h3>Evaluation Logs</h3>
                <ul>
                    <li v-for="(evalLog, i) in report.evaluationLogs" :key="`eval-${i}`">
                        <label class="form__label">{{ evalLog && evalLog.label ? evalLog.label : null}}</label>
                        <span>{{ evalLog && evalLog.value ? evalLog.value : null}}</span>
                    </li>
                </ul>
            </div>
            <div class="report-details__data">
                <h2>Customer Signiture:</h2>
                    <div v-if="signiture !== ''">
                    <div class="report-details__data--cusSig" :style="'background-image:url('+signiture+')'"></div>
                </div>
            </div>
            <div class="report-details__data">
                <h3>Work completed after hours:</h3>
                <span>{{report.afterHoursWork}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "CaseFileDetails",
    props: ['report', 'notPdf'],
    computed: {
        signiture() {
            var sig = this.report && this.report.verifySign ? this.report.verifySign : null;
            if (sig !== null) {
                return this.report.verifySign
            }
            return ""
      },
    },
    methods: {
        groupBy(list, keyGetter) {
            return list.reduce((storage, item) => {
                (storage[item[keyGetter]] = storage[item[keyGetter]] || []).push(item);
                return storage;
            }, {});
        },
        filteringArrays(arr, groupFilter) {
            return arr.filter(item => {
                return item.group === groupFilter
            })
        }
    }
}
</script>