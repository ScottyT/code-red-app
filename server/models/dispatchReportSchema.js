const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');
const dispatchReport = mongoose.Schema({
    ArrivalContactName: String,
    JobId: {
        type: String,
        required: [true, 'Job id is required']
    },
    ReportType: {
        type: String,
        required: [true, 'Report type is required']
    },
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
    signDate: String
})
dispatchReport.plugin(timestamps)
module.exports = mongoose.model('Dispatch', dispatchReport, 'dispatch-reports')