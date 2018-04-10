export interface Player{
    name: string;
    color: Color;
    score: number;
}

export enum Mode {
    SinglePlayer = "Single Player",
    MultiPlayer = "Two Players"
}

export enum Color{
    red = 0,
    blue = 1
}