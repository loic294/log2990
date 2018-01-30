import LexicalService from '../lexical' // USES LEXICAL SERVICE

export default class GridGeneratorService {
	
	private lexicalService: LexicalService = new LexicalService()

	constructor () {
		
	}

	async getWord() { // This is an asynchronos function
		const result = await this.lexicalService.wordDefinition("hard", "test") // This line will wait for method1 to complete before procceding

		console.log('Result', result)

		return result

	}

	async generate() {

		// Let says this returns a word...

		return this.getWord()

	}

}