package com.neophi.amazing.solver;

public class RandomWalkSolverFactory implements SolverFactory {

	public String getName() {
		return "randomWalk";
	}

	public Solver create() {
		return new RandomWalkSolver();
	}
}
