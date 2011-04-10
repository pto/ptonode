
/**
 * Module dependencies.
 */

var express = require('express'),
    io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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
    title: 'Express',
    env: process.env
  });
});

// Socket.IO

console.log('About to start Socket.IO');

var socket = io.listen(app);
socket.on('connection', function(client) {
  client.on('message', function(data) {
    client.send('Got your message: ' + data);
  });
}); 

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(process.env.PORT || 8000);
  console.log("Express server listening on port %d", app.address().port);
}
