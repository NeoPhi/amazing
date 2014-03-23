module Solver
  class RandomWalk
    NAME = "randomWalk"
    def next(room)
      return room["exits"][rand(room["exits"].length)]
    end
  end
end
