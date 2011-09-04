var http = require('http');
var server = new http.Server();

server.on('request', function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Yes, this server is running.');
});

server.listen(process.env.PORT || 8000);
