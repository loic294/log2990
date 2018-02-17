import GridGeneration, { Difficulty } from "./gridGeneration";
import { Case } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
import {expect} from "chai";
import Constraint from "./Constraint";

/* tslint:disable:no-magic-numbers */

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

    it("should find the correct criteria for a word that is of maximum length.", () => {
        testWord = new Word("", "", [0, 0], Orientation.horizontal, 0, false, TEN);

        expect("91").to.eql(gridGeneration.findCriteriaForWord(testWord));
    });

    it("should find the correct criteria for a word when there are a few constraints.", () => {
        testWord = new Word("", "", [0, 0], Orientation.horizontal, 0, false, TEN);

        gridGeneration.constraintsArray.push(new Constraint("a", 0, 0, []));
        gridGeneration.constraintsArray.push(new Constraint("b", 0, 1, []));

        expect("0a0b8").to.eql(gridGeneration.findCriteriaForWord(testWord));
    });

    it("should not add a criteria for a word if the constraint is not at the correct position.", () => {
        testWord = new Word("", "", [0, 0], Orientation.horizontal, 0, false, TEN);

        gridGeneration.constraintsArray = [];

        gridGeneration.constraintsArray.push(new Constraint("a", 1, 0, []));
        gridGeneration.constraintsArray.push(new Constraint("b", 0, 1, []));

        expect("1b8").to.eql(gridGeneration.findCriteriaForWord(testWord));
    });

    it("should properly add constraints of a new word to the constraints array.", () => {
        testWord = new Word("mizzenmast", "the mast aft of a ship's mainmast.", [0, 0], Orientation.horizontal, 0, false, TEN);

        gridGeneration.constraintsArray = [];

        gridGeneration.addConstraintForWord(testWord);

        const expectedConstraintArray: Constraint[] = [
            new Constraint("m", 0, 0, ["mizzenmast"]),
            new Constraint("i", 0, 1, ["mizzenmast"]),
            new Constraint("z", 0, 2, ["mizzenmast"]),
            new Constraint("z", 0, 3, ["mizzenmast"]),
            new Constraint("e", 0, 4, ["mizzenmast"]),
            new Constraint("n", 0, 5, ["mizzenmast"]),
            new Constraint("m", 0, 6, ["mizzenmast"]),
            new Constraint("a", 0, 7, ["mizzenmast"]),
            new Constraint("s", 0, 8, ["mizzenmast"]),
            new Constraint("t", 0, 9, ["mizzenmast"])
        ];

        expect(expectedConstraintArray).to.eql(gridGeneration.constraintsArray);
    });

    it("should properly add constraints of a new word if the constraints array already has constraints.", () => {
        testWord = new Word("macadamias", "the mast aft of a ship's mainmast.", [0, 0], Orientation.vertical, 0, false, TEN);

        gridGeneration.addConstraintForWord(testWord);

        const expectedConstraintArray: Constraint[] = [
            new Constraint("m", 0, 0, ["mizzenmast", "macadamias"]),
            new Constraint("i", 0, 1, ["mizzenmast"]),
            new Constraint("z", 0, 2, ["mizzenmast"]),
            new Constraint("z", 0, 3, ["mizzenmast"]),
            new Constraint("e", 0, 4, ["mizzenmast"]),
            new Constraint("n", 0, 5, ["mizzenmast"]),
            new Constraint("m", 0, 6, ["mizzenmast"]),
            new Constraint("a", 0, 7, ["mizzenmast"]),
            new Constraint("s", 0, 8, ["mizzenmast"]),
            new Constraint("t", 0, 9, ["mizzenmast"]),
            new Constraint("a", 1, 0, ["macadamias"]),
            new Constraint("c", 2, 0, ["macadamias"]),
            new Constraint("a", 3, 0, ["macadamias"]),
            new Constraint("d", 4, 0, ["macadamias"]),
            new Constraint("a", 5, 0, ["macadamias"]),
            new Constraint("m", 6, 0, ["macadamias"]),
            new Constraint("i", 7, 0, ["macadamias"]),
            new Constraint("a", 8, 0, ["macadamias"]),
            new Constraint("s", 9, 0, ["macadamias"]),
        ];

        expect(gridGeneration.constraintsArray).to.eql(expectedConstraintArray);
    });

    it("should create a word properly a vertical word of 10 in length and stash it.", () => {
        gridGeneration.constraintsArray = [];

        testWord = new Word("", "", [0, 0], Orientation.vertical, 0, false, TEN);

        gridGeneration.createWord(Difficulty.easy, testWord);
    });

    it("should find two words of 10 in length which share their first letter.");

    it("should backtrack properly.");

    it("should backtrack if a word cannot be found after a certain amount of times.");

    it("should find two words of 10 in length which share their first letter.");

    it("should find words of a random length at a random position and place them properly.");

});
