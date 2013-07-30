package com.neophi.amazing.model;

import java.util.List;

public class Maze {
	private Location start;
	private Location finish;
	private List<Room> rooms;

	public Location getStart() {
		return start;
	}

	public Location getFinish() {
		return finish;
	}

	public List<Room> getRooms() {
		return rooms;
	}

	@Override
	public String toString() {
		return "Maze [start=" + start + ", finish=" + finish + ", rooms="
				+ rooms.size() + "]";
	}
}
