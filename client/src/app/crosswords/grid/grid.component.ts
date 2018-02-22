/* tslint:disable:no-shadowed-variable */

import { Component, OnInit } from "@angular/core";

import { Case } from "../../../../../common/grid/case";
import { GridService } from "../../grid.service/grid.service";

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
    styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit {

    public constructor( private _gridService: GridService) {}

    public updateGrid(event: KeyboardEvent, c: Case): void {
        this._gridService.updateGrid(event, c);
    }

    public selectCaseFromGrid(c: Case): void {
        this._gridService.selectCaseFromGrid(c);
    }

    public ngOnInit(): void {}
}
