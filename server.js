var http = require("http");
var os = require("os");
var util = require("util");

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.write("Running node " + process.version + 
          " on " + os.type() + " " + os.release() +
          " at " + os.hostname() + "\n");
  res.end();
});

server.listen(process.env.PORT || 8001);
