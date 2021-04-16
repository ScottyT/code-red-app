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
    techIds: Array,
    quantityData: Array,
    checkData: Array,
    categoryData: Array,
    notes: String,
    teamMember: {
        type: Object,
        required: true
    }
});
logging.plugin(timestamps);
module.exports = mongoose.model('Logs', logging);