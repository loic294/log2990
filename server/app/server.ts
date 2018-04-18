import * as express from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as cors from "cors";
import routes from "./routes/index";
import sockets from "./socket/index";
import { Http2Server } from "http2";
import * as SocketIO from "socket.io";

const PORT: number = 3000;
let app: express.Application = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app = routes(app);

const server: Http2Server = require("http").Server(app);
const io: SocketIO.Server = require("socket.io")(server);

// C'est le type utilisé dans les example de la librairie.
// tslint:disable-next-line:no-any
io.on("connection", (socket: any) => {
    sockets(socket);
});

// On veut savoir lorsque le serveur a démarré.
// tslint:disable-next-line:no-console
server.listen(PORT, () => console.log("Listening on port 3000"));
