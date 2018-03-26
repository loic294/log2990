/* tslint:disable:no-shadowed-variable */

import { Component, OnInit } from "@angular/core";

import { Cell } from "../../../../../common/grid/cell";
import { GridService } from "../../grid.service/grid.service";
import { CELL_HEIGHT } from "../../constants";

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

    public selectCellFromGrid(c: Cell): void {
        this._gridService.selectCellFromGrid(c);
    }

    private highlightLength(wordLength: number): string {
        const wordTotal: number = wordLength * CELL_HEIGHT;

        return wordTotal.toString() + "px";
    }

    public highlightStyle(isOther: boolean): {} {
        const wordLength: number = this._gridService.wordLength(isOther);
        let color: string;
        isOther ? color = "blue" : color = "red";

        return {
            "height": this._gridService.isHorizontal(isOther) ?  CELL_HEIGHT + "px" : this.highlightLength(wordLength),
            "width": !this._gridService.isHorizontal(isOther) ? CELL_HEIGHT + "px" :  this.highlightLength(wordLength),
            "border-color": color
          };
    }

    public ngOnInit(): void {}
}
