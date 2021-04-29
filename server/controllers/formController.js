const Sketch = require('../models/sketchSchema');
const Logging = require('../models/loggingSchema');
const User = require('../models/userSchema');
const { validationResult } = require('express-validator');
const { options } = require('../routes/api');

const createSketch = async (req, res) => {
    const errors = validationResult(req)
    const sketch = new Sketch({
        JobId: req.body.JobId,
        teamMember: req.body.teamMember,
        sketch: req.body.sketch,
        formType: req.body.sketchType,
        ReportType: req.body.ReportType
    });
    const sketchReport = await Sketch.findOne({JobId: req.body.JobId, formType: req.body.sketchType}).exec()
    //returns the error
    if (!errors.isEmpty() || sketchReport !== null) {
        return res.json(errors)
    }
    await sketch.save().then(() => {
        res.json({message: "Form submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const createLogs = async (req, res) => {
    const errors = validationResult(req)
    
    const logs = new Logging({
        JobId: req.body.JobId,
        ReportType: req.body.ReportType,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        formType: req.body.formType,
        readingsLog: req.body.readingsLog,
        lossClassification: req.body.lossClassification,
        quantityData: req.body.quantityData,
        checkData: req.body.checkData,
        categoryData: req.body.categoryData,
        notes: req.body.notes,
        teamMember: req.body.teamMember
    });
    //const logs = new Logging(req.body)
    const logsReport = await Logging.findOne({JobId: req.body.JobId, formType: req.body.formType}).populate('user').exec()
    
    if (!errors.isEmpty() || logsReport !== null) {
        return res.json(errors)
    }
    
    await logs.save().then(() => {
        res.json({message: "Form submitted"})
    }).catch((err) => {
        res.json(err)
    })
    const employee = await User.findOne({email: req.body.teamMember.email});
    employee.savedreports.push(logs)
    await employee.save()
}
const updateLogs = async (req, res) => {
    const logsReport = await Logging.findOne({JobId: req.body.JobId, formType: req.body.formType}).exec()
    logsReport.readingsLog = req.body.readingsLog
    logsReport.lossClassification = req.body.lossClassification
    logsReport.quantityData = req.body.quantityData
    logsReport.checkData = req.body.checkData
    logsReport.categoryData = req.body.categoryData
    await logsReport.save().then(savedDoc => {
        savedDoc === logsReport;
        res.json({message: "Report updated"})
    }).catch((err) => {
        res.json(err)
    });
}
module.exports = { createSketch, createLogs, updateLogs }