
export class Case {

	private _isSelected: boolean = false

	constructor(private _char: String = "-") {

	}

	public getChar() {
		return this._char;
	}

	public select() {
		this._isSelected = true;
	}

	public unselect() {
		this._isSelected = false;
	}

	public selected() {
		return this._isSelected;
	}

}