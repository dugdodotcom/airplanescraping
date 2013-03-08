var tools = require('./lib/tools.js');

/*
    This middleware will force the visitor to authenticate,
    which here mean enter his email address.
*/    
exports.auth = function(req, res, next) {
  if(req.session && req.session.email) {
    next();
  }
  else {
    res.redirect('/who-are-you');
  }
  
}

/*
    You can only access the admin page if you know the "secret URL".
    This is a quite unsecure way to do an admin page, but this one does not anything any way :D.
    This is just to show you how you can chain middlewares
*/
exports.admin = function(req, res, next) {
  if(req.query && req.query.pass && req.query.pass === '42')
    next();
  else{
    res.status(403);
    res.render('adminFail', {title: 'authentication faillure'});
  }
}