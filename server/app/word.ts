export enum Orientation {
    horizontal = 0,
    vertical = 1,
}

export class Word {
    public constructor(
        private _position: [number, number],
        private _orientation: Orientation,
        private _name: string) {}

        public get position(): [number, number] {
            return this._position;
        }
    
        public get orientation(): Orientation {
            return this._orientation;
        }
        
        public get name(): string {
            return this._name;
        }

    
}


