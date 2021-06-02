const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const certificateOfCompletion = mongoose.Schema({
    JobId: {
        type: String,
        required: true
    },
    ReportType: String,
    subjectProperty: String,
    deductible: String,
    insuredMinEndDate: String,
    insuredPayment1: Map,
    insuredPayment2: Map,
    nonInsuredMinEndDate: String,
    nonInsuredPayment1: String,
    nonInsuredPayment2: String,
    rating: String,
    representative: String,
    repSignTime: String,
    representativeSign: String,
    repSignDate: String,
    teamSign: String,
    teamSignDate: String,
    teamMember: Object,
    testimonial: String,
    paymentOption: String
})
certificateOfCompletion.plugin(timestamps)
module.exports = mongoose.model('COC', certificateOfCompletion, 'reports');