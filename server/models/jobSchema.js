const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    name: String,
    dispatchreports: []
})
module.exports = mongoose.model("Job", jobSchema)