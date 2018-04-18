 /* tslint:disable */ 
import GridGeneration from "./gridGeneration";
import { traverseGrid } from "./gridTools";
import { assert } from "chai";

describe("Grid Generation", async () => {
    describe("Generate complete grid", async () => {
        it("Should create a grid 5 x 5", async function () {

            this.timeout(60000);

            try {

                const grid: GridGeneration = new GridGeneration();
                grid.initializeGrid(5, "easy");
                await grid.findAllWordsSpaces();
                await grid.startRecursion();
                let countBlack: number = 0;
                let countLetters: number = 0;
                let countUndefined: number = 0;

                traverseGrid(grid.grid, (row: number, col: number) => {
                    if (grid.grid[row][col].isBlack()) {
                        countBlack++
                    } else if (grid.grid[row][col].char !== "-") {
                        countLetters++;
                    } else {
                        countUndefined++;
                    }
                });

                assert.equal(grid.words.length > 0, true);
                assert.equal(countBlack > 5, true);
                assert.equal(countLetters < 22, true);
                assert.equal(countUndefined, 0);


            } catch (err) {
                console.error("ERROR RUNING GRID GENERATION", err)
                throw err;
            }

            
        });
        it("Should create a grid 6 x 6", async function () {

            this.timeout(30000);

            try {

                const grid: GridGeneration = new GridGeneration();
                grid.initializeGrid(6, "easy");
                await grid.findAllWordsSpaces();
                await grid.startRecursion();
                let countBlack: number = 0;
                let countLetters: number = 0;
                let countUndefined: number = 0;

                traverseGrid(grid.grid, (row: number, col: number) => {
                    if (grid.grid[row][col].isBlack()) {
                        countBlack++
                    } else if (grid.grid[row][col].char !== "-") {
                        countLetters++;
                    } else {
                        countUndefined++;
                    }
                });

                assert.equal(grid.words.length > 0, true);
                assert.equal(countBlack > 7, true);
                assert.equal(countLetters < 30, true);
                assert.equal(countUndefined, 0);


            } catch (err) {
                console.error("ERROR RUNING GRID GENERATION", err)
                throw err;
            }
 
        });
    });
});


