package com.neophi.amazing.solver;

import com.neophi.amazing.model.Location;
import com.neophi.amazing.model.Room;

public class RandomWalkSolver implements Solver {
	public Location next(final Room room) {
		int index = (int) Math.floor(Math.random() * room.getExits().size());
		return room.getExits().get(index);
	}
}
