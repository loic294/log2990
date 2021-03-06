import { Component } from "@angular/core";

import { Cell } from "../../../../../common/grid/cell";
import { GridService } from "../grid.service/grid.service";
import { CELL_HEIGHT } from "../../constants";

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"],
    providers: [ GridService ]
})

export class GridComponent {

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

        return {
            "height": this._gridService.isHorizontal(isOther) ?  CELL_HEIGHT + "px" : this.highlightLength(wordLength),
            "width": !this._gridService.isHorizontal(isOther) ? CELL_HEIGHT + "px" :  this.highlightLength(wordLength),
          };
    }

}
