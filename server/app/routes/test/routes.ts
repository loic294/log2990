import * as test from './middleware'

// Use these routes to test services that are normally only accessible via another service/route

export default {
	base: '/test',
	routes: [{
		method: 'GET',
		path: '/lexical/:word/',
		middleware: [
			test.lexical
		]
	}]
}