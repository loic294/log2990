export default class Word {
  
    constructor(
        private name : string,
        private desc : string,
        private col : number,
        private row : number,
        private direction : string,
    ) {}

    public getName() {
        return this.name
    }

    public getDesc() {
        return this.desc
    }

    public getCol() {
        return this.col
    }

    public getRow() {
        return this.row
    }

    public getDirection() {
        return this.direction
    }

    public getLength() {
        return this.name.length
    }

}