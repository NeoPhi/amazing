package com.neophi.amazing.message;

import com.neophi.amazing.model.Location;

public class SolverResponse implements Response {
	private String action;
	private String id;
	private Location location;

	public SolverResponse(final String action, final String id) {
		this(action, id, null);
	}

	public SolverResponse(final String action, final String id,
			final Location location) {
		this.action = action;
		this.id = id;
		this.location = location;
	}

	public String getAction() {
		return action;
	}

	public String getId() {
		return id;
	}

	public Location getLocation() {
		return location;
	}
}
