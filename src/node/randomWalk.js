var _ = require('underscore');

function create() {
  return function(room) {
    return _.shuffle(room.exits)[0];
  };
}

module.exports.name = 'randomWalk';
module.exports.create = create;
