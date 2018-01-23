
export class Case {

	private isSelected: boolean = false

	constructor(private char: String = "-") {

	}

	public getChar() {
		return this.char;
	}

	public select() {
		this.isSelected = true;
	}

	public unselect() {
		this.isSelected = false;
	}

	public selected() {
		return this.isSelected;
	}

}