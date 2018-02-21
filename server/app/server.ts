 /* tslint:disable */ 
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as cors from "cors";
import routes from "./routes/index";
import Game, { IGameModel } from "./models/game";

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
    socket.on("get_games", async function () {
        const games: IGameModel[] = await Game.find();
        socket.emit("add_games", games);
    })

    socket.on('create_game', async function (room: string) {
        const game: IGameModel = new Game({
            name: room,
            createdAt: new Date(),
        });
        await game.save();
        socket.emit("created_game", game);
        Game.count({name: room}, function (err, count){
            console.log("created game in db ", count);
        });
    });

    socket.on("connect_to_game", async function (room: string) {
        const game = await Game.findOne({ name: room });

        if (game.players.length === 0 ) {
            socket.join(room);
            await Game.findOneAndUpdate(room, {
                    players : ["player1"]
                })
            console.log("connecting player 1 to ", room);
            socket.emit("connected_to_game", io.sockets.adapter.rooms[room].length);
        }
        else if (game.players.length === 1 ) {
            socket.join(room);
            await Game.findOneAndUpdate(room, {
                players : ["player1", "player2"]
            })
            console.log("connecting player 2 to ", room);
            socket.emit("connected_to_game", io.sockets.adapter.rooms[room].length);
            await game.remove();
        }
        else {
            console.log("Already 2 players");
        }
    });
});


server.listen(3000, () => console.log("Listening on port 3000"))
