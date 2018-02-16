import Constraint from "./Constraint";
import { Case } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
import {expect} from "chai";

describe("Constraint", () => {
    let testWord: Word;
    let constraint: Constraint;

    it("should not add word if the word doesn't have the correct position.", () => {
        constraint =  new Constraint("a", 0, 0, ["actual", "avian"]);

        testWord = new Word("aerial", "", [1, 1], Orientation.horizontal, 0, false, "aerial".length);

        expect(false).to.equal(constraint.addConstrainedWord(testWord));
    });

    it("should add word if the word has the correct position.", () => {
        constraint =  new Constraint("a", 0, 0, ["actual", "avian"]);

        testWord = new Word("aerial", "", [0, 0], Orientation.horizontal, 0, false, "aerial".length);

        expect(true).to.equal(constraint.addConstrainedWord(testWord));
    });

    it("should not remove the word if it doesn't already have it.", () => {
        constraint =  new Constraint("a", 0, 0, ["actual", "avian"]);

        testWord = new Word("aerial", "", [0, 0], Orientation.horizontal, 0, false, "aerial".length);

        expect(false).to.equal(constraint.removeConstrainedWord(testWord));
    });

    it("should not remove the word if it doesn't have the correct position.", () => {
        constraint =  new Constraint("a", 0, 0, ["actual", "aerial"]);

        testWord = new Word("aerial", "", [1, 1], Orientation.horizontal, 0, false, "aerial".length);

        expect(false).to.equal(constraint.removeConstrainedWord(testWord));
    });

    it("should remove the specified word if everything's good.", () => {
        constraint =  new Constraint("a", 0, 0, ["actual", "aerial"]);

        testWord = new Word("aerial", "", [0, 0], Orientation.horizontal, 0, false, "aerial".length);

        expect(true).to.equal(constraint.removeConstrainedWord(testWord));
    });
});
