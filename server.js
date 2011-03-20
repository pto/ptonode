var http = require("http");
var os = require("os");
var util = require("util");

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.write("Running " + process.title + " " + process.version + 
          " on " + os.type() +
          " release " + os.release() +
          " at " + os.hostname() + "\n\n");
  res.write("Process: " + util.inspect(process));
  res.end();
});

server.listen(process.env.PORT || 8001);
