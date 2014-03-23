require "rubygems"
require "bundler/setup"
require File.join(File.dirname(__FILE__), "../../main/ruby/wall_follower")

describe Solver::WallFollower do
  exit_1_0_0 = {
    "x" => 1,
    "y" => 0,
    "z" => 0
  };

  exit_0_1_0 = {
    "x" => 0,
    "y" => 1,
    "z" => 0
  };

  before do
    @solver = Solver::WallFollower.new()
    @room = {
      "x" => 0,
      "y" => 0,
      "z" => 0,
      "exits" => []
    }
  end

  it "picks only exit" do
    @room["exits"] << exit_0_1_0
    next_location = @solver.next(@room)
    # expect(next_location).to equal(exit_0_1_0)
  end
end
