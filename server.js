
/**
 * Module dependencies.
 */

var express = require('express');
var util = require('util');

var app = module.exports = express.createServer();

// Data

var noteContents = "This is the default note.";
var noteLastModified = 1000;

// Configuration

app.configure(function(){
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

app.get('/note', function(req, res) {
  res.send(noteContents,
      {'Last-Modified': new Date(noteLastModified).toUTCString()}, 200);
});

app.post('/note', function(req, res) {
  noteContents = req.body.note;
  noteLastModified = new Date().getTime();
  res.send(200);
});

app.listen(process.env.PORT || process.env.C9_PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
