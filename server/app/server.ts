import { Request, Response } from "express";
import * as express from "express";
import routes from './routes/index'
let app = express()

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))

app = routes(app)

app.listen(3000, () => console.log('Example app listening on port 3000!'))