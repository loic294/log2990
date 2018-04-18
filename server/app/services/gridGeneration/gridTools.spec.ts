 /* tslint:disable */ 
import Constraint from "./constraint";
import { Orientation } from "../../../../common/lexical/word";
import { assert } from "chai";
import { Cell } from "../../../../common/grid/cell";
import { isValidWord, containtsOnlyLetters, switchPosition, wordRepeats, isNextBlack, isNextNotBlack } from "./gridTools";
import { NO_DEFINITION } from "./gridGeneration";

const testGrid: Array<Array<Cell>> = [
    [new Cell("t"), new Cell("e"), new Cell("s"), new Cell("t"), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()],
    [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()]
]

describe("Grid Tools", function() {
    describe("isValidWord", function() {
        it("test word should be valid", function() {
            const w1: Constraint = new Constraint("test", "", [0,0], Orientation.horizontal);
            assert.equal(isValidWord(w1), true);
        });
        it("test word should be invalid (NO_DEFINITION)", function() {
            const w1: Constraint = new Constraint("test", NO_DEFINITION, [0,0], Orientation.horizontal);
            assert.equal(isValidWord(w1), false);
        });
        it("test word should be invalid (no length)", function() {
            const w1: Constraint = new Constraint("", NO_DEFINITION, [0,0], Orientation.horizontal);
            assert.equal(isValidWord(w1), false);
        });
    });
    describe("containtsOnlyLetters", function() {
        it("should only contain letters: hello", function() {
            assert.equal(containtsOnlyLetters("hello"), true);
        });
        it("should not only contain letters: hello world", function() {
            assert.equal(containtsOnlyLetters("hello world"), false);
        });
        it("should not only contain letters: hello1234", function() {
            assert.equal(containtsOnlyLetters("hello1234"), false);
        });
        it("should not only contain letters: h@llo", function() {
            assert.equal(containtsOnlyLetters("h@llo"), false);
        });
        it("should not only contain letters: _-", function() {
            assert.equal(containtsOnlyLetters("_-"), false);
        });
    });
    describe("wordRepeats", function() {
        it("words should repeat", function() {
            const w1: Constraint = new Constraint("test", "", [0,0], Orientation.horizontal);
            const w2: Constraint = new Constraint("test", "", [0,0], Orientation.horizontal);
            assert.equal(wordRepeats([w1, w2]), true);
        });
        it("words should not repeat", function() {
            const w1: Constraint = new Constraint("test1", "", [0,0], Orientation.horizontal);
            const w2: Constraint = new Constraint("test2", "", [0,0], Orientation.horizontal);
            assert.equal(wordRepeats([w1, w2]), false);
        });
    });
    describe("switchPosition", function() {
        it("positions should not switch (horizontal)", function() {
            assert.deepEqual(switchPosition(Orientation.horizontal, 0, 1), [0, 1]);
        });
        it("positions should switch (vertical)", function() {
            assert.deepEqual(switchPosition(Orientation.vertical, 0, 1), [1, 0]);
        });
    });
    describe("isNextBlack", function() {
        testGrid[0][4].setBlack(true);
        testGrid[0][5].setBlack(true);

        it("cell is not black", function() {
            assert.deepEqual(isNextBlack([0, 0], 6, testGrid), false);
            assert.deepEqual(isNextBlack([0, 1], 6, testGrid), false);
            assert.deepEqual(isNextBlack([0, 2], 6, testGrid), false);
            assert.deepEqual(isNextBlack([0, 3], 6, testGrid), false);
        });
        it("cell is black", function() {
            assert.deepEqual(isNextBlack([0, 4], 6, testGrid), true);
            assert.deepEqual(isNextBlack([0, 5], 6, testGrid), true);
        });
    });
    describe("isNextNotBlack", function() {
        testGrid[0][4].setBlack(true);
        testGrid[0][5].setBlack(true);

        it("cell is black", function() {
            assert.deepEqual(isNextNotBlack([0, 0], 6, testGrid), true);
            assert.deepEqual(isNextNotBlack([0, 1], 6, testGrid), true);
            assert.deepEqual(isNextNotBlack([0, 2], 6, testGrid), true);
            assert.deepEqual(isNextNotBlack([0, 3], 6, testGrid), true);
        });
        it("cell is not black", function() {
            assert.deepEqual(isNextNotBlack([0, 4], 6, testGrid), false);
            assert.deepEqual(isNextNotBlack([0, 5], 6, testGrid), false);
        });
    });
});

