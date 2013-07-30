var debug = require('debug')('register');
var path = require('path');
var _ = require('underscore');
var WebSocket = require('ws');

function throwOnError(err) {
  if (err) {
    throw err;
  }
}

function key(room) {
  return [room.x, room.y, room.z].join(',');
}

function equal(roomA, roomB) {
  return _.all(['x', 'y', 'z'], function(property) {
    return roomA[property] === roomB[property];
  });
}

function validNextRoom(room, nextRoom) {
  return _.any(room.exits, function(exit) {
    return equal(exit, nextRoom);
  });
}

if (process.argv.length < 4) {
  console.log('Usage: server solver.js');
  process.exit(1);
}

var server = process.argv[2];
var solverPath = process.argv[3];

var solverModule = require(path.resolve('./', solverPath));

// https://github.com/einaros/ws
var ws = new WebSocket(server);
ws.on('open', function() {
  debug('Registering %s', solverModule.name);
  ws.send(JSON.stringify({
    name: 'node:' + solverModule.name
  }), throwOnError);
});

function sendSolution(id, path) {
  debug('Solved');
  ws.send(JSON.stringify({
    id: id,
    path: path
  }), throwOnError);
}

ws.on('message', function(data) {
  debug('Solving');
  var message = JSON.parse(data);
  var maze = message.maze;
  var rooms = {};
  _.each(maze.rooms, function(room) {
    rooms[key(room)] = room;
  });
  var currentRoom = rooms[key(maze.start)];
  var solver = solverModule.create();
  var path = [currentRoom];
  while (!equal(currentRoom, maze.finish)) {
    var nextRoom = solver(currentRoom);
    if (!validNextRoom(currentRoom, nextRoom)) {
      return sendSolution(message.id, []);
    }
    path.push(nextRoom);
    currentRoom = rooms[key(nextRoom)];
  }
  sendSolution(message.id, path);
});
