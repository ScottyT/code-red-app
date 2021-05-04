const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp2');

const sketchReport = mongoose.Schema({
    JobId: {
        type: String,
        required: true
    },
    sketch: {
        type: Object,
        required: true
    },
    chart: {
        data: Buffer,
        contentType: String
    },
    teamMember: {
        type: Map,
        required: true
    },
    formType: String,
    ReportType: String
});
sketchReport.plugin(timestamps)
module.exports = mongoose.model('SketchReports', sketchReport, 'sketch-reports')