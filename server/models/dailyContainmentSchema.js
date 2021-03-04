const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const caseFileReport = mongoose.Schema({
    JobId: String,
    id: String,
    date: String,
    location: Map,
    ReportType: String,
    selectedTmpRepairs: Array,
    selectedContent: Array,
    selectedStructualCleaning: Array,
    selectedStructualDrying: Array,
    selectedCleaningSection: Array,
    contentCleaningInspection: Array,
    waterRestorationInspection: Array,
    evaluationLogs: Array,
    verifySign: String
})
module.exports = mongoose.model('CaseFileReports', caseFileReport, 'case-file-report')