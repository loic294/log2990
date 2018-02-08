import * as user from './middleware'

export default {
	base: '/user',
	routes: [{
		method: 'GET',
		path: '/',
		middleware: [
			user.me
		]
	}]
}