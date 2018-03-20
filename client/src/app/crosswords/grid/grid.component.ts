/* tslint:disable:no-shadowed-variable */

import { Component, OnInit } from "@angular/core";

import { Cell } from "../../../../../common/grid/cell";
import { GridService } from "../../grid.service/grid.service";
import { Orientation } from "../../../../../common/lexical/word";

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

    public highligthStyle(): any {
        const wordTotal: number = this._gridService.wordLength() * 50;
        console.log(wordTotal);
        let abx: string;
        abx = wordTotal.toString();
        console.log(abx);
        abx += "px";
        console.log(abx);

        // tslint:disable-next-line:typedef
        // tslint:disable-next-line:no-unnecessary-local-variable
        const styles = {
            // "background-color": this.user.isExpired ? "red" : "transparent",
            // "font-weight": this.isImportant ? "bold" : "normal"
            // "height": "50px",
            "height": !this._gridService.isVertical() ? "50px" : abx,
            "width": this._gridService.isVertical() ? "50px" : abx
          };

          console.log

        return styles;

    }
    public ngOnInit(): void {}
}
