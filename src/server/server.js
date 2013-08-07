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

app.use(express.favicon(path.join('src', 'static', 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());

app.set('views', path.join('src', 'views'));
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

app.use(express.static(path.join('src', 'static')));

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

app.post('/solvers/:name', function(req, res, next) {
  var name = req.params.name;
  var maze = JSON.parse(req.body.maze);
  var id = uuid.v4();
  solvers.solve(name, id, maze, function(err) {
    if (err) {
      return next(err);
    }
    pending[id] = res;
  });
});

var server = http.createServer(app);
server.listen(port, function(err) {
  throwOnError(err);
  debug('Listening on port %d', port);
});

var wss = new ws.Server({
  server: server
});
wss.on('connection', function(ws) {
  debug('New web socket');
  var name;
  ws.on('message', function(data) {
    var message = JSON.parse(data);
    if (message.name) {
      name = message.name;
      debug('Registered solver %s', name);
      solvers.register(name, ws, throwOnError);
    } else if (message.id) {
      var id = message.id;
      var path = message.path;
      if (pending[id]) {
        pending[id].json(path);
        delete pending[id];        
      }
    }
  });
  ws.on('close', function() {
    if (name) {
      debug('Deregistered solver %s', name);
      solvers.deregister(name, throwOnError);
    }
  });
});
