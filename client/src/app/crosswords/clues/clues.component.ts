import { Component, OnInit } from "@angular/core";
import Word, { Orientation } from "../../../../../common/lexical/word";

/** TEMPORARY MOCKED CONTENT
 *
 * Example table
 *
 *   0 1 2 3 4 5 6 7 8 9
 * 0 - - - - - - - - P -
 * 1 - - - - A - C L U E
 * 2 W O U N D - R - S -
 * 3 O - - - V - O - H -
 * 4 R - - - E - S - - -
 * 5 R - F I N I S H - C
 * 6 Y - - - T - W - - R
 * 7 - M E N U - O - - A
 * 8 - - - - R - E - - C
 * 9 G R A V E - D O C K
 * **/

const CLUES: Array<Word> = [
    new Word("Clue", "Definition of word clue", [1, 6], Orientation.horizontal),
    new Word("Wound", "Definition of word wound", [2, 0], Orientation.horizontal),
    new Word("Finish", "Definition of word finish", [5, 2], Orientation.horizontal),
    new Word("Menu", "Definition of word menu", [7, 1], Orientation.horizontal),
    new Word("Grave", "Definition of word grave", [9, 0], Orientation.horizontal),
    new Word("Dock", "Definition of word dock", [9, 6], Orientation.horizontal),
    new Word("Worry", "Definition of word worry", [2, 0], Orientation.vertical),
    new Word("Adventure", "Definition of word adventure", [1, 4], Orientation.vertical),
    new Word("Crossword", "Definition of word crossword", [1, 6], Orientation.vertical),
    new Word("Push", "Definition of word push", [0, 8], Orientation.vertical),
    new Word("Crack", "Definition of word crack", [5, 9], Orientation.vertical),
];

/** END OF MOCKED CONTENT **/

@Component({
    selector: "app-clues",
    templateUrl: "./clues.component.html",
    styleUrls: ["./clues.component.css"]
})
export class CluesComponent implements OnInit {

    private _clues: Array<Word> = CLUES;

    private _selectedClue: Word;

    public onSelect(clue: Word): void {
        this._selectedClue = clue;
    }

    public get selectedClue(): Word {
        return this._selectedClue;
    }

    public get clues(): Array<Word> {
        return this._clues;
    }

    public constructor() { }

    public ngOnInit(): void {
    }

}
