import { Component, OnInit } from "@angular/core";
import Word, { Orientation } from "../../../../../common/lexical/word";

import { WordService } from "../../word.service/word.service";

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
    new Word("Clue", "Definition of word clue", [1, 6], Orientation.horizontal, 0),
    new Word("Wound", "Definition of word wound", [2, 0], Orientation.horizontal, 1),
    new Word("Finish", "Definition of word finish", [5, 2], Orientation.horizontal, 2),
    new Word("Menu", "Definition of word menu", [7, 1], Orientation.horizontal, 3),
    new Word("Grave", "Definition of word grave", [9, 0], Orientation.horizontal, 4),
    new Word("Dock", "Definition of word dock", [9, 6], Orientation.horizontal, 5),
    new Word("Worry", "Definition of word worry", [2, 0], Orientation.vertical, 6),
    new Word("Adventure", "Definition of word adventure", [1, 4], Orientation.vertical, 7),
    new Word("Crossword", "Definition of word crossword", [1, 6], Orientation.vertical, 8),
    new Word("Push", "Definition of word push", [0, 8], Orientation.vertical, 9),
    new Word("Crack", "Definition of word crack", [5, 9], Orientation.vertical, 10),
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

    public constructor(public _wordService: WordService) { }

    public onSelect(clue: Word): void {
        if (!clue.validated) {
            this._selectedClue = clue;
            this._wordService.selectWordFromClue(this._selectedClue);
        }
    }

    public get selectedClue(): Word {
        return this._selectedClue;
    }

    public get clues(): Array<Word> {
        return this._clues;
    }

    private foundWord(item: Word, position: Word): boolean {
        return (item.col === position.col &&
            item.row === position.row &&
            item.direction === position.direction &&
            !item.validated);
    }

    private selectWord(position: Word): void {
        if (position != null) {
            for ( const item of this._clues) {
                if (this.foundWord(item, position)) {
                        this._selectedClue = item;
                }
            }
        } else {
            this._selectedClue = null;
        }
    }

    public ngOnInit(): void {
        this._wordService.wordFromGrid
    .subscribe((_wordFromGrid) => this.selectWord(_wordFromGrid));
    }

}
