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
    evaluationLogs: Array,
    documentVerification: Array,
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
    sourceWaterIntrusion: Array,
    cusFirstName: String,
    cusLastName: String,
    customerSig: String,
    cusSignDate: String,
    moistureMap: String,
    id: {
        type: String,
        required: [true, 'Team lead id is required']
    },
    location: Map,
    signDate: String,
    teamMember: Map,
    intrusion: Array,
    dateIntrusion: String,
    timeIntrusion: String,
    preliminaryDetermination: Array,
    moistureInspection: Array,
    preRestorationEval: Object,
    teamMemberSig: String,
    initial1: String,
    initial2: String,
    initial3: String,
    initial4: String
})
responseReport.plugin(timestamps);
module.exports = mongoose.model('RapidResponse', responseReport, 'reports');