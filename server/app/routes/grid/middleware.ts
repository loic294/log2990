import { Request, Response, NextFunction } from "express";
import GridGeneration from "../../services/gridGeneration/gridGeneration";

// Test lexical service
export const generate: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const TEN: number = 10;

    const grid: GridGeneration = new GridGeneration();
    grid.fillGridWithCells(TEN);
    grid.fillGridWithBlackCells();

    res.json({ success: true });

};
