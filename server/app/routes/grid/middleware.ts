import { Request, Response, NextFunction } from "express";
import GridGeneration from "../../services/gridGeneration/gridGeneration";
import { GRID_SIZE } from "../../../../common/grid/difficulties";

export const generate: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const grid: GridGeneration = new GridGeneration();
    grid.initializeGrid(GRID_SIZE);
    await grid.findAllWordsSpaces();
    await grid.startRecursion();

    res.json({
        grid: grid.grid,
        clues: grid.words
    });

};
