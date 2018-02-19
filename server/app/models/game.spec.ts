 /* tslint:disable */ 
 import Game, { IGame, IGameModel } from "./game";
 import { assert } from "chai";

 const date = new Date()
 
 describe("game modal", () => {

	before(async () => {
        await Game.find().find({ players: {
			$in: ["Loïc"]
		} }).remove();
    })

	 it("should create a game and send it back", async () => {
		const createGame = new Game({
			name: "Test 1",
			createdAt: date,
			players: ["Loïc"]
		})

		const result = await createGame.save();

		assert.deepEqual({
			name: result.name,
			createdAt: result.createdAt,
			players: result.players
		}, {
			name: "Test 1",
			createdAt: date,
			players: ["Loïc"]
		})
	 });

	 it("should find a game by name", async () => {
		 console.log('RENEWKJNGREJk')
		const result:IGameModel = await Game.find().findOne({ players: {
			$in: ["Loïc"]
		} });

		assert.deepEqual({
			name: result.name,
			createdAt: result.createdAt,
			players: result.players
		}, {
			name: "Test 1",
			createdAt: date,
			players: ["Loïc"]
		})
		
	 });
 });
 