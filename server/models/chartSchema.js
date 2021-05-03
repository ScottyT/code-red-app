const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp2');

const chartSchema = mongoose.Schema({
    JobId: {
        type: String,
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

module.exports = mongoose.model('Chart', chartSchema)