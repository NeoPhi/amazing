var _ = require('underscore');

function RandomWalker() {
  this.nextCalls = 0;
}

RandomWalker.prototype.next = function(room) {
  this.nextCalls += 1;
  return _.shuffle(room.exits)[0];  
};

function create() {
  return new RandomWalker();
}

module.exports.name = 'randomWalk';
module.exports.create = create;
