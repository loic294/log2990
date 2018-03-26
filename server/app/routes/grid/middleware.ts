import { Request, Response, NextFunction } from "express";
import { selectGrid } from "./mock-grids";

// Test lexical service
export const generate: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    res.json({ success: true });

};

export const mock: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    res.json({ grid: selectGrid() });

};
