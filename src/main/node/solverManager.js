var path = require('path');
var _ = require('underscore');
var WebSocket = require('ws');

if (process.argv.length < 4) {
  console.log('Usage: serverURL solver.js');
  process.exit(1);
}

function throwOnError(err) {
  if (err) {
    throw err;
  }
}

var serverURL = process.argv[2];
var solverPath = process.argv[3];
var solverModule = require(path.resolve('./', solverPath));

// https://github.com/einaros/ws
var ws = new WebSocket(serverURL);
ws.on('open', function() {
  console.log('Registering: %s', solverModule.name);
  ws.send(JSON.stringify({
    action: 'solver.register',
    name: 'node:' + solverModule.name
  }), throwOnError);
});

var solvers = {};

function sendResponse(response) {
  var json = JSON.stringify(response);
  console.log('Response: %s', json);
  ws.send(json, throwOnError);
}

function sendError(id, message) {
  sendResponse({
    action: 'error',
    id: id,
    message: message
  });
}

var actionHandlers = {
  create: function(message) {
    var id = message.id;
    if (_.has(solvers, id)) {
      return sendError(id, 'Solver already created: ' + id);
    }
    solvers[id] = solverModule.create();
    sendResponse({
      action: 'created',
      id: id
    });
  },
  next: function(message) {
    var id = message.id;
    if (!_.has(solvers, id)) {
      return sendError(id, 'Solver does not exist: ' + id);
    }
    var exit = solvers[id].next(message.room);
    sendResponse({
      action: 'next',
      id: id,
      location: exit
    });
  },
  destroy: function(message) {
    var id = message.id;
    if (!_.has(solvers, id)) {
      return sendError(id, 'Solver does not exist: ' + id);
    }
    delete solvers[id];
    sendResponse({
      action: 'destroyed',
      id: id
    });
  }
};

ws.on('message', function(data) {
  console.log('Request: %s', data);
  var message = JSON.parse(data);
  if (_.isUndefined(message.id)) {
    throwOnError(new Error('No message id'));
  } else if (_.has(actionHandlers, message.action)) {
    actionHandlers[message.action](message);
  } else {
    sendError(message.id, 'Unrecognized action: ' + message.action);
  }
});
