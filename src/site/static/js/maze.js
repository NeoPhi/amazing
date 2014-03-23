// TODO: NEEDS MAJOR REFACTORING
// Solver management is too tied to visual upkeep
// Need to introduce WS to handle being notified of solvers going away
// Break up into multiple files
// Reset solver state when new maze is generated
(function() {
  var Color = net.brehaut.Color;
  var WHITE = Color('#FFFFFF');
  var currentMaze;
  var solvers = {};
  var locations = {};

  function randomColor() {
    return Color({
      hue: Math.floor(Math.random() * 360),
      saturation: Math.random(),
      value: Math.random()
    });
  }

  function updateLocation(location) {
    var currentColor = WHITE;
    _.each(locations[location], function(color) {
      currentColor = currentColor.blend(color, 0.5);
    });
    $('#' + location.replace(/,/g, '_')).css('backgroundColor', currentColor.toCSS());
  }

  function addToLocation(id) {
    var location = solvers[id].location;
    if (!_.has(locations, location)) {
      locations[location] = {};
    }
    locations[location][id] = solvers[id].color;
    updateLocation(location);
  }

  function removeFromLocation(id) {
    var location = solvers[id].location;
    delete locations[location][id];
    updateLocation(location);
  }

  function key(x, y, z) {
    return [x, y, z].join(',');
  }

  function resetAll() {
    currentMaze = null;
    $('#maze').html('Generating...');
  }

  function borders(room, rooms) {
    var classes = [];
    _.each([{
      dx: -1,
      dy: 0,
      dz: 0,
      name: 'left'
    }, {
      dx: 1,
      dy: 0,
      dz: 0,
      name: 'right'
    }, {
      dx: 0,
      dy: -1,
      dz: 0,
      name: 'top'
    }, {
      dx: 0,
      dy: 1,
      dz: 0,
      name: 'bottom'
    }], function(offset) {
      var dx = offset.dx;
      var dy = offset.dy;
      var dz = offset.dz;
      var name = offset.name;
      var location = key(room.x + dx, room.y + dy, room.z + dz);
      var exits = {};
      _.each(room.exits, function(exit) {
        exits[key(exit.x, exit.y, exit.z)] = exit;
      });
      if (!_.has(rooms, location) || !_.has(exits, location)) {
        classes.push(name);
      }
    });
    return classes.join(' ');
  }

  function draw(maze) {
    var width = 0;
    var length = 0;
    var rooms = {};
    _.each(maze.rooms, function(room) {
      rooms[key(room.x, room.y, room.z)] = room;
      if (room.x > width) {
        width = room.x;
      }
      if (room.y > length) {
        length = room.y;
      }
    });
    var start = key(maze.start.x, maze.start.y, maze.start.z);
    var finish = key(maze.finish.x, maze.finish.y, maze.finish.z);
    var html = [];
    html.push('<table width="'+ ((width + 1) * 20) + '">');
    for (var y = 0; y <= length; y += 1) {
      html.push('<tr>');
      for (var x = 0; x <= width; x += 1) {
        var location = key(x, y, 0);
        var room = rooms[location];
        var classes = borders(room, rooms);
        html.push('<td id="' + location.replace(/,/g, '_') + '" class="' + classes + '">');
        if (location === start) {
          html.push('S');
        } else if (location === finish) {
          html.push('F');
        } else {
          html.push('&nbsp;');
        }
        html.push('</td>');
      }
      html.push('</tr>');
    }
    html.push('</table>');
    $('#maze').html(html.join(''));
  }

  function generate(name, width, length) {
    $.ajax({
      dataType: 'json',
      url: '/generators/' + name + '?width=' + width + '&length=' + length,
      success: function(maze) {
        currentMaze = maze;
        var roomLookup = {};
        _.each(maze.rooms, function(room) {
          roomLookup[key(room.x, room.y, room.z)] = room;
        });
        currentMaze.roomLookup = roomLookup;
        draw(maze);
      }
    });
  }

  function destroy(id, callback) {
    var solver = solvers[id];
    $.ajax({
      type: 'DELETE',
      dataType: 'json',
      data: {},
      url: '/solvers/' + solver.name + '/' + id,
      success: function(message) {
        if (message.action !== 'destroyed') {
          console.log(message);
          return;
        }
        removeFromLocation(id);
        if (callback) {
          callback();
        }
      }
    });
  }

  function next(id, callback) {
    var solver = solvers[id];
    var currentRoom = currentMaze.roomLookup[solver.location];
    $.ajax({
      type: 'PUT',
      dataType: 'json',
      data: {
        room: JSON.stringify(currentRoom)
      },
      url: '/solvers/' + solver.name + '/' + id,
      success: function(message) {
        if (message.action !== 'next') {
          console.log(message);
          return;
        }
        removeFromLocation(id);
        solvers[id].location = key(message.location.x, message.location.y, message.location.z);
        addToLocation(id);
        if (callback) {
          callback();
        }
      }
    });
  }

  function create(name) {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {},
      url: '/solvers/' + name,
      success: function(message) {
        if (message.action !== 'created') {
          console.log(message);
          return;
        }

        var id = message.id;
        var location = key(currentMaze.start.x, currentMaze.start.y, currentMaze.start.z);
        var color = randomColor();

        solvers[id] = {
          name: name,
          location: location,
          color: color
        };
        addToLocation(id);

        var div = $('<div>');

        var finish = key(currentMaze.finish.x, currentMaze.finish.y, currentMaze.finish.z);

        var updateState = function() {
          var finished = (solvers[id].location === finish);
          if (finished) {
            animating = false;
          }
          nextButton.prop('disabled', animating || finished);
          animateButton.prop('disabled', finished);
          if (animating) {
            animateButton.text('Stop');
          } else {
            animateButton.text('Animate');
          }
        };

        var label = $('<span>');
        label.append(name + ': ' + id);
        label.css('background', WHITE.blend(color, 0.5).toCSS());
        div.append(label);

        var nextButton = $('<button>');
        nextButton.append('Next');
        nextButton.click(function() {
          next(id, updateState);
        });
        div.append(nextButton);

        var animating = false;
        var animateButton = $('<button>');
        animateButton.append('Animate');
        animateButton.click(function() {
          if (!animating) {
            animating = true;
            updateState();
            var animate = function() {
              updateState();
              if (animating) {
                next(id, animate);
              }
            };
            animate();
          } else {
            animating = false;
            updateState();
          }
        });
        div.append(animateButton);

        var destroyButton = $('<button>');
        destroyButton.append('Destroy');
        destroyButton.click(function() {
          destroy(id, function() {
            $(div).remove();
          });
        });
        div.append(destroyButton);

        $('#activeSolvers').append(div);
      }
    });
  }

  function fetchGenerators() {
    $.ajax({
      dataType: 'json',
      url: '/generators/',
      success: function(generators) {
        var select = $('#generators');
        select.empty();
        _.each(generators, function(generator) {
          var option = '<option value="' + generator + '">' + generator + '</option>';
          select.append($(option));
        });
      }
    });
  }

  function fetchSolvers() {
    $.ajax({
      dataType: 'json',
      url: '/solvers/',
      success: function(solvers) {
        var select = $('#solvers');
        select.empty();
        _.each(solvers, function(solver) {
          var option = '<option value="' + solver + '">' + solver + '</option>';
          select.append($(option));
        });
      }
    });
  }

  $('#generate').click(function() {
    resetAll();
    var name = $('#generators').val();
    var width = parseInt($('#width').val(), 10);
    var length = parseInt($('#length').val(), 10);
    generate(name, width, length);
  });

  $('#create').click(function() {
    if (!currentMaze) {
      return;
    }
    var name = $('#solvers').val();
    create(name);
  });

  $('#refreshGenerators').click(fetchGenerators);
  $('#refreshSolvers').click(fetchSolvers);

  fetchGenerators();
  fetchSolvers();
}());
