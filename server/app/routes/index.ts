import * as fs from 'fs'
import { Request, Response, NextFunction } from "express";

export default function (app: any) {

	fs.readdirSync(__dirname).forEach(function(filename) {
		
    if (!filename.includes('.js')) {
			console.log('FILENAME', filename)
			const { routes, base } = require(`${__dirname}/${filename}/routes`).default
			console.log('ROUTE', routes, base)
			routes.forEach(({ method, path, middleware } : { method: string, path: string, middleware: Array<(req: Request, res: Response, next: NextFunction ) => void> }) => {
				app[method.toLowerCase()](`${base}${path}`, ...middleware)
			})
    }
  });

	return app
}