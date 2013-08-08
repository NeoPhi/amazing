# Amazing Algorithms

Framework for playing with maze generation and solving algorithms.

## Central server

The central server maintains the list of maze generators and solvers and coordinates sending a generate maze to a solver and displaying the solution.

```
npm install
npm start
open http://localhost:3000/
```

## Register a solver

Once a solver is complete you can register it with the central server for all to play with.

### Node.js

```
npm install
./node.sh ws://localhost:3000 src/main/node/randomWalk.js
```

### Java

```
./java.sh ws://localhost:3000 com.neophi.amazing.solver.RandomWalkSolverFactory
```

### Ruby

```
bundle install
./ruby.sh ws://localhost:3000 src/main/ruby/random_walk.rb
```

## Testing a solver

Test your solver locally before submitting it.

### Node.js

```
npm install
npm test
```

### Java

```
mvn test
```

### Ruby

```
bundle install
bundle exec rspec src/test/ruby
```

## Mazing solving algorithms

### Random walker

Randomly picks an exit.

### Wall Follower

Use either left-hand rule or right-hand rule. 

Keep one hand in contact with one wall of the maze and pick the exit which follows that rule.

### Trémaux's

A path is either unvisited, marked once, or marked twice.

Every time a direction is chosen it is marked by drawing a line on the floor (from junction to junction).

In the beginning a random direction is chosen (if there is more than one).

On arriving at a junction that has not been visited before (no other marks), pick a random direction (and mark the path).

When arriving at a marked junction and if your current path is marked only once then turn around and walk back (and mark the path a second time).

If this is not the case, pick the direction with the fewest marks (and mark it, as always).

## JSON

### Solver output

Maze solver output is an array of rooms visited in order:

```
[
  {
    x: 0,
    y: 0,
    z: 0
  },
  {
    x: 1,
    y: 0,
    z: 0
  }
]
```

### Generator output

Maze generation output is an object with start and finish locations and an array of rooms each with a location and list of exit locations.

```
{
  start: {
    x: 0,
    y: 0,
    z: 0
  },
  finish: {
    x: 1,
    y: 1,
    z: 0
  },
  rooms: [
    {
      x: 0,
      y: 0,
      z: 0,
      exits: [
        {
          x: 1,
          y: 0,
          z: 0
        },
        {
          x: 0,
          y: 1,
          z: 0
        }
      ]
    },
    {
      x: 1,
      y: 0,
      z: 0,
      exits: [
        {
          x: 0,
          y: 0,
          z: 0
        },
        {
          x: 1,
          y: 1,
          z: 0
        }
      ]
    },
    {
      x: 0,
      y: 1,
      z: 0,
      exits: [
        {
          x: 0,
          y: 0,
          z: 0
        }
      ]
    },
    {
      x: 0,
      y: 0,
      z: 0,
      exits: [
        {
          x: 1,
          y: 0,
          z: 0
        }
      ]
    }
  ]
}
```

## Resources

[http://en.wikipedia.org/wiki/Maze_generation_algorithm](http://en.wikipedia.org/wiki/Maze_generation_algorithm)

[http://en.wikipedia.org/wiki/Maze_solving_algorithm](http://en.wikipedia.org/wiki/Maze_solving_algorithm)

[http://weblog.jamisbuck.org/under-the-hood](http://weblog.jamisbuck.org/under-the-hood)

[http://www.astrolog.org/labyrnth/algrithm.htm](http://www.astrolog.org/labyrnth/algrithm.htm)

## License

Copyright (c) 2013 Daniel Rinehart. This software is licensed under the MIT License.
