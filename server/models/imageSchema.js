const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp2');

const imageSchema = mongoose.Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String
    },
    teamMember: String
});
imageSchema.plugin(timestamps);
module.exports = mongoose.model('Avatar', imageSchema);