const express = require("express");
const User = require("../models/userSchema");
const Dispatch = require("../models/dispatchReportSchema");
const RapidResponse = require("../models/rapidReportSchema");
const CaseFile = require("../models/caseFileSchema");
const COC = require("../models/cocSchema");
const AOB = require("../models/aobSchema");
const CreditCard = require("../models/creditCardSchema");
const router = express.Router();

const { body, check, validationResult } = require('express-validator');
const { values } = require("idb-keyval");
router.use(express.json())
router.use(express.urlencoded({extended: true}));
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
    const creditCard = await CreditCard.findOne({JobId: req.params.JobId})
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
            break;
        case "credit-card":
            res.json(creditCard);
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
router.get('/certificates', (req, res) => {
    COC.find({}, (err, coc) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(coc)
        }
    })
})
/* router.get('/certificate/:JobId', async (res, res) => {
    const certificate = await COC.findOne({JobId: req.params.JobId});
    res.json(certificate);
}) */
router.get('/aob-mitigation-contracts', (req, res) => {
    AOB.find({}, (err, aob) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(aob)
        }
    })
})
router.get('/credit-cards', (req, res) => {
    CreditCard.find({}, (err, creditcard) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(creditcard)
        }
    })
})
router.get('/credit-card/:cardNumber', (req, res) => {
    CreditCard.findOne({cardNumber: req.body.cardNumber}, (err, creditcard) => {
        if (err) {
            res.status(500).send('Error')
        } else if (creditcard) {
            res.status(200).json(creditcard)
        } else {
            res.status(400).send('Credit card not found')
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
router.post("/coc/new", (req, res) => {
    COC.create({
        JobId: req.body.JobId,
        ReportType: "coc",
        subjectProperty: req.body.subjectProperty,
        deductible: req.body.deductible,
        insuredMinEndDate: req.body.insuredEndDate,
        insuredPayment1: req.body.insuredPayment1,
        insuredPayment2: req.body.insuredPayment2,
        nonInsuredMinEndDate: req.body.nonInsuredEndDate,
        nonInsuredPayment1: req.body.nonInsuredPayment1,
        nonInsuredPayment2: req.body.nonInsuredPayment2,
        rating: req.body.rating,
        representative: req.body.repPrint,
        repSignTime: req.body.repSignTime,
        representativeSign: req.body.repSign,
        repSignDate: req.body.repSignDate,
        teamSign: req.body.teamSign,
        teamSignDate: req.body.teamSignDate,
        testimonial: req.body.testimonial,
        cardholder: req.body.cardholderInfo,
        billingAddress: req.body.billingAddress,
        creditCardProvider: req.body.creditCard,
        cardNumber: req.body.cardNumber,
        cardholderName: req.body.cardholderName,
        expirationDate: req.body.expDate,
        cvcNumber: req.body.cvcNum,
        cardZipCode: req.body.cardholderZip,
        customerSignature: req.body.cusSign,
        customerSigDate: req.body.customerSigDate
    }, (err, coc) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(coc)
        }
    })
})
router.post("/aob/new", (req, res) => {
    AOB.create({
        JobId: req.body.JobId,
        ReportType: req.body.ReportType,
        subjectProperty: req.body.subjectProperty,
        cusSign: req.body.cusSign,
        cusSignDate: req.body.cusSignDate,
        initial1: req.body.initial1,
        initial2: req.body.initial2,
        initial3: req.body.initial3,
        initial4: req.body.initial4,
        initial5: req.body.initial5,
        initial6: req.body.initial6,
        initial7: req.body.initial7,
        initial8: req.body.initial8,
        insuredTermEndDate: req.body.insuredTermEndDate,
        insuredPay1: req.body.insuredPay1,
        insuredPayDay1: req.body.insuredPayDay1,
        insuredPay2: req.body.insuredPay2,
        insuredPayDay5: req.body.insuredPayDay5,
        nonInsuredTermEndDate: req.body.nonInsuredTermEndDate,
        nonInsuredDay1: req.body.nonInsuredDay1,
        nonInsuredDay5: req.body.nonInsuredDay5,
        location: req.body.location,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        driversLicense: req.body.driversLicense,
        relation: req.body.relation,
        minimumSqft: req.body.minimumSqft,
        representativePrint: req.body.representativePrint,
        repSignature: req.body.repSignature,
        propertyRepOf: req.body.propertyRepOf,
        repDateSign: req.body.repDateSign,
        witness: req.body.witness,
        witnessDate: req.body.witnessDate,
        numberOfRooms: req.body.numberOfRooms,
        numberOfFloors: req.body.numberOfFloors
    }, (err, aob) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(aob)
        }
    })
})
router.post("/credit-card/new", [
    check('JobId').not().isEmpty().withMessage('Job id is required'),
    check('cardNumber', 'Card number is required')
], (req, res) => {
    CreditCard.create({
        JobId: req.body.JobId,
        ReportType: req.body.ReportType,
        cardholderInfo: req.body.cardholderInfo,
        billingAddress: req.body.billingAddress,
        creditCard: req.body.creditCard,
        cardNumber: req.body.cardNumber,
        cardholderName: req.body.cardholderName,
        expirationDate: req.body.expDate,
        cvcNum: req.body.cvcNum,
        cardholderZip: req.body.cardholderZip,
        customerSig: req.body.cusSign,
        customerSignDate: req.body.customerSigDate
    }, (err, creditcard) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(creditcard)
        }
    })
})
module.exports = router;