import { Case } from "./case";

export class CaseWithPos extends Case{
    constructor(inheritedCase : Case, private row : number, private col : number){
        super();
        this.setBlack(inheritedCase.isBlack());
        this.setSelected(inheritedCase.isSelected());
        this.setLetter(inheritedCase.getLetter());
    }

    public getRow() : number {
        return this.row;
    }
    
    public getCol() : number {
        return this.col;
    }
    
    public addPosition(row : number, col : number) {
        this.row = row;
        this.col = col;
    }
}