var http = require("http");
var os = require("os");

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Running " + process.title + " " + process.version + 
          " on " + os.type() +
          " release " + os.release() +
          " at " + os.hostname() + "\n");
});

server.listen(process.env.PORT || 8001);
