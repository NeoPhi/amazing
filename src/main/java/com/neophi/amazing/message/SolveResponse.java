package com.neophi.amazing.message;

import java.util.List;

import com.neophi.amazing.model.Location;

public class SolveResponse {
	private String id;
	private List<Location> path;
	
	public SolveResponse(final String id, final List<Location> path) {
		this.id = id;
		this.path = path;
	}

	public String getId() {
		return id;
	}

	public List<Location> getPath() {
		return path;
	}
}
