import GridGenerator from "./grid-generator";
import { Case } from "../../../../common/grid/case";
import {expect} from "chai";

const assert = require("assert");

describe("GridGenerator", () => {
  let expectedTestArray: Array<Array<Case>>;
  let actualTestArray: Array<Array<Case>>;
  let testAmntOfBlacks: number = 0;
  const gridGenerator: GridGenerator = new GridGenerator();

  it("should create a 10x10 empty array of cases", () => {
    actualTestArray = gridGenerator.createEmptyGrille();
    expectedTestArray = [
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
    ];

    expect(actualTestArray).to.eql(expectedTestArray);

  });

  it("should have " + gridGenerator.getAmntBlckCases() + " black cases", () => {

    for(let rows: number = 0; rows < gridGenerator.getGrid().length; rows ++) {
      for (let col: number = 0; col < gridGenerator.getGrid().length; col ++) {
        if (gridGenerator.getGrid()[rows][col].isBlack()) {
          testAmntOfBlacks++;
        }
      }
    }
    expect(testAmntOfBlacks).to.equal(gridGenerator.getAmntBlckCases());
  });

  it("should have no invalid locations. (a white case surrounded by black cases)", () => {
    actualTestArray = [
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
    ];

    actualTestArray[0][1].setBlack(true);
    actualTestArray[1][0].setBlack(true);
    actualTestArray[2][1].setBlack(true);
    actualTestArray[1][2].setBlack(true);

    let nmbrBlackCases: number = 4;

    nmbrBlackCases = gridGenerator.testCheckGrilleValidity(nmbrBlackCases, actualTestArray);
    expect(nmbrBlackCases).to.equal(3);
  });

  it("should have no invalid locations. (a white case on the right side surrounded by black cases)", () => {
    actualTestArray = [
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
    ];

    actualTestArray[0][2].setBlack(true);
    actualTestArray[1][1].setBlack(true);
    actualTestArray[2][2].setBlack(true);

    let nmbrBlackCases: number = 3;

    nmbrBlackCases = gridGenerator.testCheckGrilleValidity(nmbrBlackCases, actualTestArray);
    expect(nmbrBlackCases).to.equal(2);
  });

  it("should have no invalid locations. (a white case on the bottom surrounded by black cases)", () => {
    actualTestArray = [
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
    ];

    actualTestArray[1][1].setBlack(true);
    actualTestArray[2][0].setBlack(true);
    actualTestArray[2][2].setBlack(true);

    let nmbrBlackCases: number = 3;

    nmbrBlackCases = gridGenerator.testCheckGrilleValidity(nmbrBlackCases, actualTestArray);
    expect(nmbrBlackCases).to.equal(2);
  });

  it("should be filled with letters except for the black ones");
});
