package com.neophi.amazing;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.neophi.amazing.message.SolveRequest;
import com.neophi.amazing.message.SolveResponse;
import com.neophi.amazing.model.Location;
import com.neophi.amazing.model.Room;
import com.neophi.amazing.solver.Solver;
import com.neophi.amazing.solver.SolverFactory;

// https://github.com/TooTallNate/Java-WebSocket
public class RegisterSolver extends WebSocketClient {
	private SolverFactory solverFactory;
	private Gson gson = new Gson();

	public RegisterSolver(final URI serverURI, final SolverFactory solverFactory) {
		super(serverURI);
		this.solverFactory = solverFactory;
	}

	@Override
	public void onOpen(final ServerHandshake handshakedata) {
		System.out.println("Registering " + solverFactory.getName());
		JsonObject data = new JsonObject();
		data.addProperty("name", "java:" + solverFactory.getName());
		send(gson.toJson(data));
	}

	@Override
	public void onMessage(final String message) {
		System.out.println("Solving");
		SolveRequest solveRequest = gson.fromJson(message, SolveRequest.class);
		HashMap<Location, Room> rooms = new HashMap<Location, Room>();
		for (Room room : solveRequest.getMaze().getRooms()) {
			rooms.put(room.getLocation(), room);
		}
		Room currentRoom = rooms.get(solveRequest.getMaze().getStart());
		Solver solver = solverFactory.create();
		List<Location> path = new ArrayList<Location>();
		path.add(currentRoom.getLocation());
		while (!currentRoom.getLocation().equals(
				solveRequest.getMaze().getFinish())) {
			Location nextRoom = solver.next(currentRoom);
			if (!currentRoom.validExit(nextRoom)) {
				sendSolution(solveRequest.getId(), new ArrayList<Location>());
				return;
			}
			path.add(nextRoom);
			currentRoom = rooms.get(nextRoom);
		}
		sendSolution(solveRequest.getId(), path);
	}

	@Override
	public void onClose(final int code, final String reason,
			final boolean remote) {
		System.out.println("Connection closed by "
				+ (remote ? "remote peer" : "us"));
	}

	@Override
	public void onError(final Exception ex) {
		ex.printStackTrace();
	}

	private void sendSolution(final String id, final List<Location> path) {
		System.out.println("Solved");
		SolveResponse solveResponse = new SolveResponse(id, path);
		send(gson.toJson(solveResponse));
	}

	public static void main(final String[] args) throws URISyntaxException,
			InstantiationException, IllegalAccessException,
			ClassNotFoundException {
		if (args.length != 2) {
			System.out.println("Usage: serverURI className");
			System.exit(1);
		}
		SolverFactory solverFactory = (SolverFactory) Class.forName(args[1])
				.newInstance();
		RegisterSolver register = new RegisterSolver(new URI(args[0]), solverFactory);
		register.connect();
	}
}
