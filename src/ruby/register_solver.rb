if ARGV.length < 2
  warn "Usage: serverURI solver.rb"
  exit 1
end

require 'rubygems'
require 'bundler/setup'
require 'web_socket'
require 'json'
require ARGV[1]
include Solver

def key(room)
  return [room["x"], room["y"], room["z"]].join("")
end

def equal(roomA, roomB)
  return ["x", "y", "z"].all? do |property|
    roomA[property] == roomB[property]
  end
end

def validNextRoom(room, nextRoom)
  return room["exits"].any? do |exit|
    equal(exit, nextRoom)
  end
end

def sendSolution(client, id, path)
  puts "Solved"
  json = {
    :id => id,
    :path => path
  }
  client.send(JSON.generate(json))
end

# https://github.com/gimite/web-socket-ruby
# http://flori.github.io/json/doc/index.html
client = WebSocket.new(ARGV[0])
puts "Registering #{NAME}"
client.send(JSON.generate({
  :name => "ruby:" + NAME
}))
while true
  data = client.receive()
  puts "Solving"
  message = JSON.parse(data)
  rooms = {};
  message["maze"]["rooms"].each do |room|
    rooms[key(room)] = room
  end
  currentRoom = rooms[key(message["maze"]["start"])]
  solver = create()
  path = [currentRoom]
  while !equal(currentRoom, message["maze"]["finish"])
    nextRoom = solver.next(currentRoom);
    if !validNextRoom(currentRoom, nextRoom)
      sendSolution(client, message["id"], []);
      next
    end
    path << nextRoom;
    currentRoom = rooms[key(nextRoom)]
  end
  sendSolution(client, message["id"], path)
end
