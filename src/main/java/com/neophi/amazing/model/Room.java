package com.neophi.amazing.model;

import java.util.List;

public class Room extends Location {
	private List<Location> exits;

	public Room(final int x, final int y, final int z, final List<Location> exits) {
		super(x, y, z);
		this.exits = exits;
	}
	
	public Room() {
		
	}
	
	public List<Location> getExits() {
		return exits;
	}
	
	public boolean validExit(final Location exit) {
		for (Location location : exits) {
			if (location.equals(exit)) {
				return true;
			}
		}
		return false;
	}

	public Location getLocation() {
		// TODO: Refactor to use custom deserialization
		return new Location(getX(), getY(), getZ());
	}

	@Override
	public String toString() {
		return "Room [" + super.toString() + ", exits=" + exits.size() + "]";
	}
}
