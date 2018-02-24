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
        const games: IGameModel[] = await Game.find({
            $and: [{
                "players.0": { "$exists": true }
            },{
                "players.1": { "$exists": false }
            }]
            
        });
        socket.emit("add_games", games);
    })

    socket.on('create_game', async function (data: string) {
        const { gameId: room, value } : { gameId: string, value: string } = JSON.parse(data);
        const game: IGameModel = new Game({
            name: room,
            createdAt: new Date(),
            players: []
        });
        await game.save();
        console.log(game, value);
        
        socket.emit("created_game", game);
        Game.count({name: room}, function (err, count){
            console.log("created game in db ", count);
        });
    });

    socket.on("connect_to_game", async function (data: string) {
        const { gameId: room, value } : { gameId: string, value: string } = JSON.parse(data);
        const game = await Game.findOne({ name: room });

        console.log('CONNECT TO GAME', room)

        if (game.players.length === 0 ) {
            socket.join(room);
            await Game.findOneAndUpdate({name: game.name}, {
                    players : [value]
                })
            console.log("connecting player 1 to ", room);
            socket.emit("connected_to_game", JSON.stringify({game}));
        }
        else if (game.players.length === 1 ) {
            socket.join(room);
            await Game.findOneAndUpdate({name: game.name}, {
                players : ["player1", "player2"]
            })
            console.log("connecting player 2 to ", room);
            socket.emit("connected_to_game", io.sockets.adapter.rooms[room].length);
        }
        else {
            console.log("Already 2 players");
		}
		
		socket.on("highligth_cell", (data: string) => {
			console.log('CELL TO HILIGHT', data)
			console.log('ROOM', room)
			socket.emit('highligth_cell_in_color', data)
		})

        socket.on('disconnect', async function(){
            await game.remove();
            console.log("disconnect", game);
        })
    });
});


server.listen(3000, () => console.log("Listening on port 3000"))
