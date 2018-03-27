import { Component, OnInit } from "@angular/core";
import { SocketService } from "../socket.service/socket.service";
import Word from "../../../../../common/lexical/word";

import { WordService } from "../../word.service/word.service";
import { GridLoadingService } from "../../grid-loading.service/grid-loaing.service";

@Component({
    selector: "app-clues",
    templateUrl: "./clues.component.html",
    styleUrls: ["./clues.component.css"]
})
export class CluesComponent implements OnInit {
    private _clues: Array<Word>;
    private _wordCount: number;
    private _selectedClue: Word;
    private _cheatMode: boolean;

    public constructor(
        public _wordService: WordService,
        private socketService: SocketService,
        private gridLoadingService: GridLoadingService
    ) {
        this.clues = [];
        this._selectedClue = null;

        this.gridLoadingService.newClues.subscribe(
            (clues: Array<Word>) => {
                this.clues = clues;
                this._wordCount = clues.length;
                this.socketService.setWordCount(this._wordCount);
            });
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

    public set clues(clues: Array<Word>) {
        this._clues = clues;
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

    public switchCheatMode(): void {
        this._cheatMode = !this._cheatMode;
    }

    public get cheatMode(): boolean {
        return this._cheatMode;
    }

    public ngOnInit(): void {
        this._wordService.wordFromGrid
            .subscribe((_wordFromGrid) => this.selectWord(_wordFromGrid));
    }

}
