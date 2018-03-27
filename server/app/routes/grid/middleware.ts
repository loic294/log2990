import { Request, Response, NextFunction } from "express";
import GridGeneration from "../../services/gridGeneration/gridGeneration";
import { selectGrid } from "./mock-grids";

// Test lexical service
export const generate: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const GRID_SIZE: number = 10;

    const grid: GridGeneration = new GridGeneration();
    grid.initializeGrid(GRID_SIZE);
    await grid.findAllWordsSpaces();
    const gridString: String|void = await grid.startRecursion();

    res.json({
        gridString,
        grid: grid.grid,
        words: grid.words
    });

};

export const mock: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    res.json(selectGrid());

};
