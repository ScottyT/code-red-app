const Sketch = require('../models/sketchSchema');
const Logging = require('../models/loggingSchema');
const { validationResult } = require('express-validator');
const { options } = require('../routes/api');

const createSketch = async (req, res) => {
    const errors = validationResult(req)
    const sketch = new Sketch({
        JobId: req.body.JobId,
        teamMember: req.body.teamMember,
        sketch: req.body.sketch,
        formType: req.params.uid,
        ReportType: req.body.ReportType
    });
    const sketchReport = await Sketch.findOne({JobId: req.body.JobId, sketchType: req.body.sketchType}).exec()
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
        formType: req.body.logType,
        readingsLog: req.body.readingsLog,
        lossClassification: req.body.lossClassification,
        techIds: req.body.techIds,
        quantityData: req.body.quantityData,
        checkData: req.body.checkData,
        categoryData: req.body.categoryData,
        notes: req.body.notes,
        teamMember: req.body.employee
    });
    const logsReport = await Logging.findOne({JobId: req.body.JobId, formType: req.body.formType}).exec()
    if (!errors.isEmpty() || logsReport !== null) {
        return res.json(errors)
    }
    await logs.save().then(() => {
        res.json({message: "Form submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const updateLogs = async (req, res) => {
    const logsReport = await Logging.findOne({JobId: req.body.JobId, formType: req.body.formType}).exec()
    logsReport.techIds = req.body.techIds
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