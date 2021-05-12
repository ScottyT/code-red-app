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
const moistureModel = require('../models/moistureMapSchema');
const createUser = require("../controllers/authController");
const { createEmployee, createMoistureMap, createSketch, createLogs, updateLogs, uploadChart, createDispatch, createRapidResponse, createAOB, createCOC, createCaseFile, createCreditCard } = require('../controllers/formController');
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
router.use(express.json({limit: "50MB"}))
router.use(express.urlencoded({extended: true, limit: "50MB"}));

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
    check('role').not().isEmpty().withMessage('Role is required'), createEmployee)
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
            User.create()
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
router.get('/chart-report/:formType/:JobId', (req, res) => {
    chartModel.findOne({JobId: req.params.JobId, formType: req.params.formType}, (err, chart) => {
        if (err) {
            res.status(500).send('Server Error')
        } else if (chart) {
            res.status(200).json(chart)
        } else {
            res.status(200).json({error: "Item no found", status: 404})
        }
    })
})
router.post("/moisture-map/new",
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => {
        return moistureModel.findOne({JobId: value, formType: req.body.formType}).then(moisture => {
            if (moisture) {
                return Promise.reject('Job ID is already in use')
            }
        })
    },
    check('notes').not().isEmpty().withMessage('Notes is required')
    ), createMoistureMap)
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
router.post("/chart-report/new", 
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => {       
        return chartModel.findOne({JobId: value, formType: req.body.formType}).then(chart => {
            if (chart) {
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
router.post("/dispatch/new",
    check('ReportType').not().isEmpty().withMessage('Report type is required'),
    body('emailAddress').isEmail().normalizeEmail().withMessage('Email needs to be formatted correctly'),
    body('teamMemberSig').not().isEmpty().withMessage('Signature is required'),
    body('JobId')
        .not().isEmpty().withMessage("Job id is required")
        .custom(value => {
        return Dispatch.findOne({JobId: value}).then(dispatch => {
            if (dispatch) {
                return Promise.reject('Job id already in use');
            }
        });
    }),
    createDispatch)
router.post("/rapid-response/new", 
    check('id').not().isEmpty().withMessage('Team lead id is required')
        .custom(value => {
            return User.findOne({id: value}).then(user => {
                if (!user) {
                    return Promise.reject('User is not found')
                }
            })
        }),
    body('teamMemberSig').not().isEmpty().withMessage('Team member signature is required'),
    body('cusSignature').not().isEmpty().withMessage('Customer signature is required'),
    body('JobId')
        .not().isEmpty().withMessage("Job id is required")
        .custom(value => {
            return RapidResponse.findOne({JobId: value}).then(report => {
                if (report) {
                    return Promise.reject('Job id already in use');
                }
            });
    }),
    createRapidResponse)
router.post("/case-file-report/new",
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => {
        return CaseFile.findOne({JobId: value, CaseFileType: req.body.CaseFileType}).then(casefile => {
            if (casefile) {
                return Promise.reject('Job ID is already in use')
            }
        })
    }),
    body('verifySig').not().isEmpty().withMessage('Signature is required'),
    check('id').not().isEmpty().withMessage('Team Lead ID is required'),
    createCaseFile)
router.post("/coc/new",
    check('JobId').not().isEmpty().withMessage("Job ID is required")
        .custom(value => {
            return COC.findOne({JobId: value}).then(coc => {
                if (coc) {
                    return Promise.reject('Duplicate Job ID is not allowed')
                }
            })
        }),
    createCOC)
router.post("/aob/new",
    check('JobId').not().isEmpty().withMessage("Job ID is required")
    .custom(value => {
        return AOB.findOne({JobId: value}).then(aob => {
            if (aob) {
                return Promise.reject('Duplicate Job ID is not allowed')
            }
        })
    }),
    createAOB)
router.post("/credit-card/new", [
    check('JobId').not().isEmpty().withMessage('Job id is required'),
    check('cardNumber', 'Card number is required')
], createCreditCard)
module.exports = router;