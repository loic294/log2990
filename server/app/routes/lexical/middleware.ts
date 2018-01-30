import { Request, Response, NextFunction } from "express";

import LexicalService from '../../services/lexical'

// Test lexical service
export async function lexical(req: Request, res: Response, next: NextFunction) {

	const { word } = req.params

	const lexicalService = new LexicalService()

	const testResult = await lexicalService.wordSearch(word, true)

	res.json({ lexicalResult: testResult })
}

export async function wordSearch(req: Request, res: Response, next: NextFunction) {

	const { word } = req.params
	const { common } = req.params

	const lexicalService = new LexicalService()

	const testResult = await lexicalService.wordSearch(word, common)

	res.json({ lexicalResult: testResult })
}