var _ = require('underscore');

function WallFollower() {
}

WallFollower.prototype.next = function(room) {
  // TODO: Implement algorithm
  return null;
};

function create() {
  return new WallFollower();
}

module.exports.name = 'wallFollower';
module.exports.create = create;
