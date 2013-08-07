package com.neophi.amazing.solver;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.neophi.amazing.model.Location;
import com.neophi.amazing.model.Room;

public class RandomWalkSolverTest {
	private RandomWalkSolver randomWalkSolver;
	private List<Location> exits;
	private Location location_1_0_0 = new Location(1, 0, 0);
	private Room room;
	
	@Before
	public void setUp() throws Exception {
		randomWalkSolver = new RandomWalkSolver();
		exits = new ArrayList<Location>();
		room = new Room(0, 0, 0, exits);
	}

	@Test
	public void picksOnlyExit() {
		exits.add(location_1_0_0);
		Location nextRoom = randomWalkSolver.next(room);
		assertEquals(location_1_0_0, nextRoom);
	}
}
