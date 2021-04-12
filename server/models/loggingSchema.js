const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const logging = mongoose.Schema({
    JobId: {
        type: String,
        required: true
    },
    ReportType: String,
    logType: String,
    startDate: String,
    endDate: String,
    readingsLog: Array,
    lossClassification: Array,
    inventoryLog: Array,
    notes: String
});
logging.plugin(timestamps);
module.exports = mongoose.model('Logs', logging);