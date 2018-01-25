import { Case } from "./case";

export class CaseWithPos extends Case{
    constructor(private row : number, private col : number){
        super();
    }

    public getRow() : number {
        return this.row;
    }
    
    public getCol() : number {
        return this.col;
    }
    
}