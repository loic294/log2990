// tslint:disable:no-magic-numbers
import Word, { Orientation } from "../../../../common/lexical/word";

interface GridMessage {
    grid: Array<String>;
    clues: Array<Word>;
}

export const grid1: Array<String> = [
    "- - _ - - - _ - - -",
    "_ - _ _ _ _ _ _ _ _",
    "_ - _ - - - _ - - -",
    "_ - _ - - _ _ _ _ _",
    "_ - - - - - _ - - -",
    "_ _ _ _ _ _ _ _ _ _",
    "_ - - - - - _ - - -",
    "- - - - - - _ - - -",
    "- - - - - - _ - - -",
    "- _ _ _ _ _ _ _ _ -",
];

export const clues1: Array<Word> = [
    new Word("Increase", "Definition of word clue", [1, 2], Orientation.horizontal, 0),
    new Word("Carry", "Definition of word wound", [3, 5], Orientation.horizontal, 1),
    new Word("Understand", "Definition of word finish", [5, 2], Orientation.horizontal, 2),
    new Word("Manager", "Definition of word menu", [7, 1], Orientation.horizontal, 3),
    new Word("Industry", "Definition of word grave", [9, 1], Orientation.horizontal, 4),
    new Word("Tissue", "Definition of word worry", [1, 0], Orientation.vertical, 5),
    new Word("Liar", "Definition of word adventure", [0, 2], Orientation.vertical, 6),
    new Word("Department", "Definition of word crossword", [0, 6], Orientation.vertical, 7),
    new Word("Strong", "Definition of word push", [1, 8], Orientation.vertical, 8)
];

export const grid2: Array<String> = [
    "- - - - - - - - _ -",
    "- - - - _ - _ _ _ _",
    "_ _ _ _ _ - _ - _ -",
    "_ - - - _ - _ - _ -",
    "_ - - - _ - _ - - -",
    "_ - _ _ _ _ _ _ - _",
    "_ - - - _ - _ - - _",
    "- _ _ _ _ - _ - - _",
    "- - - - _ - _ - - _",
    "_ _ _ _ _ - _ _ _ _",
];

export const clues2: Array<Word> = [
    new Word("Clue", "Definition of word clue", [1, 6], Orientation.horizontal, 1),
    new Word("Wound", "Definition of word wound", [2, 0], Orientation.horizontal, 2),
    new Word("Finish", "Definition of word finish", [5, 2], Orientation.horizontal, 3),
    new Word("Menu", "Definition of word menu", [7, 1], Orientation.horizontal, 4),
    new Word("Grave", "Definition of word grave", [9, 0], Orientation.horizontal, 5),
    new Word("Dock", "Definition of word dock", [9, 6], Orientation.horizontal, 6),
    new Word("Worry", "Definition of word worry", [2, 0], Orientation.vertical, 7),
    new Word("Adventure", "Definition of word adventure", [1, 4], Orientation.vertical, 8),
    new Word("Crossword", "Definition of word crossword", [1, 6], Orientation.vertical, 9),
    new Word("Push", "Definition of word push", [0, 8], Orientation.vertical, 10),
    new Word("Crack", "Definition of word crack", [5, 9], Orientation.vertical, 11),
];

export const grid3: Array<String> = [
    "_ - - - _ _ _ _ _ -",
    "_ - _ - - - - _ - _",
    "_ _ _ _ - _ _ _ _ _",
    "_ - _ - - - - _ - _",
    "_ - _ - - - - _ - _",
    "- _ _ _ _ _ _ _ - _",
    "- - _ - - - - - - _",
    "_ _ _ _ _ _ _ _ - _",
    "- - _ - - - - _ - -",
    "- - - _ _ _ _ _ _ _",
];

export const clues3: Array<Word> = [
    new Word("Shack", "Definition of word Shack", [1, 2], Orientation.horizontal, 0),
    new Word("Want", "Definition of word Want", [3, 5], Orientation.horizontal, 1),
    new Word("Place", "Definition of word Place", [5, 2], Orientation.horizontal, 2),
    new Word("Produce", "Definition of word Produce", [7, 1], Orientation.horizontal, 3),
    new Word("Business", "Definition of word Business", [9, 1], Orientation.horizontal, 4),
    new Word("Country", "Definition of word Country", [9, 1], Orientation.horizontal, 5),
    new Word("Power", "Definition of word Power", [1, 0], Orientation.vertical, 6),
    new Word("Interest", "Definition of word Interest", [0, 2], Orientation.vertical, 7),
    new Word("Charge", "Definition of word Charge", [0, 6], Orientation.vertical, 8),
    new Word("Set", "Definition of word Set", [1, 8], Orientation.vertical, 9),
    new Word("Pelican", "Definition of word Pelican", [1, 8], Orientation.vertical, 10)
];

export const grid4: Array<String> = [
    "- - - _ _ _ _ - - -",
    "- - - - - _ - _ - -",
    "- _ _ _ _ _ _ _ _ -",
    "_ - - - - _ - _ - -",
    "_ - - - - _ - _ - _",
    "_ _ _ _ _ _ _ _ _ _",
    "_ - - - - _ - _ - _",
    "_ - - - - _ - - - _",
    "_ - - - - _ - _ _ _",
    "_ _ _ _ _ - - - - -",
];

export const clues4: Array<Word> = [
    new Word("Rice", "Definition of word clue", [0, 3], Orientation.horizontal, 0),
    new Word("Remember", "Definition of word wound", [2, 1], Orientation.horizontal, 1),
    new Word("Government", "Definition of word finish", [5, 0], Orientation.horizontal, 2),
    new Word("Try", "Definition of word menu", [8, 6], Orientation.horizontal, 3),
    new Word("Think", "Definition of word grave", [9, 0], Orientation.horizontal, 4),
    new Word("Suggest", "Definition of word worry", [3, 0], Orientation.vertical, 5),
    new Word("Lean", "Definition of word adventure", [4, 3], Orientation.vertical, 6),
    new Word("Community", "Definition of word crossword", [0, 5], Orientation.vertical, 7),
    new Word("Member", "Definition of word crossword", [0, 5], Orientation.vertical, 8),
    new Word("Study", "Definition of word push", [1, 8], Orientation.vertical, 9)
];

const grids: Array<Array<String>> = [grid1, grid2, grid3, grid4];
const clues: Array<Array<Word>> = [clues1, clues2, clues3, clues4];

export const selectGrid: () => GridMessage = () => {
    const FACTOR: number = 100;
    const gridID: number = Math.round((Math.random() * FACTOR) % 3);

    return {
        grid: grids[gridID],
        clues: clues[gridID]
    };
};
