import { Request, Response, NextFunction } from "express";

import GridGeneratorService from "../../services/gridGenerator/word-generator";
import { Case } from "../../../../common/grid/case";

export async function generate(req: Request, res: Response, next: NextFunction): Promise<void> {

    const gridGeneratorService: GridGeneratorService = new GridGeneratorService();
    await gridGeneratorService.generateWords("easy");
    const grid: Case[][] = gridGeneratorService.getGrid();

    res.json({
        grid,
        horizontalWords: gridGeneratorService.horizontalWordArray,
        verticalWords: gridGeneratorService.verticalWordArray,
    });
}
