var http = require("http");
var os = require("os");

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Running node " + process.versions.node + " on " + os.type() +
          " release " + os.release() +
          " on " + os.hostname() + "\n");
});

server.listen(process.env.PORT || 8001);
