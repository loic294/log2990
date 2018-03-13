/* tslint:disable:no-shadowed-variable */

import { Component, OnInit } from "@angular/core";

import { Cell } from "../../../../../common/grid/cell";
import { GridService } from "../grid.service/grid.service";

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

    public ngOnInit(): void {}
}
