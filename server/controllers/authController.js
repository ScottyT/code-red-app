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
        return res.send(user);
    }).catch((error) => {
        return res.json({error: error})
    })
}

module.exports = createUser