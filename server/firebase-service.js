const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://code-red-app-313517.firebaseio.com'
});

module.exports = admin