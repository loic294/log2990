/*
	This service will be responsible of requesting and creating lexical content.
*/
import axios from 'axios';
import { read } from 'fs';
const API_KEY = "api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

export default class LexicalService {

	constructor() {}

	async baseDefinition(word: string) {
		const WORDNIK_URL = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=200&${API_KEY}`;
		try {
			const response = await axios.get(WORDNIK_URL);
			return response.data;
		} catch (err) {
			throw err;
		}
	}

	private async baseWordSearch(requirements: string) {
		const DATAMUSE_URL = `https://api.datamuse.com/words?sp=${requirements}&md=f&max=1500`;

		try {
			const response = await axios.get(DATAMUSE_URL);
			return response.data;
		} catch (err) {
			throw err;
		}
	}

	public async wordDefinition(level: string, word: string) {
		let definitions: any[] = [];
		try {
			let data: any = await this.baseDefinition(word);

			for (let def in data) {
				if (!data[def].text.includes(` ${word} ` || ` ${word}`)) {
					definitions.push(data[def].text);
				}
			}
			// Remove examples from definitions
			for (let def in definitions) {
				let definition = definitions[def];
				if (definition.includes(":")) {
					definitions[def] = definition.substring(0, definition.indexOf(":"));
				}
			}
			// Remove unecessary details from definitions
			for (let def in definitions) {
				let definition = definitions[def];
				if (definition.includes(";")) {
					definitions[def] = definition.substring(0, definition.indexOf(";"));
				}
			}

			switch (level) {
				case 'easy':
					{
						return definitions[0];
					}
				case 'hard':
					{
						if (definitions.length > 1) {
							let min = Math.ceil(1);
							let max = Math.floor(definitions.length);
							return definitions[Math.floor((Math.random() * (max - min) + min))];
						} else {
							return definitions[0];
						}
					}
			}

		} catch (err) {
			throw err;
		}
	}

	public async wordSearch(researchCriteria: string, common: boolean) {
		var request: string = "";

		for (var i = 0; i < researchCriteria.length; i++) {
			if (researchCriteria[i].match(/[a-z]/i))
				request += researchCriteria[i];
			else
				request += "?".repeat(+researchCriteria[i]);
		}

		let rawResponse: any = await this.baseWordSearch(request);

		return this.commonFinder(common, rawResponse, request);
	}


	private commonFinder(common: boolean, rawResponse: any, requestString: string): string {

		var responseLength = rawResponse.length;

		while (responseLength) {

			var randomInt = Math.floor(Math.random() * rawResponse.length);
			var word: string = rawResponse[randomInt].word;
			var freq: number = rawResponse[randomInt].tags[0].substring(2);

			if (word.length === requestString.length) {

				if (common && freq > 8)
					return word;

				if (!common && freq < 8)
					return word;

			}
			responseLength--;
		}
		return rawResponse[0].word;
	}
}