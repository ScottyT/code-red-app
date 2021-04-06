const admin = require('../firebase-service');

const createUser = async (req, res) => {
    const {
        email,
        password,
        name
    } = req.body;

    const user = await admin.auth().createUser({
        email,
        password,
        displayName: name
    });

    return res.send(user);
}

module.exports = createUser