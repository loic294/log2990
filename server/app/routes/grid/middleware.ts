import { Request, Response, NextFunction } from "express";
import GridGeneration from "../../services/gridGeneration/gridGeneration";

// Test lexical service
export const generate: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const GRID_SIZE: number = 8;

    const grid: GridGeneration = new GridGeneration();
    grid.fillGridWithCells(GRID_SIZE);
    grid.fillGridWithBlackCells();
    grid.findAllWordsSpaces();

    res.json({ success: true });

};
