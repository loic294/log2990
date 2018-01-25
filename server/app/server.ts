import { Request, Response } from "express";
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import routes from './routes/index'
// import * as dotenv from 'dotenv';
// dotenv.config({ path: './env'})

console.log('ENV', process.env.SESSION_SECRET)

let app = express()

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

app.use(errorHandler());

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))

app = routes(app)

app.listen(3000, () => console.log('Example app listening on port 3000!'))