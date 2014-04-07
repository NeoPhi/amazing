var debug = require('debug')('server');
var ws = require('ws');
var express = require('express');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var uuid = require('uuid');
var os = require('os');

function throwOnError(err) {
  if (err) {
    throw err;
  }
}

function warnOnError(err) {
  if (err) {
    warn(err);
  }
}

var generators = require('./lib/generators');
var dfs = require('./lib/generator/depthFirstSearch');
generators.register(dfs.name, dfs.generate, throwOnError);

var solvers = require('./lib/solvers');

var app = express();
var port = process.env.PORT || 3000;

function getAddress() {
  var interfaces = os.networkInterfaces();
  var results = [];
  _.each(interfaces, function(addresses, name) {
    _.each(addresses, function(address) {
      if ((address.family === 'IPv4') && (!address.internal)) {
        results.push(address.address);
      }
    });
  });
  return results[0];
}
var address = getAddress();

app.use(express.favicon(path.join('src', 'site', 'static', 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());

app.set('views', path.join('src', 'site', 'views'));
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

app.use(express.static(path.join('src', 'site', 'static')));

app.get('/', function(req, res) {
  res.render('home', {
    address: address,
    port: port
  });
});

app.get('/generators/', function(req, res, next) {
  generators.list(function(err, names) {
    if (err) {
      return next(err);
    }
    res.json(names);
  });
});

app.get('/generators/:name', function(req, res, next) {
  var name = req.params.name;
  var options = req.query;
  generators.generate(name, options, function(err, maze) {
    if (err) {
      return next(err);
    }
    res.json(maze);
  });
});

app.get('/solvers/', function(req, res, next) {
  solvers.list(function(err, names) {
    if (err) {
      return next(err);
    }
    res.json(names);
  });
});

var pending = {};

function createSolverCallback(id, res, next) {
  pending[id] = res;
  return function(err) {
    if (err) {
      delete pending[id];
      next(err);
    }
  };
}

app.post('/solvers/:name', function(req, res, next) {
  var name = req.params.name;
  var id = uuid.v4();
  solvers.create(name, id, createSolverCallback(id, res, next));
});

app.put('/solvers/:name/:id', function(req, res, next) {
  var name = req.params.name;
  var id = req.params.id;
  var room = JSON.parse(req.body.room);
  if (_.has(pending, id)) {
    return next(new Error('Action already pending.'));
  }
  solvers.next(name, id, room, createSolverCallback(id, res, next));
});

app.del('/solvers/:name/:id', function(req, res, next) {
  var name = req.params.name;
  var id = req.params.id;
  if (_.has(pending, id)) {
    return next(new Error('Action already pending.'));
  }
  solvers.destroy(name, id, createSolverCallback(id, res, next));
});

var server = http.createServer(app);
server.listen(port, function(err) {
  throwOnError(err);
  debug('Listening on port %d', port);
});

var wss = new ws.Server({
  server: server
});
var clientCount = 0;
wss.on('connection', function(ws) {
  debug('New web socket');
  var name;
  ws.on('message', function(data) {
    var message = JSON.parse(data);
    if (message.action === 'solver.register') {
      name = clientCount + ": " + message.name;
      clientCount += 1;
      debug('Registering solver %s', name);
      solvers.register(name, ws, warnOnError);
    } else if (!name) {
      warn('Message from unregistered solver');
    } else {
      var id = message.id;
      pending[id].json(message);
      delete pending[id];
    }
  });
  ws.on('close', function() {
    if (name) {
      debug('Deregistering solver %s', name);
      solvers.deregister(name, warnOnError);
    }
  });
});
