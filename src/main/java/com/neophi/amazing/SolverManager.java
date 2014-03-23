package com.neophi.amazing;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.neophi.amazing.message.Response;
import com.neophi.amazing.message.SolverError;
import com.neophi.amazing.message.SolverRequest;
import com.neophi.amazing.message.SolverResponse;
import com.neophi.amazing.model.Location;
import com.neophi.amazing.solver.Solver;
import com.neophi.amazing.solver.SolverFactory;

// https://github.com/TooTallNate/Java-WebSocket
public class SolverManager extends WebSocketClient {
	private Map<String, Solver> solvers = new HashMap<String, Solver>();
	private SolverFactory solverFactory;
	private Gson gson = new Gson();

	public SolverManager(final URI serverURI, final SolverFactory solverFactory) {
		super(serverURI);
		this.solverFactory = solverFactory;
	}

	@Override
	public void onOpen(final ServerHandshake handshakedata) {
		System.out.println("Registering: " + solverFactory.getName());
		JsonObject data = new JsonObject();
		data.addProperty("action", "solver.register");
		data.addProperty("name", "java:" + solverFactory.getName());
		send(gson.toJson(data));
	}

	@Override
	public void onMessage(final String message) {
		System.out.println("Request: " + message);
		SolverRequest solverRequest = gson.fromJson(message,
				SolverRequest.class);
		if (solverRequest.getId() == null) {
			throw new RuntimeException("No message id");
		}
		String action = solverRequest.getAction();
		Response response;
		if ("create".equals(action)) {
			response = create(solverRequest);
		} else if ("next".equals(action)) {
			response = next(solverRequest);
		} else if ("destroy".equals(action)) {
			response = destroy(solverRequest);
		} else {
			response = new SolverError(solverRequest.getId(),
					"Unrecognized action: " + action);
		}
		String json = gson.toJson(response);
		System.out.println("Response: " + json);
		send(json);
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

	private Response create(final SolverRequest solverRequest) {
		String id = solverRequest.getId();
		if (solvers.containsKey(id)) {
			return new SolverError(id, "Solver already created: " + id);
		}
		Solver solver = solverFactory.create();
		solvers.put(id, solver);
		return new SolverResponse("created", id);
	}

	private Response next(final SolverRequest solverRequest) {
		String id = solverRequest.getId();
		if (!solvers.containsKey(id)) {
			return new SolverError(id, "Solver does not exist: " + id);
		}
		Solver solver = solvers.get(id);
		Location exit = solver.next(solverRequest.getRoom());
		return new SolverResponse("next", id, exit);
	}

	private Response destroy(final SolverRequest solverRequest) {
		String id = solverRequest.getId();
		if (!solvers.containsKey(id)) {
			return new SolverError(id, "Solver does not exist: " + id);
		}
		solvers.remove(id);
		return new SolverResponse("destroyed", id);
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
		SolverManager solverManager = new SolverManager(new URI(args[0]),
				solverFactory);
		solverManager.connect();
	}
}
