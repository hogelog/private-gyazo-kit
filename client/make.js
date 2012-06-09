var
  fs = require("fs"),
  crypto = require("crypto"),
  path = require("path"),
  jsonconfig = require("jsonconfig"),
  crc = require("crc");

jsonconfig.load(["../gyazo.conf"], function(err){
  if (err) throw err;
});

var HOST = jsonconfig["host"];
var PORT = jsonconfig["port"];
var PATH = jsonconfig["path"];

function writeFile(dst, data, msg) {
  fs.writeFile(dst, data, function(err){
    if (err) throw err;
    console.log(msg);
  });
}

fs.readFile("gyazo.source", "utf-8", function(err, data){
  if (err) throw err;
  var script = data
    .replace("--HOST--", "\"" + HOST + "\"")
    .replace("--PORT--", PORT)
    .replace("--PATH--", "\"" + PATH + "\"");
  writeFile("../public/gyazo", script, "Gyazo-for-Linux: ../public/gyazo");
});

fs.readFile("gyazowin.source.exe", function(err, exe){
  if (err) throw err;
  exe.write(PATH+"\0", 0x6138, "ucs2");

  exe.write(HOST+"\0", 0x6208, "ucs2");

  exe.writeInt32LE(PORT, 0x62D8);
  exe.writeInt32LE(0, 0x62DC);

  writeFile("../public/gyazowin.exe", exe, "Gyazowin: ../public/gyazowin.exe");
});

fs.readFile("script.source", function(err, script){
  if (err) throw err;
  script.write("\"" + HOST + "\"", 0x1C, "utf-8");
  script.write(String(PORT), 0x88, "utf-8");
  script.write("\"" + PATH + "\"", 0x99, "utf-8");
  var sum = crc.buffer.crc32(script);
  fs.readFile("gyazomac.source.zip", function(err, zip){
    if (err) throw err;
    script.copy(zip, 0x61EFC);
    zip.writeInt32LE(sum, 0x61EAD);
    zip.writeInt32LE(sum, 0x62DFE);
    writeFile("../public/gyazomac.zip", zip, "Gyazo: ../public/gyazomac.zip");
  });
});


