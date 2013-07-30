package com.neophi.amazing.solver;

import com.neophi.amazing.model.Location;
import com.neophi.amazing.model.Room;

public interface Solver {
	Location next(final Room room);
}
