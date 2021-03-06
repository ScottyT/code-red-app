const Sketch = require('../models/sketchSchema');
const Logging = require('../models/loggingSchema');
const User = require('../models/userSchema');
const COC = require('../models/cocSchema');
const AOB = require('../models/aobSchema');
const Dispatch = require("../models/dispatchReportSchema");
const RapidResponse = require("../models/rapidReportSchema");
const CaseFile = require("../models/caseFileSchema");
const CreditCard = require("../models/creditCardSchema");
const chartModel = require('../models/chartSchema');
const moistureModel = require('../models/moistureMapSchema');
const { validationResult } = require('express-validator');

const createMoistureMap = async (req, res) => {
    const errors = validationResult(req)
    const moisture = new moistureModel({
        JobId: req.body.JobId,
        ReportType: req.body.ReportType,
        formType: req.body.formType,
        initialEvalDate: req.body.initialEvalDate,
        location: req.body.location,
        areaSub1: req.body.areaSub1,
        areaSub2: req.body.areaSub2,
        areaSub3: req.body.areaSub3,
        baselineReadings: req.body.baseLineReadings,
        readingsRow: req.body.readingsRow,
        notes: req.body.notes,
        teamMember: req.body.teamMember
    })
    if (!errors.isEmpty()) {
        return res.json(errors)
    }
    await moisture.save().then(() => {
        res.json({message: "Form submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const createEmployee = async (req, res) => {
    const result = validationResult(req);
    const employee = new User(req.body)
    
    if (!result.isEmpty()) {
        return res.json(result)
    }
    /* employee.savedreports.push(reports) */
    await employee.save().then(() => {
        res.json({message: "Created new employee"})
    }).catch((err) => {
        res.json({errors: err})
    })
}
const uploadChart = async (req, res) => {
    const errors = validationResult(req)
    const obj = new chartModel({
        JobId: req.body.JobId,
        teamMember: req.body.teamMember,
        formType: req.body.formType,
        ReportType: req.body.ReportType,
        chart: req.body.chart
    })
    
    if (!errors.isEmpty()) {
        return res.json(errors)
    }
    await obj.save().then(() => {
        res.json({message: "Chart uploaded"})
    }).catch((err) => {
        res.json(err)
    })
}
const createSketch = async (req, res) => {
    const errors = validationResult(req)
    const sketch = new Sketch({
        JobId: req.body.JobId,
        teamMember: req.body.user,
        sketch: req.body.sketch,
        formType: req.body.formType,
        ReportType: req.body.ReportType
    });
    
    //returns the error
    if (!errors.isEmpty()) {
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
    var logs
    if (req.body.ReportType === 'moisture-map') {
        logs = new Logging({
            JobId: req.body.JobId,
            ReportType: req.body.ReportType,
            formType: req.body.formType,
            initialEvalDate: req.body.initialEvalDate,
            location: req.body.location,
            areaSub1: req.body.areaSub1,
            areaSub2: req.body.areaSub2,
            areaSub3: req.body.areaSub3,
            baselineReadings: req.body.baseLineReadings,
            readingsRow: req.body.readingsRow,
            notes: req.body.notes,
            teamMember: req.body.teamMember
        })
    } else {
        logs = new Logging({
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
        })
    }
    
    if (!errors.isEmpty()) {
        return res.json(errors)
    }
    /* const employee = await User.findOne({email: req.body.teamMember.email});
    employee.savedreports.push(logs) */
    await logs.save().then(() => {
        res.json({message: "Form submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const updateLogs = async (req, res) => {
    const logsReport = await Logging.findOne({JobId: req.body.JobId, formType: req.body.formType, ReportType: req.body.ReportType}).exec()
    logsReport.readingsLog = req.body.readingsLog
    logsReport.lossClassification = req.body.lossClassification
    logsReport.quantityData = req.body.quantityData
    logsReport.checkData = req.body.checkData
    logsReport.categoryData = req.body.categoryData
    logsReport.readingsRow = req.body.readingsRow
    await logsReport.save().then(savedDoc => {
        savedDoc === logsReport;
        res.json({message: "Report updated"})
    }).catch((err) => {
        res.json(err)
    });
}
const createCOC = async (req, res) => {
    const errorFormatter = ({ msg, param, value, nestedErrors }) => {
        return `${param}: ${msg}`;
    };
    const result = validationResult(req).formatWith(errorFormatter);
    const certificate = new COC({
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
        teamMember: req.body.teamMember,
        testimonial: req.body.testimonial,
        paymentOption: req.body.paymentOption,
        cardNumber: req.body.cardNumber
    });
    if (!result.isEmpty()) {
        return res.json({ errors: result.array() })
    }
    await certificate.save().then(() => {
        res.json({message: "Report submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const createAOB = async (req, res) => {
    const errorFormatter = ({ msg, param, value, nestedErrors }) => {
        return `${param}: ${msg}`;
    };
    const result = validationResult(req).formatWith(errorFormatter);
    const aobcontracts = new AOB({
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
        numberOfFloors: req.body.numberOfFloors,
        teamMember: req.body.teamMember,
        cardNumber: req.body.cardNumber,
        paymentOption: req.body.paymentOption
    });
    if (!result.isEmpty()) {
        return res.json({ errors: result.array() })
    }
    await aobcontracts.save().then(() => {
        res.json({message: "Report submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const createDispatch = async (req, res) => {
    const errors = validationResult(req);       
    const dispatch = new Dispatch({
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
        intrusion: req.body.intrusion,
        summary: req.body.summary,
        teamMember: req.body.teamMember,
        timeFormatted: req.body.timeFormatted,
        teamMemberSig: req.body.teamMemberSig,
        signDate: req.body.signDate
    });
    if (!errors.isEmpty()) {
        return res.json(errors)
    }
    await dispatch.save().then(() => {
        res.json({message: "Report submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const createRapidResponse = async (req, res) => {
    const errors = validationResult(req);
    const rapid = new RapidResponse({
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
        emailAddress: req.body.EmailAddress,
        evaluationLogs: req.body.evaluationLogs,
        documentVerification: req.body.documentVerification,
        phoneNumber: req.body.PhoneNumber,
        PictureTypes: req.body.PictureTypes,
        ReportType: req.body.ReportType,
        Steps: req.body.Steps,
        sourceWaterIntrusion: req.body.sourceWaterIntrusion,
        cusFirstName: req.body.cusFirstName,
        cusLastName: req.body.cusLastName,
        moistureMap: req.body.moistureMap,
        id: req.body.id,
        location: req.body.location,
        signDate: req.body.signDate,
        cusSignDate: req.body.cusSignDate,
        teamMember: req.body.teamMember,
        intrusion: req.body.intrusionInfo,
        dateIntrusion: req.body.dateIntrusion,
        timeIntrusion: req.body.timeIntrusion,
        preliminaryDetermination: req.body.selectedPreliminary,
        moistureInspection: req.body.selectedInspection,
        preRestorationEval: req.body.preRestorationEval,
        teamMemberSig: req.body.teamMemberSig,
        customerSig: req.body.customerSig,
        initial1: req.body.initials.initial1,
        initial2: req.body.initials.initial2,
        initial3: req.body.initials.initial3,
        initial4: req.body.initials.initial4
    })
    if (!errors.isEmpty()) {
        return res.json(errors)
    }
    await rapid.save().then(() => {
        res.json({message: "Report submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const createCreditCard = async (req, res) => {
    const errorFormatter = ({ msg, param, value, nestedErrors }) => {
        return `${param}: ${msg}`;
    };
    const result = validationResult(req).formatWith(errorFormatter);

    const creditCard = new CreditCard({
        JobId: req.body.JobId,
        ReportType: req.body.ReportType,
        cardholderInfo: req.body.cardholderInfo,
        billingAddress: req.body.billingAddress,
        creditCard: req.body.creditCard,
        cardNumber: req.body.cardNumber,
        cardholderName: req.body.cardholderName,
        expirationDate: req.body.expDate,
        cvvNum: req.body.cvvNum,
        cardholderZip: req.body.cardholderZip,
        customerSig: req.body.cusSign,
        customerSignDate: req.body.customerSigDate
    });
    if (!result.isEmpty) {
        return res.json({ errors: result.array() })
    }
    await creditCard.save().then(() => {
        res.json({message: "Report submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
const createCaseFile = async (req, res) => {
    const errors = validationResult(req);
    const caseFile = new CaseFile({
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
        formType: req.body.formType
    });
    if (!errors.isEmpty()) {
        return res.json(errors)
    }
    await caseFile.save().then(() => {
        res.json({message: "Report submitted"})
    }).catch((err) => {
        res.json(err)
    })
}
module.exports = {
    createEmployee,
    createMoistureMap,
    createSketch, 
    createLogs, 
    updateLogs, 
    uploadChart,
    createDispatch, 
    createRapidResponse, 
    createCOC, 
    createAOB,
    createCreditCard,
    createCaseFile
}