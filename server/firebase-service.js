const admin = require('firebase-admin');
const serviceAccount = require('./code-red.json')
admin.initializeApp({
    //Used for production
    //credential: admin.credential.applicationDefault(),
    //Used for dev
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://code-red-app-313517.firebaseio.com',
    storageBucket: process.env.BUCKET_URL
});

module.exports = admin