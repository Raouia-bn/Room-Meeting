const jwt = require('jsonwebtoken');
const requireAuth = (req,res,next) =>{
  const token = req.header('Authorization');
  if(!token || !token.startsWith('Bearer ')){
      return res.status(401).send('Authentication failed:invalid token ')
  }
  try {
      const tokenData = token.split(' ')[1];
      const decodedToken = jwt.verify(tokenData,process.env.JWT_SECRET);
      req.userId=decodedToken._id;
      next();
  } catch (error) {
      return res.status(401).send('Authentication failed:invalid token ')

  }
}
module.exports = requireAuth;
