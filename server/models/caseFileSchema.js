const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const caseFileReport = mongoose.Schema({
    JobId: String,
    id: String,
    date: String,
    location: Map,
    ReportType: String,
    CaseFileType: String,
    selectedTmpRepairs: Array,
    selectedContent: Array,
    selectedStructualCleaning: Array,
    selectedStructualDrying: Array,
    selectedCleaningSection: Array,
    contentCleaningInspection: Array,
    waterRestorationInspection: Array,
    waterRemediationAssesment: Array,
    overviewScopeOfWork: Array,
    specializedExpert: Array,
    scopeOfWork: Array,
    projectWorkPlans: Array,
    notes: String,
    teamMember: Object,
    afterHoursWork: String,
    evaluationLogs: Array,
    verifySign: String
})
caseFileReport.plugin(timestamps)
module.exports = mongoose.model('CaseFileReports', caseFileReport, 'case-file-report')