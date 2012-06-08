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
var URL = "http://" + HOST + ":" + PORT + "/";

server = http.createServer(function(req, res){
  var url = req.url;
  if (url == "/upload") {
    var form = new formidable.IncomingForm();
    form.encoding = "binary";
    var id, imagedata;
    form.on("field", function(name, val){
      if (name == "id") {
        id = val;
      } else if (name == "imagedata") {
        imagedata = val;
      }
    });
    form.on("end", function(){
      var md5sum = crypto.createHash("md5");
      md5sum.update(imagedata, "binary");
      var hash = md5sum.digest("hex");

      var dst_name = hash + ".png";
      var dst_path = "./image/" + dst_name; 
      fs.writeFile(dst_path, imagedata, "binary", function(err){
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
    form.parse(req);
  } else {
    var imagepath = "./image/" + path.basename(url);
    path.exists(imagepath, function(exists){
      if (exists) {
        res.writeHead(200, {"Content-Type": "image/png"});
        var input = fs.createReadStream(imagepath);
        input.pipe(res);
      } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("Not Found");
      }
    });
  }
});

server.listen(PORT);
console.log("Server running at " + URL);
