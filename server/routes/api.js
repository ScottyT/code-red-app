const express = require("express");
const User = require("../models/userSchema");
const Dispatch = require("../models/dispatchReportSchema");
const RapidResponse = require("../models/rapidReportSchema");
const CreditCard = require("../models/creditCardSchema");
const imageModel = require("../models/imageSchema");
const Report = require("../models/reportsSchema");
const multer = require('multer');
const { createUser, updateUser, uploadAvatar } = require("../controllers/authController");
const { sendMail } = require('../controllers/emailController')
const { checkIfAuthenticated } = require("../middleware/authMiddleware");
const { createEmployee, createMoistureMap, createSketch, createLogs, updateLogs, uploadChart, createDispatch, createRapidResponse, createAOB, createCOC, createCaseFile, createCreditCard } = require('../controllers/formController');
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
const path = require('path');

router.use(express.json({limit: "50MB"}))
router.use(express.urlencoded({extended: true, limit: "50MB"}));
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + '/uploads/'))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname)
    }
});
var upload = multer({ storage: storage })
// GENERAL REUSABLE FUNCTIONS //
const duplicateJobIDCheck = (val, reportType) => {
    return Report.findOne({JobId: val, ReportType: reportType}).then(report => {
        if (report) {
            return Promise.reject('Job id already in use');
        }
    });
}

router.post("/auth/signup", createUser);
router.post("/employee/new", 
    check('email', 'Email is required').isEmail().withMessage('Email must be valid')
    .custom(value => {
        return User.findOne({email: value}).then(user => {
            if (user) {
                return Promise.reject('Email already in use');
            }
        })
    }),
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

router.post("/employee/:email/update", updateUser)
router.get('/reports', checkIfAuthenticated, async (req, res) => {
    await Report.find({}).lean().exec((err, reports) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(reports)
        }
    })
    //const results = await reportsModel.find({})
})
router.get('/reports/:ReportType', checkIfAuthenticated, async (req, res) => {
    await Report.where('ReportType').equals(req.params.ReportType).lean().exec((err, report) => {
        if (err) {
            res.status(500).send('Error')
        } else if (report) {
            res.status(200).json(report)
        } else {
            res.status(200).json({error: "No report found"})
        }
    })
})
router.get('/report/:ReportType/:JobId', checkIfAuthenticated, async (req, res) => {
    await Report.findOne({JobId: req.params.JobId, ReportType: req.params.ReportType}).lean().exec((err, report) => {
        if (err) {
            res.status(500).send('Error')
        } else if (report) {
            res.status(200).json({data: report, error: false, message: "Successfully found report"})
        } else {
            res.status(200).json({error: true, message: "No report found"})
        }
    })
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
            res.status(500).send('Error');
        } else if (employees) {
            res.status(200).json(employees)
        }
    }).lean()
})
router.get('/employee/:email', checkIfAuthenticated, (req, res) => {
    User.findOne({email: req.params.email}).exec((err, employee) => {
        if (err) {
            res.status(500).send('Error')
        } else if (employee) {
            res.status(200).json(employee)
        } else {
            
            res.status(400).send('Item not found')
        }
    })
})
router.get('/employee/:email/reports', checkIfAuthenticated, async (req, res) => {
    await Report.where('teamMember.email').equals(req.params.email).lean().exec((err, reports) => {
        if (err) {
            res.status(500).send('Error')
        } else if (reports) {
            res.status(200).json(reports)
        } else {
            res.status(200).json({error: "Oh no! You have created no reports!"})
        }
    })
})
router.post("/employee/:email/:formType/:JobId/update", updateLogs)
//router.delete("/employee:email/:formType/:JobId/delete", )
router.get('/credit-cards', (req, res) => {
    CreditCard.find({}, (err, creditcard) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(creditcard)
        }
    })
})
router.get('/credit-card/:cardNumber', checkIfAuthenticated, async (req, res) => {
    await CreditCard.where('cardNumber').equals(req.params.cardNumber).lean().exec((err, creditcard) => {
        if (err) {
            res.status(500).send('Error')
        } else if (creditcard) {
            res.status(200).json(creditcard)
        } else {
            res.status(400).send('Credit card not found')
        }
    })
})
router.get('/logs/:email', (req, res) => {
    Report.find({}).where('teamMember.email').equals(req.params.email).where('formType').equals('logs-report').exec((err, logs) => {
        if (err) {
            res.status(500).send('Error')
        } else {
            res.status(200).json(logs)
        }
    })
})
router.get('/employee/:email/avatar', (req, res) => {
    imageModel.findOne({teamMember: req.params.email}, (err, avi) => {
        if (err) {
            res.status(500).send('Server Error')
        } else if (avi) {
            res.status(200).json(avi)
        } else {
            res.status(200).json({error: "Item not found", status: 404})
        }
    })
})

router.post('/avatar/new', upload.single('avatar'), async (req, res) => {
    const { contentType, teamMember, name } = req.body
    /* var buff = Buffer.from(img.image).toString('base64')
    var imageUrl = "data:"+img.contentType+";base64,"+buff */
    var imagePath = path.join(__dirname + '/uploads/' + req.file.filename)
    await uploadAvatar(imagePath, teamMember, "users/"+teamMember+"/"+req.file.filename, contentType).then((downloadURL) => {
        res.send(downloadURL)
    })
})
router.post("/sendemail", upload.single('pdf'), async (req, res) => {
    var file = req.file
    const { customer, subject } = req.body
    
    var pdfAttachment = {
        filename: file.originalname,
        path: file.path,
        contentType: 'application/pdf'
    }
    await sendMail(customer, subject, pdfAttachment).then((msg) => {
        res.send(msg)
    })
})
router.post("/moisture-map/new",
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => duplicateJobIDCheck(value, req.body.ReportType)),
    check('notes').not().isEmpty().withMessage('Notes is required'), 
    createMoistureMap)
router.post("/sketch-report/new", 
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => duplicateJobIDCheck(value, req.body.ReportType)),
    check('sketch').not().isEmpty().withMessage('Sketch is required'),
    check('user').not().isEmpty().withMessage('Employee must be logged in'),
    createSketch);
router.post("/chart-report/new", 
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => duplicateJobIDCheck(value, req.body.ReportType)),
    check('chart').not().isEmpty().withMessage('Chart is required'),
    check('teamMember').not().isEmpty().withMessage('Employee must be logged in'),
    uploadChart)
router.post("/logs-report/new",
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => duplicateJobIDCheck(value, req.body.ReportType)),
    check('teamMember').not().isEmpty().withMessage('Employee must be logged in'),
    createLogs);
router.post("/logs-report/:formType/:JobId/update", updateLogs);
router.post("/dispatch/new",
    check('ReportType').not().isEmpty().withMessage('Report type is required'),
    body('emailAddress').isEmail().normalizeEmail().withMessage('Email needs to be formatted correctly'),
    body('teamMemberSig').not().isEmpty().withMessage('Signature is required'),
    body('JobId')
        .not().isEmpty().withMessage("Job id is required")
        .custom(value => duplicateJobIDCheck(value, "dispatch")),
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
    body('customerSig').not().isEmpty().withMessage('Customer signature is required'),
    body('JobId')
        .not().isEmpty().withMessage("Job id is required")
        .custom(value => duplicateJobIDCheck(value, "rapid-response")),
    createRapidResponse)
router.post("/case-report/new",
    check('JobId').not().isEmpty().withMessage('Job ID is required')
    .custom((value, {req}) => duplicateJobIDCheck(value, req.body.ReportType)),
    body('verifySig').not().isEmpty().withMessage('Signature is required'),
    check('id').not().isEmpty().withMessage('Team Lead ID is required'),
    createCaseFile)
router.post("/coc/new",
    check('JobId').not().isEmpty().withMessage("Job ID is required")
        .custom(value => duplicateJobIDCheck(value, "coc")),
    createCOC)
router.post("/aob/new",
    check('JobId').not().isEmpty().withMessage("Job ID is required")
    .custom(value => duplicateJobIDCheck(value, "aob")),
    createAOB)
router.post("/credit-card/new", [
    check('JobId').not().isEmpty().withMessage('Job id is required'),
    check('cardNumber', 'Card number is required')
], createCreditCard)
module.exports = router;