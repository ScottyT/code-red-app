const admin = require('../firebase-service');
const bucket = admin.storage().bucket('code-red-employees');
const { v4: uuidv4 } = require("uuid");

const getEmployee = async (email) => {
    var user = {}
    await admin.auth().getUserByEmail(email).then((userRecord) => {
        user = userRecord
    }).catch((err) => {
        console.error(err)
    })
    return user
}

const fetchUser = async (req, res) => {
    await getEmployee(req.params.email).then((userRecord) => {
        return res.json({error: false, message: "Found user", data: userRecord})
    }).catch((err) => {
        return res.json({error: true, message: err})
    })
}
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
const updateUser = async (req,res) => {
    const { name, email } = req.body;
    var uid = ""
    await getEmployee(req.params.email).then((user) => {
        uid = user.uid
    })
    await admin.auth().updateUser(uid, {
        displayName: name
    }).then((user) => {
        return res.json({error: false, message: "Updated user!", data: user})
    })
}
const uploadAvatar = async (filepath, teamMember, remotepath, type) => {
    let uuid = uuidv4()
    var uid = ""
    await getEmployee(teamMember).then((user) => {
        uid = user.uid
    })
    return admin.storage().bucket('code-red-employees').upload(filepath, {
        destination: remotepath,
        uploadType: "media",
        metadata: {
            contentType: type,
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        }
    }).then((data) => {
        var file = data[0]
        var downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
        admin.auth().updateUser(uid, {
            photoURL: downloadUrl
        })
        return Promise.resolve(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

module.exports = { createUser, updateUser, fetchUser, uploadAvatar }