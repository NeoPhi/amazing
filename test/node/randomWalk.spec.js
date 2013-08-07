describe('randomWalk', function() {
  var _ = require('underscore');
  var module = require('../../src/node/randomWalk');
  var solver;
  var room;
  var exit_1_0_0 = {
    x: 1,
    y: 0,
    z: 0
  };
  var exit_0_1_0 = {
    x: 0,
    y: 1,
    z: 0
  };

  beforeEach(function() {
    room = {
      x: 0,
      y: 0,
      z: 0
    };
    solver = module.create();
  });

  it('picks only exit', function() {
    room.exits = [exit_1_0_0];
    var location = solver.next(room);
    expect(location).toBe(exit_1_0_0);
    expect(solver.nextCalls).toBe(1);
  });

  it('picks first exit after randomizing', function() {
    spyOn(_, 'shuffle').andReturn([exit_1_0_0, exit_0_1_0]);
    room.exits = [exit_0_1_0, exit_1_0_0];
    var location = solver.next(room);
    expect(location).toBe(exit_1_0_0);
    expect(_.shuffle).toHaveBeenCalledWith(room.exits);
    expect(solver.nextCalls).toBe(1);
  });
});
