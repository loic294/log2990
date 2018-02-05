 /* tslint:disable */ 
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import routes from "./routes/index";
import { Response } from "express";
import { NextFunction } from "express-serve-static-core";
//import { ErrorRequestHandler } from "serve-static/node_modules/@types/express-serve-static-core";

let app = express();

// Config
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));


app = routes(app)

function error404( req: Request, res: Response, next: NextFunction){
  let err: any = new Error("Page not found");
  err.status = 404;
  next(err);
}
app.use(error404);

function errorHandler(err: any, req: Request, res: Response, next: NextFunction){
  res.status(err.status || 500);
  res.send(err.message);
}
app.use(errorHandler);

app.listen(3000, () => console.log("Listening on port 3000"))
