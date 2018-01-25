import * as test from './middleware'

export default {
	base: '/test',
	routes: [{
		method: 'GET',
		path: '/lexical',
		middleware: [
			test.lexical
		]
	}]
}