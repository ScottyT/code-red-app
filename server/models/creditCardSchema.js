const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const creditCardReport = mongoose.Schema({
    JobId: {
        type: String,
        required: true
    },
    ReportType: {
        type: String,
        required: true
    },
    cardholderInfo: Map,
    billingAddress: Map,
    creditCard: String,
    cardNumber: {
        type: String,
        required: true
    },
    cardholderName: String,
    expirationDate: String,
    cvcNum: String,
    cardholderZip: String,
    customerSig: String,
    customerSignDate: String
})
creditCardReport.plugin(timestamps)
module.exports = mongoose.model('CreditCard', creditCardReport, 'credit-cards')