
export class Case {

	constructor(private char: String = "") {

	}

	getChar() {
		return this.char;
	}
	
	setChar(c: String) {
            this.char = c;
        }

}