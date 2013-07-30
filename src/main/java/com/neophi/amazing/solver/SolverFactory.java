package com.neophi.amazing.solver;

public interface SolverFactory {
	String getName();
	Solver create();
}
