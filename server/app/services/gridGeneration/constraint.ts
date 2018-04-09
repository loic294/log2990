import Word, { Orientation } from "../../../../common/lexical/word";

export interface SubConstraint {
    wordIndex: number;
    point: Array<number>;
}

export default class Constraint extends Word {
    public constraints?: Array<SubConstraint>;
    public size?: number;

    constructor(
        public name: string,
        public desc: string,
        public position: Array<number>,
        public orientation: Orientation,
        public index: number = 0,
        public isValidated: boolean = false
    ) {
        super(name, desc, position, orientation, index, isValidated);
        this.constraints = [];
        this.size = name.length;
    }

    public get length(): number {
        return this.size;
    }

    public set length(size: number) {
        this.size = size;
    }

}
