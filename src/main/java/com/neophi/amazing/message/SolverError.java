package com.neophi.amazing.message;

public class SolverError implements Response {
	private String action;
	private String id;
	private String message;

	public SolverError(final String id, final String message) {
		this.action = "error";
		this.id = id;
		this.message = message;
	}

	public String getAction() {
		return action;
	}

	public String getId() {
		return id;
	}

	public String getMessage() {
		return message;
	}
}
