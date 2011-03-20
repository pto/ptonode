var http = require("http");
var os = require("os");

var server = http.createServer(function (req, res) {
  var cpus = os.cpus();
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Running " + os.type() + " release " + os.release() +
          " on " + os.hostname() + " with " + cpus.length + " cpu" +
          (cpus.length != 1 ? "s" : "") + " of type " +
          cpus[0].model + " and speed " + cpus[0].speed + "\n");
});

server.listen(process.env.PORT || 8001);
