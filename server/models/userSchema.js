const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp2');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});
userSchema.plugin(timestamps)
module.exports = mongoose.model('Employee', userSchema)