const admin = require('../firebase-service');

const getAuthToken = (req, res, next) => {
      if (req.body.token) {
        req.authToken = req.body.token;
      } else {
        req.authToken = null;
      }
      next();
};

const checkIfAuthenticated = (req, res, next) => {
  
    /* getAuthToken(req, res, async () => {
       try {
         const { authToken } = req;
         await admin
           .auth()
           .verifyIdToken(authToken).then((decodedToken) => {
             console.log(decodedToken)
             res.setHeader('authorization', `Bearer ${decodedToken.uid}`)
             res.send({status: 'Ok'})
           })
         return next();
       } catch (e) {
         return res
           .status(401)
           .send({ error: 'You are not authorized to make this request' });
       }
    }); */
};

module.exports = { getAuthToken, checkIfAuthenticated }