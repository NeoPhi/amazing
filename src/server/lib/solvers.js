var _ = require('underscore');

var solvers = {};

function register(name, ws, callback) {
  solvers[name] = ws;
  process.nextTick(callback);
}

function deregister(name, callback) {
  delete solvers[name];
  process.nextTick(callback);
}

function list(callback) {
  process.nextTick(function() {
    callback(null, _.keys(solvers));
  });
}

function solve(name, id, maze, callback) {
  if (!_.has(solvers, name)) {
    return process.nextTick(_.partial(callback, new Error(name + ' does not exist!')));
  }
  var ws = solvers[name];
  ws.send(JSON.stringify({
    id: id,
    maze: maze
  }), callback);
}

module.exports.register = register;
module.exports.deregister = deregister;
module.exports.list = list;
module.exports.solve = solve;
