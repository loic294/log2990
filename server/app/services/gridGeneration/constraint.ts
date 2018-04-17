import Word, { Orientation } from "../../../../common/lexical/word";
import { checkIntersection } from "line-intersect";
export interface SubConstraint {
    wordIndex: number;
    point: Array<number>;
}

export default class Constraint extends Word {
    public constraints?: Array<SubConstraint>;
    public size?: number;
    public invalid?: boolean;

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

export const intersects: (word1: Constraint, word2: Constraint) => Array<number>
    = (word1: Constraint, word2: Constraint): Array<number> => {

    if (word1.orientation === word2.orientation) {
        return [];
    }

    const { point, type }: { point: { x: number, y: number }, type: string } = checkIntersection(
        word1.position[1],
        word1.position[0],
        word1.orientation === Orientation.horizontal ? word1.position[1] + word1.length : word1.position[1],
        word1.orientation === Orientation.vertical ? word1.position[0] + word1.length : word1.position[0],
        word2.position[1],
        word2.position[0],
        word2.orientation === Orientation.horizontal ? word2.position[1] + word2.length : word2.position[1],
        word2.orientation === Orientation.vertical ? word2.position[0] + word2.length : word2.position[0],
    );

    return type === "intersecting" ? [point.y, point.x] : [];
};

export const createConstraints: (words: Array<Constraint>) => Promise<Array<Constraint>> = async (words: Array<Constraint>) => {
    const wordsCount: number = words.length;

    for (let first: number = 0; first < wordsCount; first++) {
        for (let second: number = first; second < wordsCount; second++) {
            const intersection: Array<number> = intersects(words[first], words[second]);
            if (intersection.length > 0) {

                words[first].constraints.push({
                    wordIndex: second,
                    point: intersection
                });

                words[second].constraints.push({
                    wordIndex: first,
                    point: intersection
                });

            }
        }
    }

    return [...words];
};
