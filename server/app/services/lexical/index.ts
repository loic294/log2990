/*
	This service will be responsible of requesting and creating lexical content.
*/
import axios from 'axios';
const apiKey = "api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"; 

export default class LexicalService {

	constructor() {}

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
        const url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=200&${apiKey}`; 
		try {
			const response = await axios.get(url);
			return response.data;
		} catch(err){
			throw err;
		}
    } 
}