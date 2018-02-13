import { Request, Response, NextFunction } from "express";
import LexicalService from "../../services/lexical";

// tslint:disable-next-line:no-inferrable-types
const ERR_500: number = 500;

export const wordSearch: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

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
        res.status(ERR_500).send(err.message);
    }
};

export const wordDefinition: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

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
        res.status(ERR_500).send(err.message);
    }
};

export const wordAndDefinition: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { criteria } = req.params;
    const { common } = req.params;
    const { level } = req.params;

    const lexicalService: LexicalService = new LexicalService();

    try {
        const result: string[] = await lexicalService.wordAndDefinition(criteria, common, level);
        res.json({ lexicalResult: result });

    } catch (err) {
        res.status(ERR_500).send(err.message);
    }

};
