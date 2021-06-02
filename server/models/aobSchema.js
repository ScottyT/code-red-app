const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');
const aobMitigationContract = mongoose.Schema({
    JobId: {
        type: String,
        required: true
    },
    ReportType: String,
    subjectProperty: String,
    cusSign: String,
    cusSignDate: String,
    initial1: String,
    initial2: String,
    initial3: String,
    initial4: String,
    initial5: String,
    initial6: String,
    initial7: String,
    initial8: String,
    insuredTermEndDate: String,
    insuredPay1: String,
    insuredPayDay1: String,
    insuredPay2: String,
    insuredPayDay5: String,
    nonInsuredTermEndDate: String,
    nonInsuredDay1: String,
    nonInsuredDay5: String,
    location: Map,
    firstName: String,
    lastName: String,
    driversLicense: String,
    relation: String,
    minimumSqft: String,
    representativePrint: String,
    repSignature: String,
    propertyRepOf: String,
    repDateSign: String,
    witness: String,
    witnessDate: String,
    numberOfRooms: String,
    numberOfFloors: String,
    teamMember: Object
})
aobMitigationContract.plugin(timestamps)
module.exports = mongoose.model('AOB', aobMitigationContract, 'reports');