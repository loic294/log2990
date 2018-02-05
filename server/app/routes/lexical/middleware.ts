import { Request, Response, NextFunction } from "express";

import LexicalService from "../../services/lexical";

export async function wordSearch(req: Request, res: Response, next: NextFunction): Promise<void> {

    const { word } = req.params;
    const { common } = req.params;

    const lexicalService: LexicalService = new LexicalService();

    const testResult: String = await lexicalService.wordSearch(word, common);

    res.json({ lexicalResult: testResult });
}

export async function wordDefintion(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { level } = req.params;
    const { word } = req.params;

    const lexicalService: LexicalService = new LexicalService();

    const testResult: string = await lexicalService.wordDefinition(level, word);

    res.json({ lexicalResult: testResult });
}
