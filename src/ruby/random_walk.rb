module Solver
  NAME = "randomWalk"

  class RandomWalker
    def next(room)
      return room["exits"][rand(room["exits"].length)]
    end
  end

  def self.create
    return RandomWalker.new
  end
end
