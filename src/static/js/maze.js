(function() {
  var currentMaze;
  var currentPath;
  var currentInterval;

  function resetAll() {
    currentMaze = null;
    $('#maze').html('Generating...');
    resetPath();
  }

  function resetPath() {
    stopAnimation();
    currentPath = null;
  }

  function stopAnimation() {
    clearInterval(currentInterval);
    $('#step').text('');
  }

  function key(x, y, z) {
    return [x, y, z].join(',');
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
        draw(maze);
      }
    });    
  }

  function animate(path) {
    var index = 0;
    var loction;
    currentInterval = setInterval(function() {
      if (index === path.length) {
        clearInterval(currentInterval);
        currentInterval = null;
        return;
      }
      if (loction) {
        $(loction).removeClass('highlight');
      }
      var room = path[index];
      loction = '#' + key(room.x, room.y, room.z).replace(/,/g, '_');
      $(loction).addClass('highlight');
      index += 1;
      $('#step').text('Step ' + index + ' of ' + path.length);
    }, 200);
  }

  function solve(name) {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {
        maze: currentMaze
      },
      url: '/solvers/' + name,
      success: function(path) {
        currentPath = path;
        animate(path);
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

  $('#solve').click(function() {
    if (!currentMaze) {
      return;
    }
    resetPath();
    draw(currentMaze);
    var name = $('#solvers').val();
    solve(name);
  });

  $('#reset').click(function() {
    if (!currentMaze) {
      return;
    }
    stopAnimation();
    draw(currentMaze);
  });

  $('#replay').click(function() {
    if (!currentPath) {
      return;
    }
    stopAnimation();
    draw(currentMaze);
    animate(currentPath);
  });

  $('#refreshGenerators').click(fetchGenerators);
  $('#refreshSolvers').click(fetchSolvers);
  
  fetchGenerators();
  fetchSolvers();
}());
