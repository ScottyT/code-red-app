const express = require("express");
const User = require("../models/userSchema");
const Dispatch = require("../models/dispatchReportSchema");
const RapidResponse = require("../models/rapidReportSchema");
const CaseFile = require("../models/caseFileSchema");
const COC = require("../models/cocSchema");
const AOB = require("../models/aobSchema");
const CreditCard = require("../models/creditCardSchema");
const Sketch = require("../models/sketchSchema");
const Logging = require('../models/loggingSchema');
const chartModel = require("../models/chartSchema");
const createUser = require('../controllers/authController');
const { createSketch, createLogs, updateLogs, uploadChart } = require('../controllers/formController');
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
const multer = require('multer');
router.use(express.json({limit: "50MB"}))
router.use(express.urlencoded({extended: true, limit: "50MB"}));

//multer uploads
var storage = multer({
    /* destination: (req, file, cb) => {
        cb(null, 'uploads');
    } */
    dest: 'uploads'
});
var upload = multer({ storage: storage });

router.post("/auth/signup", createUser);
router.post("/employee/new",
    check('email', 'Email is required').isEmail().withMessage('Email must be valid'),
    check('fname').not().isEmpty().withMessage("First name is required"),
    check('lname').not().isEmpty().withMessage("Last name is required"),
    check('id').not().isEmpty().withMessage("ID is required")
    .custom(value => {
        return User.findOne({id: value}).then(user => {
            if (user) {
                return Promise.reject('ID already in use');
            }
        });
    }),
    check('role').not().isEmpty().withMessage('Role is required'),
async (req, res) => {
    const result = validationResult(req);
    /* const employee = new User({
        email: req.body.email,
        id: req.body.id,
        name: req.body.name,
        role: req.body.role,
    }); */
    const employee = new User(req.body)
    const reports = new Logging({
        JobId: "2222"
    });
    if (!result.isEmpty()) {
        return res.json(result)
    }
    employee.savedreports.push(reports)
    await employee.save().then(() => {
        res.json({message: "Created new employee"})
    }).catch((err) => {
        res.json({errors: err})
    })
})
router.get('/reports', async (req, res) => {
    const dispatch = await Dispatch.find({});
    const rapidresponse = await RapidResponse.find({});
    const caseFile = await CaseFile.find({});
    const certificate = await COC.find({});
    const aobContract = await AOB.find({});
    const creditCard = await CreditCard.find({});
    const sketches = await Sketch.find({});
    const logging = await Logging.find({});
    const charts = await chartModel.find({});
    const results = dispatch.concat(rapidresponse, caseFile, certificate, aobContract, creditCard, sketches, logging, charts)
    res.json(results)
})
router.get('/reports/:ReportType/:JobId', async (req, res) => {
    const repDispatch = await Dispatch.findOne({JobId: req.params.JobId});
    const repRapid = await RapidResponse.findOne({JobId: req.params.JobId});
    const containment = await CaseFile.findOne({JobId: req.params.JobId, CaseFileType: 'containment'});
    const technician = await CaseFile.findOne({JobId: req.params.JobId, CaseFileType: 'technician'});
    const creditCard = await CreditCard.find({JobId: req.params.JobId})
    const aob = await AOB.findOne({JobId: req.params.JobId});
    const coc = await COC.findOne({JobId: req.params.JobId});
    const chart = await chartModel.findOne({JobId: req.params.JobId});
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
            break;
        case "aob":
            res.json(aob)
            break;
        case "coc":
            res.json(coc)
            break;
        case "chart-report":
            res.json(chart)
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
    User.findOne({email: req.params.email}).populate('savedreports').exec((err, employee) => {
        if (err) {
            res.status(500).send('Error')
        } else if (employee) {
            res.status(200).json(employee)
        } else {
            res.status(400).send('Item not found')
        }
    })
})
router.post("/employee/:email/:formType/:JobId/update", updateLogs)
//router.delete("/employee:email/:formType/:JobId/delete", )
router.get('/certificates', (req, res) => {
    COC.find({}, (err, coc) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(coc)
        }
    })
})
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
router.get('/sketch', (req, res) => {
    Sketch.find({}, (err, sketch) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(sketch)
        }
    })
})
router.get('/sketch-report/:formType/:JobId', (req,res) => {
    Sketch.findOne({JobId: req.params.JobId, formType: req.params.formType}, (err, sketch) => {
        if (err) {
            res.status(500).send('Error')
        } else if (sketch) {
            res.status(200).json(sketch)
        } else {
            res.status(404).send('Item not found')
        }
    })
})
router.get('/logs/:employeeId', (req, res) => {
    Logging.find({}).where('teamMember.id').equals(req.params.employeeId).exec((err, logs) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(logs)
        }
    })
})
router.get('/logs-report/:formType/:JobId', (req, res) => {
    Logging.findOne({JobId: req.params.JobId, formType: req.params.formType}, (err, log) => {
        if (err) {
            res.status(500).send('Error')
        } else if (log) {
            res.status(200).json(log)
        } else {
            res.status(200).json({error: "Item not found", status: 404})
        }
    })
})
router.post("/sketch-report/new", 
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => {       
        return Sketch.findOne({JobId: value, formType: req.body.sketchType}).then(sketch => {
            if (sketch) {
                return Promise.reject('Job ID is already in use')
            }
        });
    }),
    check('sketch').not().isEmpty().withMessage('Sketch is required'),
    check('teamMember').not().isEmpty().withMessage('Employee must be logged in')
    .custom(value => {
        return User.findOne({id: value.id}).then(user => {
            if (!user) {
                return Promise.reject('You are not authorized')
            }
        })
    }),
    createSketch);
router.post("/chart/upload", 
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => {       
        return Sketch.findOne({JobId: value, formType: req.body.formType}).then(sketch => {
            if (sketch) {
                return Promise.reject('Job ID is already in use')
            }
        });
    }),
    check('chart').not().isEmpty().withMessage('Chart is required'),
    check('teamMember').not().isEmpty().withMessage('Employee must be logged in')
    .custom(value => {
        return User.findOne({id: value.id}).then(user => {
            if (!user) {
                return Promise.reject('You are not authorized')
            }
        })
    }),
    uploadChart)
router.post("/logs-report/new",
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => {
        return Logging.findOne({JobId: value, formType: req.body.formType}).then(log => {
            if (log) {
                return Promise.reject('Job ID is already in use for this type of form')
            }
        })
    }),
    check('teamMember').custom(value => {
        return User.findOne({id: value.id}).then(user => {
            if (!user) {
                return Promise.reject('You are not authorized')
            }
        })
    }),
    createLogs);
router.post("/logs-report/:formType/:JobId/update", updateLogs);
router.post("/upload", upload.single('img'), async (req, res) => {
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: req.body.img.data,
            contentType: 'image/png'
        }
    }
    await imageModel.create(obj, (err, item) => {
        if (err) {
            console.log(err)
            res.json(err)
        } else {
            item.save()
            res.json({message: "Image uploaded"})
        }
    })
});
router.post("/dispatch/new",
    check('ReportType').not().isEmpty().withMessage('Report type is required'),
    body('JobId')
        .not().isEmpty().withMessage("Job id is required")
        .custom(value => {
        return Dispatch.findOne({JobId: value}).then(dispatch => {
            if (dispatch) {
                return Promise.reject('Job id already in use');
            }
        });
    }),
    async (req, res) => {
        const errorFormatter = ({ msg, param, value, nestedErrors }) => {
            // Build your resulting errors however you want! String, object, whatever - it works!
            return `${param}: ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);       
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
            summary: req.body.summary,
            teamMember: req.body.teamMember,
            timeFormatted: req.body.timeFormatted,
            teamMemberSig: req.body.teamMemberSig,
            signDateTime: req.body.signDate
        });
        if (!result.isEmpty()) {
            return res.json({ errors: result.array() })
        }
        await dispatch.save().then(() => {
            res.json({message: "Report submitted"})
        }).catch((err) => {
            res.json(err)
        })
})
router.post("/rapid-response/new", 
    check('id').not().isEmpty().withMessage('Team lead id is required')
        .custom(value => {
            return User.findOne({id: value}).then(user => {
                if (!user) {
                    return Promise.reject('User is not found')
                }
            })
        }),
    body('JobId')
        .not().isEmpty().withMessage("Job id is required")
        .custom(value => {
            return RapidResponse.findOne({JobId: value}).then(report => {
                if (report) {
                    return Promise.reject('Job id already in use');
                }
            });
    }),
    async (req, res) => {
        const errorFormatter = ({ msg, param, value, nestedErrors }) => {
            // Build your resulting errors however you want! String, object, whatever - it works!
            return `${param}: ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
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
            EmailAddress: req.body.EmailAddress,
            EvaluationLogs: req.body.EvaluationLogs,
            PhoneNumber: req.body.PhoneNumber,
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
            intrusion: req.body.intrusionInfo,
            preliminaryDetermination: req.body.selectedPreliminary,
            moistureInspection: req.body.selectedInspection,
            preRestorationEval: req.body.preRestorationEval
        })
        if (!result.isEmpty()) {
            return res.json({ errors: result.array() })
        }
        await rapid.save().then(() => {
            res.json({message: "Report submitted"})
        }).catch((err) => {
            res.json(err)
        })
})
router.post("/case-file-report/new",
    check('JobId').not().isEmpty().withMessage('Job ID is required'),
    check('id').not().isEmpty().withMessage('Team Lead ID is required'),
    async (req, res) => {
        const errorFormatter = ({ msg, param, value, nestedErrors }) => {
            return `${param}: ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
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
            CaseFileType: req.body.CaseFileType
        });
        if (!result.isEmpty()) {
            return res.json({ errors: result.array() })
        }
        await caseFile.save().then(() => {
            res.json({message: "Report submitted"})
        }).catch((err) => {
            res.json(err)
        })
})
router.post("/coc/new",
    check('JobId').not().isEmpty().withMessage("Job ID is required")
        .custom(value => {
            return COC.findOne({JobId: value}).then(coc => {
                if (coc) {
                    return Promise.reject('Duplicate Job ID is not allowed')
                }
            })
        }),
    async (req, res) => {
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
            paymentOption: req.body.paymentOption
        });
        if (!result.isEmpty()) {
            return res.json({ errors: result.array() })
        }
        await certificate.save().then(() => {
            res.json({message: "Report submitted"})
        }).catch((err) => {
            res.json(err)
        })
})
router.post("/aob/new",
    check('JobId').not().isEmpty().withMessage("Job ID is required")
    .custom(value => {
        return AOB.findOne({JobId: value}).then(aob => {
            if (aob) {
                return Promise.reject('Duplicate Job ID is not allowed')
            }
        })
    }),
    async (req, res) => {
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
        teamMember: req.body.teamMember
    });
    if (!result.isEmpty()) {
        return res.json({ errors: result.array() })
    }
    await aobcontracts.save().then(() => {
        res.json({message: "Report submitted"})
    }).catch((err) => {
        res.json(err)
    })
})
router.post("/credit-card/new", [
    check('JobId').not().isEmpty().withMessage('Job id is required'),
    check('cardNumber', 'Card number is required')
], async (req, res) => {
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
        cvcNum: req.body.cvcNum,
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
})
module.exports = router;