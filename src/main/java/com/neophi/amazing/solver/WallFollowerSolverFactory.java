package com.neophi.amazing.solver;

public class WallFollowerSolverFactory implements SolverFactory {

	public String getName() {
		return "wallFollower";
	}

	public Solver create() {
		return new WallFollowerSolver();
	}
}
