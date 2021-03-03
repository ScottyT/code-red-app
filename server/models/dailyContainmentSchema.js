const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const dailyContainmentReport = mongoose.Schema({
    JobId: String,
    id: String,
    date: String,
    location: Map,
    selectedTmpRepairs: Array,
    selectedContent: Array,
    selectedStructualCleaning: Array,
    selectedStructualDrying: Array,
    selectedCleaningSection: Array,
    evaluationLogs: Array,
    verifySign: String
})
module.exports = mongoose.model('DailyContainment', dailyContainmentReport, 'daily-containment-report')