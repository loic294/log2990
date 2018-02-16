import GridGeneration from "./gridGeneration";
import { Case } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
import {expect} from "chai";
import Constraint from "./Constraint";

describe("GridGenerator", () => {
    let expectedTestArray: Array<Array<Case>>;
    let testWord: Word;
    // let actualTestArray: Array<Array<Case>>;
    const gridGeneration: GridGeneration =  new GridGeneration();
    const TEN: number = 10;

    it("should create a 10x10 array of cases", () => {
        expectedTestArray = gridGeneration.fillGridWithCases(TEN);

        expect(expectedTestArray).to.eql(gridGeneration.grid);

    });

    it("should find two words of 10 in length which share their first letter.");

    it("should find the correct criteria for a word that is of maximum length.", () => {
        testWord = new Word("", "", [0, 0], Orientation.horizontal, 0, false, TEN);

        expect("91").to.eql(gridGeneration.findStringOfConstraintsForWord(testWord));
    });

    it("should find the correct criteria for a word when there a few constraints.", () => {
        testWord = new Word("", "", [0, 0], Orientation.horizontal, 0, false, TEN);

        gridGeneration.constraintsArray.push(new Constraint("a", 0, 0, []));
        gridGeneration.constraintsArray.push(new Constraint("b", 0, 1, []));

        expect("ab8").to.eql(gridGeneration.findStringOfConstraintsForWord(testWord));
    });
});
