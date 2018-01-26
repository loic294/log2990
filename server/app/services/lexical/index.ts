/*
	This service will be responsible of requesting and creating lexical content.
*/
import axios from 'axios';
const API_KEY = "api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"; 

export default class LexicalService {

	constructor() {}

	// private usedWords: Array<String> = null;

	async method1 (word: string = 'hello') {
		// Cette méthode est asynchrone

		try { // To be safe, we detect errors with try/catch

			// ... do some asynchronous work such as requesting data from the server

			return word

		} catch(err) {
			throw err
		}

	}

	async baseDefinition(word: string) {  
        const url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=200&${API_KEY}`; 
		try {
			const response = await axios.get(url);
			return response.data;
		} catch(err){
			throw err;
		}
	}
	
	private async baseWordSearch(requirements: string){
		const DATAMUSE_URL = `https://api.datamuse.com/words?sp=${requirements}&md=f`;
		
		try {
			const response = await axios.get(DATAMUSE_URL);
			return response.data;
		} catch(err){
			throw err;
		}
	}

	public async lengthSearch(length: number, common: boolean){
		var request: string = "?";
		
		let test: any = await this.baseWordSearch(request.repeat(length));

		return test[Math.floor(Math.random() * test.length) + 1].word; 
	}
}