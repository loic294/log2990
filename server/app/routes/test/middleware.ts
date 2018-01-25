import { Request, Response, NextFunction } from "express";

import LexicalService from '../../services/lexical'

// Test lexical service
export async function lexical(req: Request, res: Response, next: NextFunction) {

	const { word } = req.params

	const lexicalService = new LexicalService()
	const testResult = await lexicalService.method1(word)

	res.json({ lexicalResult: testResult })
}