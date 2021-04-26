const admin = require('../firebase-service');

const createUser = async (req, res) => {
    const {
        email,
        password,
        fname,
        lname
    } = req.body;

    const user = await admin.auth().createUser({
        email,
        password,
        displayName: fname + ' ' + lname
    });

    return res.send(user);
}

module.exports = createUser