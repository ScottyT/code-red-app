const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const logging = mongoose.Schema({
    JobId: {
        type: String,
        required: true
    },
    ReportType: String,
    formType: String,
    startDate: String,
    endDate: String,
    readingsLog: Array,
    lossClassification: Array,
    quantityData: Array,
    checkData: Array,
    categoryData: Array,
    notes: String,
    teamMember: {
        type: Object,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    initialEvalDate: String,
    location: Map,
    areaSub1: String,
    areaSub2: String,
    areaSub3: String,
    baselineReadings: String,
    readingsRow: Array
});
logging.plugin(timestamps);
module.exports = mongoose.model('Logs', logging, 'reports');