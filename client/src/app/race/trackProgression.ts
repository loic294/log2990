import { Vector3, Clock, Object3D } from "three";
import { Car } from "./car/car";
import { IGameInformation, TrackProgressionService } from "./trackProgressionService";

const WIDTH: number = 10;
const MAX_LAPS: number = 3;
const TIME_FACTOR: number = 0.1;

export class TrackProgression {
    private _game: IGameInformation;
    private _gameClock: Clock;

    public constructor(private _startingLine: Vector3, private _playerCar: Car, private _botCars: Array<Car>,
                       private _trackProgressionService: TrackProgressionService, private _vertice: Array<Object3D>) {

        this._game = {gameTime: "0.00", lapTime: "0.00", lapTimes: new Array(),
                      gameIsFinished: false, currentLap: 0, botTimes: new Array()};

        let index: number = 0;
        while (index < this._botCars.length) {
            this._game.botTimes.push(new Array());
            index++;
        }
        this._trackProgressionService.sendGameProgress(this._game);
        this._gameClock = new Clock();
        this._gameClock.start();

        this.startCar(this._playerCar);
        this._playerCar.userData.verticeIndex = 1;

        for (const car of this._botCars) {
            this.startCar(car);
        }
    }

    private startCar(car: Car): void {
        car.userData.isNewLap = false;
        car.userData.lapsCompleted = 0;
        car.userData.clock = new Clock();
        car.userData.clock.start();
    }

    public checkRaceProgress(): void {

        this.updatePlayerInformation();

        let botIndex: number = 0;
        for (const bot of this._botCars) {
            this.updateBotInformation(bot, botIndex);
            botIndex++;
        }

        this._trackProgressionService.sendGameProgress(this._game);

    }

    private isLapCompleted(car: Car): boolean {
        return this.isAtStartingLine(car) && this._playerCar.userData.verticeIndex === this._vertice.length - 1 &&
               !this._game.gameIsFinished;
    }

    private isAtStartingLine(car: Car): boolean {
        const carDistance: number = this.getCarDistance(this._startingLine, car);

        return car.userData.isNewLap && carDistance < WIDTH / 2;
    }

    private isPassedStartingLine(car: Car): boolean {
        const carDistance: number = this.getCarDistance(this._startingLine, car);

        return !car.userData.isNewLap && carDistance > WIDTH;
    }

    private asJustCompleted3Laps(): boolean {
        return this._playerCar.userData.lapsCompleted >= MAX_LAPS && !this._game.gameIsFinished;
    }

    private checkForNextVertex(): void {
        const carDistance: number = this.getCarDistance(this._vertice[this._playerCar.userData.verticeIndex].position, this._playerCar);

        if (carDistance <= WIDTH * 2 && this._playerCar.userData.verticeIndex < this._vertice.length - 1) {
            this._playerCar.userData.verticeIndex++;
        }
    }

    private getCarDistance(destination: Vector3, car: Car): number {
        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(destination, car.meshPosition);

        return carPosition.length();
    }

    private updatePlayerInformation(): void {
        if (this.isLapCompleted(this._playerCar)) {
            this._playerCar.userData.lapsCompleted++;
            this._playerCar.userData.isNewLap = false;
            this._playerCar.userData.verticeIndex = 1;

            this._game.currentLap++;
            this._game.lapTimes.push(this._playerCar.userData.clock.getElapsedTime().toFixed(2));
            this._playerCar.userData.clock.start();
        } else if (this.isPassedStartingLine(this._playerCar)) {
            this._playerCar.userData.isNewLap = true;
        }

        if (this.asJustCompleted3Laps()) {
            this.stopGame();
        } else if (!this._game.gameIsFinished) {
            this._game.gameTime = this._gameClock.getElapsedTime().toFixed(2);
            this._game.lapTime = this._playerCar.userData.clock.getElapsedTime().toFixed(2);
        } else {
            this._playerCar.brake();
        }

        this.checkForNextVertex();
    }

    private stopGame(): void {
        this._playerCar.userData.clock.stop();
        this._gameClock.stop();
        this.estimateBotTimes();

        for (const bot of this._botCars) {
            bot.userData.allLapsCompleted = true;
        }

        this._game.gameIsFinished = true;
    }

    private updateBotInformation(bot: Car, botIndex: number): void {
        if (this.isAtStartingLine(bot) && bot.userData.lapsCompleted < MAX_LAPS) {
            bot.userData.lapsCompleted++;
            bot.userData.isNewLap = false;

            this._game.botTimes[botIndex].push(bot.userData.clock.getElapsedTime().toFixed(2));
            bot.userData.clock.start();
        } else if (this.isPassedStartingLine(bot) && bot.userData.lapsCompleted >= MAX_LAPS) {
            bot.userData.allLapsCompleted = true;
        } else if (this.isPassedStartingLine(bot)) {
            bot.userData.isNewLap = true;
        }
    }

    private estimateBotTimes(): void {
        let botIndex: number = 0;
        let timeFactor: number = 1.05;
        for (const bot of this._botCars) {
            if (this._game.botTimes[botIndex].length === 0) {
                this._game.botTimes[botIndex].push(this.calculateFirstRoundTime(bot).toFixed(2));
                bot.userData.lapsCompleted++;
            }

            while (bot.userData.lapsCompleted < MAX_LAPS) {
                this._game.botTimes[botIndex].push(this.calculateSubsequentRoundTime(bot, botIndex, timeFactor).toFixed(2));
                bot.userData.lapsCompleted++;
                timeFactor += TIME_FACTOR;
            }
            botIndex++;

        }
    }

    private calculateFirstRoundTime(bot: Car): number {
        return (bot.userData.maxIndex * bot.userData.clock.getElapsedTime()) / bot.userData.pointIndex;
    }

    private calculateSubsequentRoundTime(bot: Car, botIndex: number, timeFactor: number): number {
        return Number(this._game.botTimes[botIndex][0]) * timeFactor;
    }

    public get player(): Car {
        return this._playerCar;
    }

    public get bots(): Array<Car> {
        return this._botCars;
    }

    public get game(): IGameInformation {
        return this._game;
    }

    public get vertice(): Array<Object3D> {
        return this._vertice;
    }
}
