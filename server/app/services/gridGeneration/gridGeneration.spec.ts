 /* tslint:disable */ 
import { default as GridGenerationService } from "./gridGeneration";
import { Cell } from "../../../../common/grid/cell";
import Constraint, { createConstraints, intersects } from "./constraint";
import { Orientation } from "../../../../common/lexical/word";
import {traverseWord, switchPosition, sortWords, isNextNotBlack, isNextBlack,
    containtsOnlyLetters, traverseGrid, HashString, HashList, wordRepeats, isValidWord} from "./gridTools";
import { assert } from "chai";

const service: GridGenerationService = new GridGenerationService;

describe("Grid Initialization", function() {
    it("Should create a grid 10 x 10", function() {
        service["initializeGrid"](10)
        const grid: Array<Array<Cell>> = service.grid;
        assert.equal(grid.length, 10);
        assert.equal(grid[0].length, 10);
    });
    it("Should create a grid 18 x 18", function() {
        service["initializeGrid"](18)
        const grid: Array<Array<Cell>> = service.grid;
        assert.equal(grid.length, 18)
        assert.equal(grid[0].length, 18)
    });
    it("Should create a grid 0 x 0", function() {
        service["initializeGrid"](0)
        const grid: Array<Array<Cell>> = service.grid;
        assert.equal(grid.length, 0)
        assert.equal(grid[0], undefined)
    });
    it("Should traverse 100 cells", function() {
        service["initializeGrid"](10)
        const grid: Array<Array<Cell>> = service.grid;
        let count: number = 0;
        traverseGrid(grid, () => { count++ });
        assert.equal(count, 100);
    });
});

describe("Intersections", function() {
 it("Should intersect at [0,0]", function() {
     const c1: Constraint = new Constraint("", "", [0, 0], Orientation.horizontal);
     c1.size = 6;
     const c2: Constraint = new Constraint("", "", [0, 0], Orientation.vertical);
     c2.size = 6;
     assert.equal(intersects(c1, c2).length, 2);
 });
 it("Should intersect at [1,1]", function() {
     const c1: Constraint = new Constraint("", "", [1, 0], Orientation.horizontal);
     c1.size = 2;
     const c2: Constraint = new Constraint("", "", [0, 1], Orientation.vertical);
     c2.size = 2;
     assert.equal(intersects(c1, c2).length, 2);
 });
 it("Should intersect at [1,1]", function() {
     const c1: Constraint = new Constraint("", "", [0, 1], Orientation.vertical);
     c1.size = 3;
     const c2: Constraint = new Constraint("", "", [1, 0], Orientation.horizontal);
     c2.size = 3;
     assert.equal(intersects(c1, c2).length, 2);
 });
 it("Should not intersect (both directions)", function() {
     const c1: Constraint = new Constraint("", "", [0, 1], Orientation.horizontal);
     c1.size = 4;
     const c2: Constraint = new Constraint("", "", [1, 0], Orientation.vertical);
     c2.size = 4;
     assert.equal(intersects(c1, c2).length, 0);
 });
 it("Should not intersect (horizontal)", function() {
     const c1: Constraint = new Constraint("", "", [0, 1], Orientation.horizontal);
     c1.size = 2;
     const c2: Constraint = new Constraint("", "", [0, 2], Orientation.horizontal);
     c2.size = 2;
     assert.equal(intersects(c1, c2).length, 0);
 });
 it("Should not intersect (vertical)", function() {
     const c1: Constraint = new Constraint("", "", [1, 0], Orientation.vertical);
     c1.size = 3;
     const c2: Constraint = new Constraint("", "", [2, 0], Orientation.vertical);
     c2.size = 3;
     assert.equal(intersects(c1, c2).length, 0);
 });
});
