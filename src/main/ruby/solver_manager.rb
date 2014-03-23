if ARGV.length < 2
  warn "Usage: serverURI solver.rb"
  exit 1
end

require "rubygems"
require "bundler/setup"
require File.expand_path(File.join(File.dirname(__FILE__), "web_socket"))
require "json"
require File.expand_path(ARGV[1])

def sendResponse(response)
  json = JSON.generate(response)
  puts "Response: #{json}"
  $client.send(json)
end

def sendError(id, message)
  sendResponse({
    :action => "error",
    :id => id,
    :message => message,
  })
end

def create(message)
  id = message["id"]
  if $solvers.has_key?(id)
    return sendError(id, "Solver already created: #{id}")
  end
  $solvers[id] = $solver_class.new()
  sendResponse({
    :action => "created",
    :id => id,
  })
end

def next(message)
  id = message["id"]
  if !$solvers.has_key?(id)
    return sendError(id, "Solver does not exist: #{id}")
  end
  exit = $solvers[id].next(message["room"])
  sendResponse({
    :action => "next",
    :id => id,
    :location => exit,
  })
end

def destroy(message)
  id = message["id"]
  if !$solvers.has_key?(id)
    return sendError(id, "Solver does not exist: #{id}")
  end
  $solvers.delete(id)
  sendResponse({
    :action => "destroyed",
    :id => id,
  })
end

# https://github.com/gimite/web-socket-ruby
# http://flori.github.io/json/doc/index.html
$solvers = {}
$client = WebSocket.new(ARGV[0])
solver_classes = Solver.constants.select {|constant| Solver.const_get(constant).is_a?(Class)}
$solver_class = Solver.const_get(solver_classes[0])
puts "Registering: #{$solver_class::NAME}"
$client.send(JSON.generate({
  :action => "solver.register",
  :name => "ruby:" + $solver_class::NAME,
}))
while true
  request = $client.receive()
  puts "Request: #{request}"
  message = JSON.parse(request)
  if message["id"].nil?
    warn "No message id"
  elsif ["create", "next", "destroy"].include?(message["action"])
    self.send(message["action"].to_sym, message)
  else
    sendError(message["id"], "Unrecognized action: #{message["action"]}")
  end
end
