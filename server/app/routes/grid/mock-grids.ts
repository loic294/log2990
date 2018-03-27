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
    new Word("Increase", "Become or make greater in size", [1, 2], Orientation.horizontal, 0),
    new Word("Carry", "Support the weight of", [3, 5], Orientation.horizontal, 1),
    new Word("Understand", "Infer something from information received", [5, 0], Orientation.horizontal, 2),
    new Word("Industry", "Manufacture of goods in factories", [9, 1], Orientation.horizontal, 4),
    new Word("Tissue", "Any of the distinct types of material of which animals or plants are made", [1, 0], Orientation.vertical, 5),
    new Word("Liar", "False witness", [0, 2], Orientation.vertical, 6),
    new Word("Department", "An area of special expertise or responsibility", [0, 6], Orientation.vertical, 7)
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
    new Word("Clue", "A piece of evidence", [1, 6], Orientation.horizontal, 1),
    new Word("Wound", "An injury", [2, 0], Orientation.horizontal, 2),
    new Word("Finish", "Bring (a task or activity) to an end", [5, 2], Orientation.horizontal, 3),
    new Word("Menu", "A list of dishes available in a restaurant", [7, 1], Orientation.horizontal, 4),
    new Word("Grave", "A place of burial for a dead body", [9, 0], Orientation.horizontal, 5),
    new Word("Dock", "A platform for loading or unloading trucks or freight trains", [9, 6], Orientation.horizontal, 6),
    new Word("Worry", "Cause to feel anxiety or concern", [2, 0], Orientation.vertical, 7),
    new Word("Adventure", "An unusual and exciting, typically hazardous, experience ", [1, 4], Orientation.vertical, 8),
    new Word("Crossword", "Word puzzle", [1, 6], Orientation.vertical, 9),
    new Word("Push", "Exert force on", [0, 8], Orientation.vertical, 10),
    new Word("Crack", "A sudden sharp or explosive noise", [5, 9], Orientation.vertical, 11),
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
    new Word("Shack", "A roughly built hut or cabin", [0, 4], Orientation.horizontal, 0),
    new Word("Want", "Have a desire to possess", [2, 0], Orientation.horizontal, 1),
    new Word("Place", "A particular position or point in space", [2, 5], Orientation.horizontal, 2),
    new Word("Produce", "Make or manufacture from components", [5, 1], Orientation.horizontal, 3),
    new Word("Business", "A person's regular occupation", [7, 0], Orientation.horizontal, 4),
    new Word("Country", "A nation with its own government", [9, 3], Orientation.horizontal, 5),
    new Word("Power", "The ability to do something", [0, 0], Orientation.vertical, 6),
    new Word("Interest", "The state of wanting to know or learn about something ", [1, 2], Orientation.vertical, 7),
    new Word("Charge", "Demand (an amount) as a price from someone for a service rendered", [0, 7], Orientation.vertical, 8),
    new Word("Set", "Put, lay, or stand (something) in a specified place or position", [7, 7], Orientation.vertical, 9),
    new Word("Pelican", "A large gregarious waterbird with a long bill", [1, 9], Orientation.vertical, 10)
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
    new Word("Rice", "A swamp grass that is widely cultivated as a source of food, especially in Asia.", [0, 3], Orientation.horizontal, 0),
    new Word("Remember", "Have in or be able to bring to one's mind an awareness of", [2, 1], Orientation.horizontal, 1),
    new Word("Government", "The action or manner of controlling or regulating a nation", [5, 0], Orientation.horizontal, 2),
    new Word("Try", "Make an attempt or effort to do something", [8, 7], Orientation.horizontal, 3),
    new Word("Think", "Have a particular opinion, belief, or idea about someone or something.", [9, 0], Orientation.horizontal, 4),
    new Word("Suggest", "Put forward for consideration.", [3, 0], Orientation.vertical, 5),
    new Word("Community", "A group of people living in the same place", [0, 5], Orientation.vertical, 6),
    new Word("Member", "A person, animal, or plant belonging to a particular group", [1, 7], Orientation.vertical, 7),
    new Word("Study", "An academic book or article on a particular topic", [4, 9], Orientation.vertical, 8)
];

const grids: Array<Array<String>> = [grid1, grid2, grid3, grid4];
const clues: Array<Array<Word>> = [clues1, clues2, clues3, clues4];

export const selectGrid: () => GridMessage = () => {
    const FACTOR: number = 100;
    const gridID: number = Math.round((Math.random() * FACTOR) % 4);

    return {
        grid: grids[gridID],
        clues: clues[gridID]
    };
};
