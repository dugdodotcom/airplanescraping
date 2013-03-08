var tools = require('../lib/tools.js');

var redisConfig = {
    host: process.env.DOTCLOUD_REDIS_REDIS_HOST || '127.0.0.1',
    port: process.env.DOTCLOUD_REDIS_REDIS_PORT || 6379,
    pass: process.env.DOTCLOUD_REDIS_REDIS_PASSWORD || null
};

// Never trust your users, this modules is great for protecting yourself
var check = require('validator').check;
var sanitize = require('validator').sanitize;

// Let's add some fun into this
var gravatar = require('../lib/gravatar.js').avatar;

// Redis client use for the admin page
var red = require('redis').createClient(redisConfig.port, redisConfig.host);

redisConfig.pass && 
    red.auth(redisConfig.pass, function(err) {
        if (err)
            throw err;
    });

// Root route :D
exports.index = function(req, res){
  res.redirect('/welcome');
};

// Home page
exports.welcome = function(req, res){
  res.render('welcome', { title: 'Welcome', session: req.session });
};

// Login form
exports.login = function(req, res){
  res.render('login', { title: 'Enter your email', session: req.session });
}

// Process auth
exports.initSession = function(req, res){

  // If the session is empty let's init one with an empty array
  if (!req.session) {
    req.session = {};
  }

  // let's log what the user sent us
  tools.log(req.body);

  // check if an email is given
  if(!req.body || !req.body.email) {
    req.session.error = "No email address given";
    res.redirect('/who-are-you');
    return;
  }

  // clean the email from XSS exploits
  var email = sanitize(req.body.email).trim();
  email = sanitize(email).xss();

  // is this a valid email ?
  try{
    check(email).len(6).isEmail();
  }
  catch(e) {
    req.session.error = "The given email address does not seems to be correct!";
    res.redirect('/who-are-you');
    return;
  }

  req.session.email = req.body.email;
  req.session.gravatar = gravatar(req.body.email , 300);
  
  res.redirect('/welcome');
}


// admin page
exports.admin = function(req, res){
  red.keys('myfirstapp:' + '*', function(err, sessionKeys) {
      if (err) throw err;
      red.mget(sessionKeys, function (error, data){

        // the redis result is an array of JSON string, let's get the object from the strings
        var d = data.map(JSON.parse);
        res.render('admin', {title: 'Super secret admin page :D', users: d})
      })
  });
}
