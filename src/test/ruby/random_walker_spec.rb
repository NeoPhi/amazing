require "rubygems"
require "bundler/setup"
require File.join(File.dirname(__FILE__), "../../main/ruby/random_walk")

describe Solver do
  EXIT_1_0_0 = {
    "x" => 1,
    "y" => 0,
    "z" => 0
  };

  EXIT_0_1_0 = {
    "x" => 0,
    "y" => 1,
    "z" => 0
  };

  before do
    @solver = Solver.create()  
    @room = {
      "x" => 0,
      "y" => 0,
      "z" => 0,
      "exits" => []
    }
  end

  it "picks only exit" do
    @room["exits"] << EXIT_0_1_0
    next_location = @solver.next(@room)
    expect(next_location).to equal(EXIT_0_1_0)
  end

  it "returns randomly chosen exit" do
    @room["exits"] << EXIT_0_1_0
    @room["exits"] << EXIT_1_0_0
    @solver.stub(:rand) { 1 }
    next_location = @solver.next(@room)
    expect(next_location).to equal(EXIT_1_0_0)
  end
end
