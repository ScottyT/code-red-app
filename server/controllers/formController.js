const Sketch = require('../models/sketchSchema');
const { validationResult } = require('express-validator');

const createSketch = async (req, res) => {
    const errors = validationResult(req)
    const sketch = new Sketch({
        JobId: req.body.JobId,
        teamMember: req.body.teamMember,
        sketch: req.body.sketch,
        sketchType: req.params.uid,
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
module.exports = { createSketch }