import { Component, OnInit } from "@angular/core";
import Word from "../../../../../common/lexical/word";

import { WordService } from "../word.service/word.service";

import CLUES from "../mock-words";

@Component({
    selector: "app-clues",
    templateUrl: "./clues.component.html",
    styleUrls: ["./clues.component.css"]
})
export class CluesComponent implements OnInit {
    private _clues: Array<Word>;
    private _selectedClue: Word;

    public constructor(public _wordService: WordService) {
        this._clues = CLUES;
        this._selectedClue = null;
    }

    public onSelect(clue: Word): void {
        if (!clue.isValidated) {
            this._selectedClue = clue;
            this._wordService.selectWordFromClue(this._selectedClue);
        } else {
            this._selectedClue = null;
            this._wordService.selectWordFromClue(null);
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
            item.orientation === position.orientation &&
            !item.isValidated);
    }

    private selectWord(position: Word): void {
        if (position !== null) {
            for ( const item of this._clues) {
                if (this.foundWord(item, position)) {
                    this._selectedClue = item;
                    this._wordService.selectWordFromClue(this._selectedClue);
                }
            }
        }
    }

    public ngOnInit(): void {
        this._wordService.wordFromGrid
            .subscribe((_wordFromGrid) => this.selectWord(_wordFromGrid));
    }

}
