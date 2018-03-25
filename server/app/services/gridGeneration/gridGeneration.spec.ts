 /* tslint:disable */ 
 import { default as GridGenerationService } from "./gridGeneration";
 import { Cell } from "../../../../common/grid/case";
 import { assert } from "chai";
 
 const service: GridGenerationService = new GridGenerationService;
 
 describe("Grid Initialization", function() {
	 it("Should create a grid 10 x 10", function() {
		 const grid: Array<Array<Cell>> = service.fillGridWithCells(10)
		 assert.equal(grid.length, 10)
		 assert.equal(grid[0].length, 10)
	 });
	 it("Should create a grid 18 x 18", function() {
		 const grid: Array<Array<Cell>> = service.fillGridWithCells(18)
		 assert.equal(grid.length, 18)
		 assert.equal(grid[0].length, 18)
	 });
	 it("Should create a grid 0 x 0", function() {
         const grid: Array<Array<Cell>> = service.fillGridWithCells(0)
         console.log('GRID', grid)
		 assert.equal(grid.length, 0)
		 assert.equal(grid[0], undefined)
	 });
 });
 