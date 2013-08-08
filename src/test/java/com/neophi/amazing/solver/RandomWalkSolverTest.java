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
@PrepareForTest(RandomWalkSolver.class)
public class RandomWalkSolverTest {
	private RandomWalkSolver randomWalkSolver;
	private List<Location> exits;
	private Location location_0_1_0 = new Location(0, 1, 0);
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

	@Test
	public void returnsRandomlyChosenExit() {
		PowerMockito.mockStatic(Math.class);
		PowerMockito.when(Math.random()).thenReturn(1.0);
		PowerMockito.when(Math.floor(2.0)).thenReturn(1.0);

		exits.add(location_0_1_0);
		exits.add(location_1_0_0);
		Location nextRoom = randomWalkSolver.next(room);
		assertEquals(location_1_0_0, nextRoom);

		PowerMockito.verifyStatic();
	}
}
