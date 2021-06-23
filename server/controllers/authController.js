const admin = require('../firebase-service');
const bucket = admin.storage().bucket('code-red-employees');

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
const uploadAvatar = async (avatar, teamMember, type, filename) => {
    var uid = ""  
    var img = {
        image: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: req.body.contentType
    }
    //const { contentType, teamMember, name } = req.body
    var buff = Buffer.from(avatar.image).toString('base64')
    var imageUrl = "data:"+type+";base64,"+buff
    console.log(img)

    /* await getEmployee(teamMember).then((user) => {
        uid = user.uid
    })

    await bucket.upload(imageUrl, {
        destination: filename
    });
    console.log(`${imageUrl} uploaded to bucket ${bucket} `) */
       
    /* await admin.auth().updateUser(uid, {
        photoURL: imageUrl
    }).then((userRecord) => {
        //return res.json({error: false, message: "Avatar has been uploaded!", data: userRecord.photoURL})
        return userRecord
    }) */
}

module.exports = { createUser, updateUser, fetchUser, uploadAvatar }