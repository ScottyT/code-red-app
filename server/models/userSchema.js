const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        requred: [true, 'Email is required']
    },
    id: String,
    name: String,
    role: String
})
module.exports = mongoose.model('Employee', userSchema)