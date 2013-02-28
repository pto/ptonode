//
// Simple Node website
//
// Start up like this:
// 	 sudo PORT=80 NODE_ENV=production node server.js >>server.log 2>&1 &
//

var express = require('express');
var util = require('util');

var app = express();

// Configuration

app.configure(function(){
  app.use(function(req, res, next) {
    console.log('%s %s %s %s %s %s', new Date().toString(), req.method,
        req.headers.host, req.url, req.ip, req.headers['user-agent']);
    next();
  });
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Node Demo',
    node_version: process.versions.node,
    environment: app.settings.env,
    express_version: express.version
  });
});

var port = process.env.PORT || process.env.C9_PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
