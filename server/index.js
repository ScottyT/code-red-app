const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const api = require('./routes/api');
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})
/* app.use(express.json({limit: '100MB'}));
app.use(express.urlencoded({limit: '100MB'})); */
app.use('/api', api);
app.use(express.json())
const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', () => {
    app.listen(port, () => {
        console.log(`Server listening at ${port}`);
    })
})