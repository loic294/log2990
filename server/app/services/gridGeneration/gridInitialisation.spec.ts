 /* tslint:disable */ 
import { assert } from "chai";
import { Cell } from "../../../../common/grid/cell";
import { isIsolatedCell, hasMinWordSpace } from "./gridInitialisation"
import { default as GridGenerationService } from "./gridGeneration";
import { traverseGrid } from "./gridTools"

const testGrid: Array<Array<Cell>> = [
    [new Cell("t"), new Cell("e"), new Cell("s"), new Cell("t"), new Cell("-"), new Cell("-")],
    [new Cell("e"), new Cell("-"), new Cell(), new Cell("-"), new Cell("-"), new Cell()],
    [new Cell("s"), new Cell(), new Cell(), new Cell("-"), new Cell(), new Cell("-")],
    [new Cell("t"), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell("-"), new Cell("-")],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell("-"), new Cell()]
];

testGrid[0][4].setBlack(true);
testGrid[0][5].setBlack(true);
testGrid[1][4].setBlack(true);
testGrid[2][5].setBlack(true);
testGrid[1][1].setBlack(true);
testGrid[1][3].setBlack(true);
testGrid[2][3].setBlack(true);

testGrid[4][4].setBlack(true);
testGrid[4][5].setBlack(true);
testGrid[5][4].setBlack(true);

const service: GridGenerationService = new GridGenerationService;

describe("Grid Initialization", function() {
    describe("fillGridWithCells", function() {
        it("Should create a grid 10 x 10", function() {
            service["initializeGrid"](10, "easy")
            const grid: Array<Array<Cell>> = service.grid;
            assert.equal(grid.length, 10);
            assert.equal(grid[0].length, 10);
        });
        it("Should create a grid 18 x 18", function() {
            service["initializeGrid"](18, "easy")
            const grid: Array<Array<Cell>> = service.grid;
            assert.equal(grid.length, 18)
            assert.equal(grid[0].length, 18)
        });
        it("Should create a grid 0 x 0", function() {
            service["initializeGrid"](0, "easy")
            const grid: Array<Array<Cell>> = service.grid;
            assert.equal(grid.length, 0)
            assert.equal(grid[0], undefined)
        });
        it("Should traverse 100 cells", function() {
            service["initializeGrid"](10, "easy")
            const grid: Array<Array<Cell>> = service.grid;
            let count: number = 0;
            traverseGrid(grid, () => { count++ });
            assert.equal(count, 100);
        });
    });
    describe("isIsolatedCell", function() {
        it("Should be isolated [5,5]", function() {
            assert.equal(isIsolatedCell(testGrid, 5, 5), true);
        });
        it("Should not be isolated [3,3]", function() {
            assert.equal(isIsolatedCell(testGrid, 3, 3), false);
        });
    });
    describe("hasMinWordSpace", function() {
        it("Should not have place [0,5]", function() {
            assert.equal(hasMinWordSpace(testGrid, 1, 5), false);
        });
        it("Should have place [1,2]", function() {
            assert.equal(hasMinWordSpace(testGrid, 1, 2), true);
        });
        it("Should have place [5,1]", function() {
            assert.equal(hasMinWordSpace(testGrid, 5, 2), true);
        });
    });
    describe("fillGridWithBlackCells", function() {
        it("10 x 10 should have at least 20 black cells", function() {
            service["initializeGrid"](10, "easy")
            const grid: Array<Array<Cell>> = service.grid;
            let count: number = 0;
            traverseGrid(grid, (row: number, col: number) => {
                if (grid[row][col].isBlack()) {
                    count++
                }
            });
            assert.equal(count > 20, true);
        });
        it("5 x 5 should have at least 5 black cells", function() {
            service["initializeGrid"](5, "easy")
            const grid: Array<Array<Cell>> = service.grid;
            let count: number = 0;
            traverseGrid(grid, (row: number, col: number) => {
                if (grid[row][col].isBlack()) {
                    count++
                }
            });
            assert.equal(count > 5, true);
        });
    });
});

