/* tslint:disable:no-shadowed-variable */

import { Component, OnInit } from "@angular/core";

import { Cell } from "../../../../../common/grid/cell";
import { GridService } from "../../grid.service/grid.service";
import { Orientation } from "../../../../../common/lexical/word";
import { NgStyle } from "@angular/common";

/** TEMPORARY MOCKED CONTENT
   * Example table
   * **/
/*
const grid: Array<String> = [
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
*/
@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"],
    providers: [ GridService ]
})

export class GridComponent implements OnInit {

    public constructor( private _gridService: GridService) {}

    public updateGrid(event: KeyboardEvent, c: Cell): void {
        this._gridService.updateGrid(event, c);
    }

    public selectCaseFromGrid(c: Cell): void {
        this._gridService.selectCaseFromGrid(c);
    }

    public highligthStyle(): {} {
        const cellHeigth: number = 50;
        const wordTotal: number = this._gridService.wordLength() * cellHeigth;
        let formatedNumber: string;
        formatedNumber = wordTotal.toString();
        formatedNumber += "px";

        // tslint:disable-next-line:no-unnecessary-local-variable
        const styles: {} = {
            "height": !this._gridService.isVertical() ? "50px" : formatedNumber,
            "width": this._gridService.isVertical() ? "50px" : formatedNumber
          };

        return styles;
    }

    public highligthStyleOtherPlayer(): {} {
        const cellHeigth: number = 50;
        const wordTotal: number = this._gridService.wordLengthOther() * cellHeigth;
        let formatedNumber: string;
        formatedNumber = wordTotal.toString();
        formatedNumber += "px";

        // tslint:disable-next-line:no-unnecessary-local-variable
        const styles: {} = {
            "height": !this._gridService.isVerticalOther() ? "50px" : formatedNumber,
            "width": this._gridService.isVerticalOther() ? "50px" : formatedNumber,
            "border-color": "blue"
          };

        return styles;
    }

    public ngOnInit(): void {}
}
