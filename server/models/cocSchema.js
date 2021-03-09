const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const certificateOfCompletion = mongoose.Schema({
    JobId: String,
    ReportType: String,
    address: String,
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
    testimonial: String,
    cardholder: Object,
    billingAddress: Object,
    creditCardProvider: String,
    cardNumber: String,
    cardholderName: String,
    expirationDate: String,
    cvcNumber: String,
    cardZipCode: String,
    customerSignature: String
})
module.exports = mongoose.model('COC', certificateOfCompletion, 'certificate-of-completion');