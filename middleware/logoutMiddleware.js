

const logoutMiddleware = (req, res, next) => {
  
    res.clearCookie('token');
   
    res.redirect('/login');
  };
  
  module.exports = logoutMiddleware;
  