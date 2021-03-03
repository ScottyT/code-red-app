const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp2');
const responseReport = mongoose.Schema({
    JobId: String,
    DateOfLoss: String,
    ClaimNumber: String,
    ContactName: String,
    DateOfEvaluation: String,
    EmailAddress: String,
    EvaluationLogs: Array,
    InsuranceCompany: String,
    PhoneNumber: String,
    Pictures: Array,
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
    id: String,
    location: Map,
    signDate: String,
    teamMember: Map,
    photoId: Array,
    jobFiles: Array,
    cardImages: Array,
    intrusion: Array,
    preliminaryDetermination: Array,
    moistureInspection: Array,
    preRestorationEval: Object
})
responseReport.plugin(timestamps);
module.exports = mongoose.model('RapidResponse', responseReport, 'rapid-response-reports');