
/*
	This service will be responsible of requesting and creating lexical content.
*/

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

}