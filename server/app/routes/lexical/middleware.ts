import { Request, Response, NextFunction } from "express";

import LexicalService from "../../services/lexical";

export async function wordSearch(req: Request, res: Response, next: NextFunction): Promise<void> {

    const { word } = req.params;
    const { common } = req.params;

    const lexicalService: LexicalService = new LexicalService();

    try {
        const result: String = await lexicalService.wordSearch(word, common);
        res.json({ lexicalResult: result });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function wordDefintion(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { level } = req.params;
    const { word } = req.params;

    const lexicalService: LexicalService = new LexicalService();

    try {
        const result: string = await lexicalService.wordDefinition(level, word);
        res.json({ lexicalResult: result });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
