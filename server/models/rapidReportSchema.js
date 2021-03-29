const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp2');
const responseReport = mongoose.Schema({
    JobId: {
        type: String,
        required: [true, 'Job id is required']
    },
    DateOfLoss: String,
    ClaimNumber: String,
    ContactName: String,
    DateOfEvaluation: String,
    EmailAddress: String,
    EvaluationLogs: Array,
    InsuranceCompany: String,
    PhoneNumber: String,
    PictureTypes: Array,
    PolicyNumber: String,
    adjusterName: String,
    adjusterEmail: String,
    adjusterPhone: String,
    PropertyOwner: String,
    ReportType: String,
    Steps: Array,
    TypeOfLoss: Array,
    cusFirstName: String,
    cusLastName: String,
    customerSig: String,
    id: {
        type: String,
        required: [true, 'Team lead id is required']
    },
    location: Map,
    signDate: String,
    teamMember: Map,
    intrusion: Array,
    preliminaryDetermination: Array,
    moistureInspection: Array,
    preRestorationEval: Object
})
responseReport.plugin(timestamps);
module.exports = mongoose.model('RapidResponse', responseReport, 'rapid-response-reports');