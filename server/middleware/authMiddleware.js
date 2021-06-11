const admin = require('../firebase-service');

/* const getAuthToken = (req, res, next) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.authorization.split(' ')[1];
      } else {
        req.authToken = null
      }
      next();
}; */

const checkIfAuthenticated = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const idtoken = req.headers.authorization.split(' ')[1];
    admin
        .auth()
        .verifyIdToken(idtoken).then(verifiedUser => {
          req.authId = verifiedUser.uid
          return next()
        }).catch(err => {
          console.log(err)
          return res.status(403).send('Could not decode token')
        })
    /* try {
      admin
        .auth()
        .verifyIdToken(authToken);
       req['currentUser'] = userInfo
    } catch (e) {
      console.log(e)
      return res
        .status(401)
        .send({ error: 'You are not authorized to make this request' });
    } */
  } else {
    return res.status(403).send("You are not authorized to view");
  }
};

module.exports = { checkIfAuthenticated }