var _ = require('underscore');

var generators = {};

function register(name, fn, callback) {
  if (_.has(generators, name)) {
    return process.nextTick(function() {
      callback(new Error(name + ' already registered!'));
    });
  }
  generators[name] = fn;
  process.nextTick(callback);
}

function list(callback) {
  process.nextTick(function() {
    callback(null, _.keys(generators));
  });
}

function generate(name, options, callback) {
  if (!_.has(generators, name)) {
    return process.nextTick(function() {
      callback(new Error(name + ' does not exist!'));
    });
  }
  generators[name](options, callback);
}

module.exports.register = register;
module.exports.list = list;
module.exports.generate = generate;
