
// Module dependencies
var express = require('express');

// this is just like doing: var routes = require('./routes/index.js')
var routes = require('./routes');
var http = require('http');
var path = require('path');
var RedisStore = require('connect-redis')(express);

// Let's group our tools together
var tools = require('./tools.js');

// Middleware are awesome, they able you to do a lt of things easily
var mid = require('./middlewares.js');

// Initialisation of Express
var app = express();

// Setup the option for the redisStore in which are saved the sessions
var redisOptions = {
    prefix: 'myfirstapp:',
    host: process.env.DOTCLOUD_REDIS_REDIS_HOST || '127.0.0.1',
    port: process.env.DOTCLOUD_REDIS_REDIS_PORT || 6379,
    pass: process.env.DOTCLOUD_REDIS_REDIS_PASSWORD || null
};


// Express configuration
app.configure(function(){
  // Setup the port from the UNIX environement with a fallback , practical for dev and prod
  app.set('port', process.env.WWW_PORT || 8080);
  
  app.set('views', __dirname + '/views');

  // Choose you template engine, have a look at express doc for ejs, haml, and html
  app.set('view engine', 'jade');

  // Setup the favicon, if no path given a default favicon is used
  app.use(express.favicon());

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // Setup a session store in redis, if you ever want to scale this will be needed
  app.use(express.cookieParser('My First Express App'));
  app.use(express.session({ store: new RedisStore(redisOptions) }));


  app.use(express.static(path.join(__dirname, 'public')));
  
  /* 
    Locals are super usefull they enable you to pass a value to all you templates.
    This is super usefull for certain scenario like always giving the session.
    Or like in this case the page we are on for the menu 
  */
  app.use(function(req, res, next){
    // Let's give the requested page to the layout template to selected the right menu li as active
    res.locals.page = req._parsedUrl.pathname;

    // This can also be used to handle errors
    if (req.session.error) {
      res.locals.error = req.session.error;
      delete req.session.error;
    }
    else
      res.locals.error = undefined;

    // Something you may want to do
    // res.locals.session = req.session;
    // instead of passing {session: req.session} in every routes. Nice right ?
    // if you do this way you can make routes in routes/index.js less verbose
    // for example line 21 in routes/index.js would become:
    // res.render('welcome', { title: 'Welcome'});

    next();
  });
  
  app.use(app.router);

});

app.configure('development', function(){
  app.use(express.errorHandler());
});



/*
    This route is the default one, the one you hit when to arrive directly on the server.
    It is "protected" by the session middleware to force the user to authenticate.
    routes.index in the exported route called index in the module route,
    here the module route is defined in routes/index.js.
*/
app.get('/', mid.auth, routes.index);

// Actually let's have a polite url, by redirecting you to /Welcome, it looks nicer
app.get('/welcome', mid.auth, routes.welcome);

// A non protected route where to redirect the user to he can enter his email addresse
app.get('/who-are-you', routes.login);
app.get('/tes', routes.tes);
// Handle the authentication
app.post('/init-session', routes.initSession);

// An admin page complety hardcoded ?
app.get('/admin', mid.auth, mid.admin, routes.admin);

//air plane handle
app.get('/airplane', routes.airplane);
// Start the Express server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
//search plane
var getContent = function(req,res,next) {
  var content = '';
  // Here we spawn a phantom.js process, the first element of the 
  // array is our phantomjs script and the second element is our url 
  var types=req.params.types;
  var fx=req.params.fx;
  var depart=req.params.depart;
  var departname=req.params.departname;
  var arrive=req.params.arrive;
  var arrivename=req.params.arrivename;
  var oridate=req.params.oridate;
  var retdate=req.params.retdate;
  var adult=req.params.adult;
  var children=req.params.children;
  var baby=req.params.baby;
  var phantom = require('child_process').spawn('casperjs', ['casper.js',types,fx,depart,departname,arrive,arrivename,oridate,retdate
    ,adult,children,baby]);
  phantom.stdout.setEncoding('utf8');
  // Our phantom.js script is simply logging the output and
  // we access it here through stdout
  phantom.stdout.on('data', function(data) {
    content += data.toString();
  });
  phantom.on('exit', function(code) {
    if (code !== 0) {
      console.log('We have an error');
    } else {
      req.result = JSON.stringify(JSON.parse(content));
      next();
    }
  });
};
app.get('/searchplane/:types/:fx/:depart/:departname/:arrive/:arrivename/:oridate/:retdate/:adult/:children/:baby', getContent, function(req, res){
  res.send(req.result);
});
//socket.io

