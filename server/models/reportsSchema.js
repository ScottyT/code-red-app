const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const reports = mongoose.Schema({
    ArrivalContactName: String,
    JobId: {
        type: String,
        required: [true, 'Job id is required']
    },
    ReportType: {
        type: String,
        required: [true, 'Report type is required']
    },
    formType: String,
    appointmentDate: String,
    appointmentTime: String,
    callerName: String,
    dateFormatted: String,
    emailAddress: String,
    callTimeUpdate: String,
    id: String,
    location: Map,
    textTimeUpdate: String,
    phoneNumber: String,
    propertyChkList:Array,
    summary: String,
    teamMember: Map,
    timeFormatted: String,
    teamMemberSig: String,
    signDate: String,
    DateOfLoss: String,
    ClaimNumber: String,
    ContactName: String,
    DateOfEvaluation: String,
    EvaluationLogs: Array,
    documentVerification: Array,
    InsuranceCompany: String,
    PictureTypes: Array,
    PolicyNumber: String,
    adjusterName: String,
    adjusterEmail: String,
    adjusterPhone: String,
    PropertyOwner: String,
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
})