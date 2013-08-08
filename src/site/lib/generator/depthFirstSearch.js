var _ = require('underscore');

function validate(value, defaultValue) {
  var result = parseInt(value, 10);
  if (isNaN(result)) {
    return defaultValue;
  }
  if (result < 1) {
    return defaultValue;
  }
  return result;
}

function key(x, y, z) {
  return [x, y, z].join(',');
}

function visit(width, length, height, fn) {
  for (var x = 0; x < width; x += 1) {
    for (var y = 0; y < length; y += 1) {
      for (var z = 0; z < height; z += 1) {
        fn(x, y, z);
      }
    }
  }
}

function pickNeighbor(map, visited, current) {
  var x = current.x;
  var y = current.y;
  var z = current.z;
  var neighbors = [];
  _.each([{
    dx: -1,
    dy: 0,
    dz: 0
  }, {
    dx: 1,
    dy: 0,
    dz: 0
  }, {
    dx: 0,
    dy: -1,
    dz: 0
  }, {
    dx: 0,
    dy: 1,
    dz: 0
  }], function(offset) {
    var dx = offset.dx;
    var dy = offset.dy;
    var dz = offset.dz;
    var location = key(x + dx, y + dy, z + dz);
    if (_.has(map, location) && !visited[location]) {
      neighbors.push({
        x: x + dx,
        y: y + dy,
        z: z + dz
      });
    }
  });
  if (neighbors.length === 0) {
    return null;
  }
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

function generate(options, callback) {
  var width = validate(options.width, 10);
  var length = validate(options.length, 10);
  var height = 1;
  var map = {};
  visit(width, length, height, function(x, y, z) {
    map[key(x, y, z)] = {
      x: x,
      y: y,
      z: z,
      exits: []
    };
  });
  var stack = [];
  var current = {
    x: 0,
    y: 0,
    z: 0
  };
  var visited = {};
  var longest = [];
  do {
    var location = key(current.x, current.y, current.z);
    visited[location] = true;
    var neighbor = pickNeighbor(map, visited, current);
    if (neighbor) {
      map[location].exits.push(neighbor);
      map[key(neighbor.x, neighbor.y, neighbor.z)].exits.push(current);
      stack.push(JSON.parse(JSON.stringify(current)));
      current = neighbor;
    } else {
      stack.push(JSON.parse(JSON.stringify(current)));
      if (stack.length > longest.length) {
        longest = JSON.parse(JSON.stringify(stack));
      }
      stack.pop();
      current = stack.pop();
    }
  } while (stack.length > 0);
  process.nextTick(function() {
    callback(null, {
      start: longest[0],
      finish: longest[longest.length - 1],
      rooms: _.values(map)
    });
  });
}

module.exports.name = 'depthFirstSearch';
module.exports.generate = generate;
