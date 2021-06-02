const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const moistureMap = mongoose.Schema({
    JobId: {
        type: String,
        required: true
    },
    ReportType: String,
    formType: String,
    initialEvalDate: String,
    location: Map,
    areaSub1: String,
    areaSub2: String,
    areaSub3: String,
    baselineReadings: String,
    readingsRow: Array,
    notes: {
        type: String,
        required: true
    },
    teamMember: Object
})
moistureMap.plugin(timestamps)
module.exports = mongoose.model('Moisture', moistureMap, 'reports')