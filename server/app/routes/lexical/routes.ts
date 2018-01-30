import * as lexical from './middleware'

// Use these routes to test services that are normally only accessible via another service/route

export default {
	base: '/lexical',
	routes: [{
		method: 'GET',
		path: '/:word/',
		middleware: [
			lexical.lexical
		]
	}, {method: 'GET',
		path: '/wordsearch/:common/:word',
		middleware: [
			lexical.wordSearch
		]
	}]
}