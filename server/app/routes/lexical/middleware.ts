import { Request, Response, NextFunction } from "express";
import LexicalService from "../../services/lexical";

export async function wordSearch(req: Request, res: Response, next: NextFunction): Promise<void> {

    const { word } = req.params;
    const { common } = req.params;

    const lexicalService: LexicalService = new LexicalService();

    try {
        const result: String = await lexicalService.wordSearch(word, common);
        if (result === "undefined") {
            throw new Error("No word found");
        }
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
        if (result === "No definitions") {
            throw new Error("No definitions found");
        }
        res.json({ lexicalResult: result });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
