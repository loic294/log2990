export class Case {

	private _isSelected: boolean = false

	constructor(private _char: String = "-", private _x = 0, private _y = 0) {

	}
	
	public setChar(c: string) {
            this._char = c;
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
	
	public getX() {
            return this._x;
        }
        
        public getY() {
            return this._y;
        }
        
        public setX(x: number) {
            this._x = x;
        }
        
        public setY(y: number) {
            this._y = y;
        }

}