var
  http = require("http"),
  formidable = require("formidable"),
  fs = require("fs"),
  crypto = require("crypto"),
  path = require("path"),
  jsonconfig = require("jsonconfig");

jsonconfig.load(["./gyazo.conf"], function(err){
  if (err) throw err;
});
var HOST = jsonconfig["host"];
var PORT = jsonconfig["port"];
var PATH = jsonconfig["path"];
var URL = "http://" + HOST + ":" + PORT + "/";

function connectFile(path, res) {
  var input = fs.createReadStream(path);
  input.pipe(res);
}

function notfound(res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end("Not Found");
}

server = http.createServer(function(req, res){
  var url = req.url;

  if (url == PATH) {
    // upload
    var form = new formidable.IncomingForm();
    form.encoding = "binary";
    var md5sum = crypto.createHash("md5");
    var id, imagedata;
    form
      .on("field", function(name, val){
        if (name == "id") {
          id = val;
        }
      })
      .on("file", function(name, file){
        if (name == "imagedata") {
          fs.readFile(file.path, function(err, data){
            if (err) console.log(err);
            imagedata = data;
            md5sum.update(imagedata, "binary");
            var hash = md5sum.digest("hex");
            var dst_name = hash + ".png";
            var dst_path = "./image/" + dst_name;
            fs.rename(file.path, dst_path, function(err){
              if (err) {
                res.writeHead(500, {"Content-Type": "text/plain"})
                res.end("cannot write uploaded data");
              } else {
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(URL + dst_name);
                console.log("uploaded " + dst_name);
              }
            });
          });
        }
      });
    form.parse(req);
  } else if (url.indexOf(".png") == 32) {
    // publish image
    var imagepath = "./image/" + path.basename(url);
    path.exists(imagepath, function(exists){
      if (exists) {
        res.writeHead(200, {"Content-Type": "image/png"});
        connectFile(imagepath, res);
      } else {
        notfound(res);
      }
    });
  } else if (url == "/") {
    // publish download page
    res.writeHead(200, {"Content-Type": "text/html"});
    connectFile("./public/index.html", res);
  } else {
    // publish client
    var filepath = "./public/" + path.basename(url);
    path.exists(filepath, function(exists){
      if (exists) {
        res.writeHead(200, {"Content-Type": "application/octet-stream"});
        connectFile(filepath, res);
      } else {
        notfound(res);
      }
    });
  }
});

server.listen(PORT);
console.log("Server running at " + URL);
