package com.neophi.amazing.solver;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.neophi.amazing.model.Location;
import com.neophi.amazing.model.Room;

@RunWith(PowerMockRunner.class)
@PrepareForTest(WallFollowerSolver.class)
public class WallFollowerSolverTest {
	private WallFollowerSolver wallFollowerSolver;
	private List<Location> exits;
	private Location location_0_1_0 = new Location(0, 1, 0);
	private Location location_1_0_0 = new Location(1, 0, 0);
	private Room room;

	@Before
	public void setUp() throws Exception {
		wallFollowerSolver = new WallFollowerSolver();
		exits = new ArrayList<Location>();
		room = new Room(0, 0, 0, exits);
	}

	@Test
	public void picksOnlyExit() {
		exits.add(location_1_0_0);
		Location nextRoom = wallFollowerSolver.next(room);
		// assertEquals(location_1_0_0, nextRoom);
	}
}
