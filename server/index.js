const express = require("express");
const mongoose = require("mongoose");
const api = require('./routes/api');
const dotenv = require("dotenv");
const app = express();
const fs = require('fs');
const path = require('path')
dotenv.config();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})
app.use('/api', api);

app.use(express.json())
app.use('/static', express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, maxPoolSize: 200 });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', () => {
    app.listen(port, () => {
        console.log(`Server listening at ${port}`);
    })
})

module.exports = { path: '/api', handler: app }