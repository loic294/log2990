export enum Orientation {
    horizontal = 0,
    vertical = 1,
}

export interface IWord {
    name: string,
    desc: string,
    position: Array<number>,
    orientation: Orientation,
    index: number,
    isValidated: boolean,
}

export default class Word implements IWord {
  
    constructor(
        public name : string,
        public desc : string,
        public position : Array<number>,
        public orientation : Orientation,
        public index : number,
		public isValidated: boolean = false,
    ) {}

    public get row(): number {
        return this.position[0];
    }

    public get col(): number {
        return this.position[1];
    }

    public get length(): number {
        return this.name.length;
    }
}