import * as fs from 'fs'
import { Request, Response, NextFunction } from "express";

const asyncMiddleware = (fn: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

export default function (app: any) {

	fs.readdirSync(__dirname).forEach(function(filename) {
		
    if (!filename.includes('.js')) {
			const { routes, base } = require(`${__dirname}/${filename}/routes`).default
			routes.forEach(({ method, path, middleware } : { method: string, path: string, middleware: Array<(req: Request, res: Response, next: NextFunction ) => void> }) => {
				app[method.toLowerCase()](`${base}${path}`, ...middleware.map((m) => asyncMiddleware(m)))
			})
		}
		
  });

	return app
}