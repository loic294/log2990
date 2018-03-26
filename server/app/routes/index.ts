import * as fs from "fs";
import { Request, Response, NextFunction, Application } from "express";

const asyncMiddleware: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void = (fn: Function) =>
    (req: Request, res: Response, next: NextFunction) =>  {
        Promise.resolve(fn(req, res, next))
        .catch(next);
  };

export default (app: Application) => {

    fs.readdirSync(__dirname).forEach((filename: string) => {

    if (!filename.includes(".js")) {
            const { routes, base } = require(`${__dirname}/${filename}/routes`).default;
            routes.forEach(({ method, path, middleware }:
                { method: string, path: string, middleware: Array<(req: Request, res: Response, next: NextFunction ) => void> }) => {
                app[method.toLowerCase()](`${base}${path}`, ...middleware.map((m:
                    (req: Request, res: Response, next: NextFunction) => void) => asyncMiddleware(m)));
            });
        }

  });

    return app;
};
