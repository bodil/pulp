var exec = require("./exec");
var log = require("./log");
var files = require("./files");

module.exports = function(pro, args, callback) {
  log.message("Building project in", process.cwd());
  exec.pscMake([files.src, files.deps], ["--output", args.buildPath], null, function(err, rv) {
    if (err) return callback(err);
    log.message("Build successful.");
    callback(null);
  });
};
