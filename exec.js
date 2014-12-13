var files = require("./files");
var child = require("child_process");
var glob = require("glob");
var fs = require("fs");
var path = require("path");
var q = require("q");

var bin = path.join('node_modules', '.bin');

function exec(cmd, quiet, args, env, callback) {
  var output = q.defer();
  var c = child.spawn(cmd, args, {
    stdio: [process.stdin, quiet ? "pipe" : process.stdout, process.stderr],
    env: env
  }).on("exit", function(code, signal) {
    if (code > 0) {
      if (quiet) {
        output.promise.then(function(buf) {
          process.stderr.write(buf.toString("utf-8"));
          callback(new Error("Subcommand terminated with error code " + code), code);
        });
      } else {
        callback(new Error("Subcommand terminated with error code " + code), code);
      }
    } else {
      if (quiet) {
        output.promise.then(function(r) {
          callback(null, r.toString("utf-8"));
        });
      } else {
        callback(null);
      }
    }
  }).on("error", function(err) {
    if (err.code === "ENOENT") {
      callback(new Error("`" + cmd + "` executable not found."));
    }
  });
  if (quiet) {
    c.stdout.pipe(require("concat-stream")(function(data) {
      output.resolve(data);
    }));
  }
}

function invokeCompiler(cmd, quiet, deps, args, env, callback) {
  files.resolve(deps, function(err, deps) {
    if (err) {
      callback(err);
    } else {
      var local = path.join(bin, cmd);
      fs.exists(local, function(exists) {
        exec(exists ? local : cmd, quiet, args.concat(deps), env, callback);
      });
    }
  });
}

module.exports.bin = bin;
module.exports.exec = exec;
module.exports.invokeCompiler = invokeCompiler;
module.exports.psc = invokeCompiler.bind(null, "psc", true);
module.exports.pscMake = invokeCompiler.bind(null, "psc-make", true);
