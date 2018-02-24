 /* tslint:disable */ 
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as cors from "cors";
import routes from "./routes/index";
import sockets from "./socket/index";

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
app.use(cors());


app = routes(app);

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket: any) {
	console.log('Connected to socket');
	sockets(socket)
});


server.listen(3000, () => console.log("Listening on port 3000"))
