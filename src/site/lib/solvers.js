var _ = require('underscore');

var solvers = {};

function validSolver(name, callback) {
  if (!_.has(solvers, name)) {
    process.nextTick(_.partial(callback, new Error(name + ' does not exist!')));
    return false;
  }
  return true;
}

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

function create(name, id, callback) {
  if (!validSolver(name)) {
    return;
  }
  solvers[name].send(JSON.stringify({
    action: 'create',
    id: id
  }), callback);
}

function next(name, id, room, callback) {
  if (!validSolver(name)) {
    return;
  }
  solvers[name].send(JSON.stringify({
    action: 'next',
    id: id,
    room: room
  }), callback);
}

function destroy(name, id, callback) {
  if (!validSolver(name)) {
    return;
  }
  solvers[name].send(JSON.stringify({
    action: 'destroy',
    id: id
  }), callback);
}

module.exports.register = register;
module.exports.deregister = deregister;
module.exports.list = list;
module.exports.create = create;
module.exports.next = next;
module.exports.destroy = destroy;
