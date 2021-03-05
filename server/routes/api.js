const express = require("express");
const User = require("../models/userSchema");
const Dispatch = require("../models/dispatchReportSchema");
const RapidResponse = require("../models/rapidReportSchema");
const CaseFile = require("../models/caseFileSchema");
const router = express.Router();
router.use(express.json())
router.post("/employee/new", (req, res) => {
    console.log(req.body)
    User.create({
        email: req.body.email,
        id: req.body.id,
        name: req.body.name,
        role: req.body.role
    }, (err, employee) => {
        if (err) {
            console.log(`CREATE error: ${err}`)
            res.status(500).send('Error')
        } else {
            res.status(200).json(employee)
        }
    })
})
router.get('/reports', async (req, res) => {
    const dispatch = await Dispatch.find({});
    const rapidresponse = await RapidResponse.find({});
    const caseFile = await CaseFile.find({});
    const results = dispatch.concat(rapidresponse, caseFile)
    res.json(results)
})
router.get('/reports/:ReportType/:JobId', async (req, res) => {
    const repDispatch = await Dispatch.findOne({JobId: req.params.JobId});
    const repRapid = await RapidResponse.findOne({JobId: req.params.JobId});
    const containment = await CaseFile.findOne({JobId: req.params.JobId, CaseFileType: 'containment'});
    const technician = await CaseFile.findOne({JobId: req.params.JobId, CaseFileType: 'technician'});
    switch (req.params.ReportType) {
        case "dispatch":
            res.json(repDispatch)
            break;
        case "rapid-response":
            res.json(repRapid)
            break;
        case "case-file-containment":
            res.json(containment)
            break;
        case "case-file-technician":
            res.json(technician);
    }
})
router.post("/report/:ReportType/:JobId/update", async (req, res) => {
    switch (req.params.ReportType) {
        case "dispatch":
            await Dispatch.findOneAndUpdate({JobId: req.body.JobId}, req.body, { new: true })
                .exec((err, updated) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send('Error');
                    } else {
                        res.status(200).json(updated)
                    }
                })
            break;
        case "rapid-response":
            await RapidResponse.findOneAndUpdate({JobId: req.body.JobId}, req.body, { new: true })
                .exec((err, updated) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send('Error')
                    } else {
                        res.status(200).json(updated)
                    }
                })                    
            break;
        default:
            console.log("Nothing to update")
    }
})
router.get('/employees', (req, res) => {
    User.find({}, (err, employees) => {
        if (err) {
            console.log(`RETRIEVE error: ${err}`);
            res.status(500).send('Error');
        } else if (employees) {
            res.status(200).json(employees)
        }
    })
})
router.get('/employee/:email', (req, res) => {
    console.log("request", req.params)
    User.findOne({email: req.params.email}, (err, employee) => {
        if (err) {
            res.status(500).send('Error')
        } else if (employee) {
            res.status(200).json(employee)
        } else {
            res.status(400).send('Item not found')
        }
    })
})
router.post("/dispatch/new", (req, res) => {
    Dispatch.create({
        ArrivalContactName: req.body.ArrivalContactName,
        JobId: req.body.JobId,
        ReportType: req.body.ReportType,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime,
        callerName: req.body.callerName,
        dateFormatted: req.body.dateFormatted,
        emailAddress: req.body.emailAddress,
        phoneNumber: req.body.phoneNumber,
        callTimeUpdate: req.body.callTimeUpdate,
        id: req.body.id,
        location: req.body.location,
        textTimeUpdate: req.body.textTimeUpdate,
        propertyChkList: req.body.propertyChkList,
        summary: req.body.summary,
        teamMember: req.body.teamMember,
        timeFormatted: req.body.timeFormatted,
        teamMemberSig: req.body.teamMemberSig,
        signDateTime: req.body.signDate
    }, (err, report) => {
        if (err) {
            console.log(`CREATE error: ${err}`)
            res.status(500).send('Error')
        } else {
            res.status(200).json(report)
        }
    })
    
})
router.post("/rapid-response/new", (req, res) => {
    RapidResponse.create({
        JobId: req.body.JobId,
        DateOfLoss: req.body.DateOfLoss,
        ClaimNumber: req.body.ClaimNumber,
        PolicyNumber: req.body.PolicyNumber,
        InsuranceCompany: req.body.InsuranceCompany,
        adjusterName: req.body.adjusterName,
        adjusterEmail: req.body.adjusterEmail,
        adjusterPhone: req.body.adjusterPhone,
        ContactName: req.body.ContactName,
        DateOfEvaluation: req.body.DateOfEvaluation,
        EmailAddress: req.body.EmailAddress,
        EvaluationLogs: req.body.EvaluationLogs,
        PhoneNumber: req.body.PhoneNumber,
        Pictures: req.body.Pictures,
        PictureTypes: req.body.PictureTypes,
        ReportType: req.body.ReportType,
        Steps: req.body.Steps,
        TypeOfLoss: req.body.TypeOfLoss,
        cusFirstName: req.body.cusFirstName,
        cusLastName: req.body.cusLastName,
        id: req.body.id,
        location: req.body.location,
        signDate: req.body.signDate,
        teamMember: req.body.teamMember,
        photoId: req.body.photoId,
        jobFiles: req.body.jobFiles,
        cardImages: req.body.cardImages,
        intrusion: req.body.intrusionInfo,
        preliminaryDetermination: req.body.selectedPreliminary,
        moistureInspection: req.body.selectedInspection,
        preRestorationEval: req.body.preRestorationEval
    }, (err, report) => {
        if (err) {
            console.log(`CREATE error: ${err}`)
            res.status(500).send('Error')
        } else {
            res.status(200).json(report)
        }
    })
})
router.post("/case-file-report/new", (req, res) => {
    CaseFile.create({
        JobId: req.body.JobId,
        date: req.body.date,
        id: req.body.id,
        location: req.body.location,
        ReportType: req.body.ReportType,
        selectedTmpRepairs: req.body.selectedTMPRepairs,
        selectedContent: req.body.selectedContent,
        selectedStructualCleaning: req.body.selectedStructualCleaning,
        selectedStructualDrying: req.body.selectedStructualDrying,
        selectedCleaningSection: req.body.selectedStructualCleaning,
        contentCleaningInspection: req.body.contentCleaningInspection,
        waterRestorationInspection: req.body.waterRestorationInspection,
        waterRemediationAssesment: req.body.waterRemediationAssesment,
        overviewScopeOfWork: req.body.overviewScopeOfWork,
        specializedExpert: req.body.specializedExpert,
        scopeOfWork: req.body.scopeOfWork,
        projectWorkPlans: req.body.projectWorkPlans,
        notes: req.body.notes,
        afterHoursWork: req.body.afterHoursWork,
        evaluationLogs: req.body.evaluationLogs,
        verifySign: req.body.verifySig,
        teamMember: req.body.teamMember,
        CaseFileType: req.body.CaseFileType
    }, (err, report) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(report)
        }
    })
})

module.exports = router;