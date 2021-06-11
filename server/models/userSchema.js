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
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        image: Buffer,
        contentType: String
    },
});
userSchema.plugin(timestamps)
module.exports = mongoose.model('Employee', userSchema)