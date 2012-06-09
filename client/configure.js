var
  fs = require("fs"),
  crypto = require("crypto"),
  path = require("path"),
  jsonconfig = require("jsonconfig");

jsonconfig.load(["../gyazo.conf"], function(err){
  if (err) throw err;
});

var HOST = jsonconfig["host"];
var PORT = jsonconfig["port"];
var PATH = jsonconfig["path"];

function configure(src, dst, msg) {
  fs.readFile(src, "utf-8", function(err, data){
    if (err) throw err;
    var script = data
      .replace("--HOST--", "\"" + HOST + "\"")
      .replace("--PORT--", PORT)
      .replace("--PATH--", "\"" + PATH + "\"");
    fs.writeFile(dst, script, function(err){
      if (err) throw err;
      console.log(msg);
    });
  });
}

configure(
  "Gyazo-for-Linux/gyazo.source",
  "Gyazo-for-Linux/gyazo",
  "configure Gyazo-for-Linux");

configure(
  "Gyazo/Gyazo.app/Contents/Resources/script.source",
  "Gyazo/Gyazo.app/Contents/Resources/script",
  "configure Gyazo");

fs.readFile("Gyazowin/gyazowin.source.exe", function(err, data){
  if (err) throw err;
  var path_buf = new Buffer(PATH, "ucs2");
  path_buf.copy(data, 0x6138, 0);
  data[0x6138 + path_buf.length] = 0;

  var host_buf = new Buffer(HOST, "ucs2");
  host_buf.copy(data, 0x6208, 0);
  data[0x6208 + host_buf.length] = 0;

  data.writeInt32LE(PORT, 0x62D8);
  data.writeInt32LE(0, 0x62DC);

  fs.writeFile("Gyazowin/gyazowin.exe", data, function(err){
    if (err) throw err;
    console.log("configure Gyazowin");
  });
});
