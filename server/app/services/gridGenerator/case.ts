export class Case{

    constructor(private letter : string = "", private black : boolean = false, private selected : boolean = false) {
        
    }

    public getLetter() : string {
        return this.letter;
    }

    public isBlack() : boolean {
        return this.black;
    }

    public isSelected() : boolean {
        return this.selected;
    }

    public setLetter(letter : string) : void{
        this.letter = letter;
    }

    public setBlack(black : boolean) : void{
        this.black = black;
    }

    public setSelected(selected : boolean) : void{
        this.selected = selected;
    }
}