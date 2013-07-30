Amazing Algorithms
=======

Framework for playing with maze generation and solving algorithms.

See doc/ for a general overview.

Central server requires node.js

```
npm install
npm start
```

Register a solver
==

Node.js

```
npm install
./node.sh ws://localhost:3000 src/node/randomWalk.js
```

Java

```
./java.sh ws://localhost:3000 com.neophi.amazing.solver.RandomWalkSolverFactory
```

Ruby

```
bundle install
./ruby.sh ws://localhost:3000 src/ruby/random_walk.rb
```

JSON
==

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

Maze generation output is an object:

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

