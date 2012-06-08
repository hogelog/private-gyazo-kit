var
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

var gyazowin_header =
  "#define GYAZO_HOST \"" + HOST + "\"\n" +
  "#define GYAZO_PORT " + PORT + "\n" +
  "#define GYAZO_PATH \"" + PATH + "\"\n";

fs.writeFile("client/Gyazowin/gyazowin/config.h", gyazowin_header, function(err){
  if (err) throw err;
  console.log("configure client/Gyazowin");
});

var ruby_config = 
  "class GyazoConfig\n" +
    "def self.host;\"" + HOST + "\";end\n" +
    "def self.port;" + PORT + ";end\n" +
    "def self.PATH;\"" + PATH + "\";end\n" +
  "end";

fs.writeFile("client/Gyazo-for-Linux/config.rb", ruby_config, function(err){
  if (err) throw err;
  console.log("configure client/Gyazo-for-Linux");
});

fs.writeFile("client/Gyazo/Gyazo.app/Contents/Resources/config.rb", ruby_config, function(err){
  if (err) throw err;
  console.log("configure client/Gyazo");
});
