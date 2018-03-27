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
    new Word("Shack", "Definition of word Shack", [0, 4], Orientation.horizontal, 0),
    new Word("Want", "Definition of word Want", [2, 0], Orientation.horizontal, 1),
    new Word("Place", "Definition of word Place", [2, 5], Orientation.horizontal, 2),
    new Word("Produce", "Definition of word Produce", [5, 1], Orientation.horizontal, 3),
    new Word("Business", "Definition of word Business", [7, 0], Orientation.horizontal, 4),
    new Word("Country", "Definition of word Country", [9, 3], Orientation.horizontal, 5),
    new Word("Power", "Definition of word Power", [0, 0], Orientation.vertical, 6),
    new Word("Interest", "Definition of word Interest", [1, 2], Orientation.vertical, 7),
    new Word("Charge", "Definition of word Charge", [0, 7], Orientation.vertical, 8),
    new Word("Set", "Definition of word Set", [7, 7], Orientation.vertical, 9),
    new Word("Pelican", "Definition of word Pelican", [1, 9], Orientation.vertical, 10)
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
    new Word("Rice", "Definition of word Rice", [0, 3], Orientation.horizontal, 0),
    new Word("Remember", "Definition of word Remember", [2, 1], Orientation.horizontal, 1),
    new Word("Government", "Definition of word Government", [5, 0], Orientation.horizontal, 2),
    new Word("Try", "Definition of word Try", [8, 7], Orientation.horizontal, 3),
    new Word("Think", "Definition of word Think", [9, 0], Orientation.horizontal, 4),
    new Word("Suggest", "Definition of word Suggest", [3, 0], Orientation.vertical, 5),
    new Word("Community", "Definition of word Community", [0, 5], Orientation.vertical, 6),
    new Word("Member", "Definition of word Member", [1, 7], Orientation.vertical, 7),
    new Word("Study", "Definition of word Study", [4, 9], Orientation.vertical, 8)
];

const grids: Array<Array<String>> = [grid1, grid2, grid3, grid4];
const clues: Array<Array<Word>> = [clues1, clues2, clues3, clues4];

export const selectGrid: (defaultID: number) => GridMessage = (defaultID: number) => {
    const FACTOR: number = 100;
    const gridID: number = Math.round((Math.random() * FACTOR) % 4);

    return {
        grid: grids[defaultID || gridID],
        clues: clues[defaultID || gridID]
    };
};
