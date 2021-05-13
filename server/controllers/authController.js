const admin = require('../firebase-service');

const createUser = async (req, res) => {
    const {
        email,
        password,
        name
    } = req.body;

    await admin.auth().createUser({
        email,
        password,
        displayName: name
    }).then((user) => {
        return res.json(user);
    }).catch((error) => {
        return res.json({error: error.message})
    })
}
const getEmployee = async (req, res) => {
    const email = req.body.email
    await admin.auth().getUserByEmail(email).then((userRecord) => {
        return res.json(userRecord.email)
    })
}

module.exports = { createUser, getEmployee }