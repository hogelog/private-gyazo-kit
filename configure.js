var
  fs = require("fs"),
  crypto = require("crypto"),
  path = require("path"),
  jsonconfig = require("jsonconfig");

jsonconfig.load(["./gyazo.conf"], function(err){
  if (err) throw err;
});

var HOST = "\"" + jsonconfig["host"] + "\"";
var PORT = jsonconfig["port"];
var PATH = "\"" + jsonconfig["path"] + "\"";

function configure(src, dst, msg) {
  fs.readFile(src, "utf-8", function(err, data){
    if (err) throw err;
    var script = data
      .replace("--HOST--", HOST)
      .replace("--PORT--", PORT)
      .replace("--PATH--", PATH);
    fs.writeFile(dst, script, function(err){
      if (err) throw err;
      console.log(msg);
    });
  });
}

configure(
  "client/Gyazowin/gyazowin/config.source.h",
  "client/Gyazowin/gyazowin/config.h",
  "configure client/Gyazowin");

configure(
  "client/Gyazo-for-Linux/gyazo.source",
  "client/Gyazo-for-Linux/gyazo",
  "configure client/Gyazo-for-Linux");

configure(
  "client/Gyazo/Gyazo.app/Contents/Resources/script.source",
  "client/Gyazo/Gyazo.app/Contents/Resources/script",
  "configure client/Gyazo");
