var log = require("./log");
var path = require("path");
var fs = require("fs");

function bowerFile(name) {
  return JSON.stringify({
    name: name,
    version: "1.0.0",
    moduleType: ["node"],
    ignore: [
      "**/.*",
      "node_modules",
      "bower_components",
      "output"
    ]
  }, null, 2) + "\n";
}

var mainFile = [
  "module Main where",
  "",
  "import Debug.Trace",
  "",
  "main = do",
  "  trace \"Hello sailor!\""
].join("\n") + "\n";

var testFile = [
  "module Test.Main where",
  "",
  "import Debug.Trace",
  "",
  "main = do",
  "  trace \"You should add some tests.\""
].join("\n") + "\n";

function init(callback) {
  var name = path.basename(process.cwd());
  log.message("Generating project skeleton in", process.cwd());
  fs.writeFileSync(path.join(process.cwd(), "bower.json"), bowerFile(name), "utf-8");
  if (!fs.existsSync("src")) {
    fs.mkdirSync("src");
  }
  fs.writeFileSync(path.join(process.cwd(), "src", "Main.purs"), mainFile, "utf-8");
  if (!fs.existsSync("test")) {
    fs.mkdirSync("test");
  }
  fs.writeFileSync(path.join(process.cwd(), "test", "Main.purs"), testFile, "utf-8");
  callback();
}

module.exports = function(args, callback) {
  if (fs.existsSync(path.join(process.cwd(), "bower.json")) && !args.force) {
    callback(new Error("There's already a project here. Run `pulp init --force` if you're sure you want to overwrite it."));
  } else {
    init(callback);
  }
};
