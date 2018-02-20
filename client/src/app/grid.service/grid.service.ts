import { Injectable } from "@angular/core";
import { GRID } from "../mock-grid";
import { Case } from "../../../../common/grid/case";

@Injectable()
export class GridService {
    public getGrid(): Array<Array<Case>> {
        return GRID.map((row: string) => {
            const strings: Array<string> = row.split(" ");

            return strings.map((c: string) => new Case(c));
        });
    }
}
