import { Vector3, Clock, Object3D } from "three";
import { Car } from "./car/car";
import { IGameInformation, TrackProgressionService } from "./trackProgressionService";

const WIDTH: number = 10;
const MAX_LAPS: number = 3;

export class TrackProgression {
    private _game: IGameInformation;
    private _gameClock: Clock;

    public constructor(private _startingLine: Vector3, private _playerCar: Car, private _botCars: Array<Car>,
                       private _trackProgressionService: TrackProgressionService, private _vertice: Array<Object3D>) {

        this._game = {gameTime: "0.00", lapTime: "0.00", lapTimes: new Array(),
                      gameIsFinished: false, currentLap: 1, botTimes: new Array()};

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

    private isLapCompleted(carDistance: number): boolean {
        return this._playerCar.userData.isNewLap && this._playerCar.userData.verticeIndex === this._vertice.length - 1 &&
               carDistance < WIDTH / 2 && !this._game.gameIsFinished;
    }

    private isPassedStartingLine(carDistance: number): boolean {
        return !this._playerCar.userData.isNewLap && carDistance > WIDTH;
    }

    private asJustCompleted3Laps(): boolean {
        return this._playerCar.userData.lapsCompleted >= MAX_LAPS && !this._game.gameIsFinished;
    }

    private checkForNextVertex(): void {
        const carDistance: number = this.getCarDistance(this._vertice[this._playerCar.userData.verticeIndex].position);

        if (carDistance <= WIDTH * 2 && this._playerCar.userData.verticeIndex < this._vertice.length - 1) {
            this._playerCar.userData.verticeIndex++;
        }
    }

    private getCarDistance(destination: Vector3): number {
        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(destination, this._playerCar.meshPosition);

        return carPosition.length();
    }

    private updatePlayerInformation(): void {
        const carDistance: number = this.getCarDistance(this._startingLine);

        if (this.isLapCompleted(carDistance)) {
            this._playerCar.userData.lapsCompleted++;
            this._playerCar.userData.isNewLap = false;
            this._playerCar.userData.verticeIndex = 1;

            this._game.currentLap++;
            this._game.lapTimes.push(this._playerCar.userData.clock.getElapsedTime().toFixed(2));
            this._playerCar.userData.clock.start();
        } else if (this.isPassedStartingLine(carDistance)) {
            this._playerCar.userData.isNewLap = true;
        }

        if (this.asJustCompleted3Laps()) {
            this.stopGame();
        } else if (!this._game.gameIsFinished) {
            this._game.gameTime = this._gameClock.getElapsedTime().toFixed(2);
            this._game.lapTime = this._playerCar.userData.clock.getElapsedTime().toFixed(2);
        }

        this.checkForNextVertex();
    }

    private stopGame(): void {
        this._game.gameIsFinished = true;
        this._playerCar.userData.clock.stop();
        this._gameClock.stop();
        this.estimateBotTimes();

        this._playerCar.brake();

        for (const bot of this._botCars) {
            bot.userData.allLapsCompleted = true;
        }
    }

    private updateBotInformation(bot: Car, botIndex: number): void {
        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(this._startingLine, bot.meshPosition);
        const carDistance: number = carPosition.length();

        if (bot.userData.isNewLap && carDistance < WIDTH / 2 && bot.userData.lapsCompleted < MAX_LAPS) {
            bot.userData.lapsCompleted++;
            bot.userData.isNewLap = false;

            this._game.botTimes[botIndex].push(bot.userData.clock.getElapsedTime().toFixed(2));
            bot.userData.clock.start();
        } else if (!bot.userData.isNewLap && carDistance > WIDTH && bot.userData.lapsCompleted >= MAX_LAPS) {
            bot.userData.allLapsCompleted = true;
        } else if (!bot.userData.isNewLap && carDistance > WIDTH) {
            bot.userData.isNewLap = true;
        }
    }

    private estimateBotTimes(): void {
        let botIndex: number = 0;
        for (const bot of this._botCars) {

            if (this._game.botTimes[botIndex].length === 0) {
                this._game.botTimes[botIndex].push(this.calculateFirstRoundTime(bot).toFixed(2));
                bot.userData.lapsCompleted++;
            }

            while (bot.userData.lapsCompleted < MAX_LAPS) {
                this._game.botTimes[botIndex].push(this.calculateSubsequentRoundTime(bot, botIndex).toFixed(2));
                bot.userData.lapsCompleted++;
            }
            botIndex++;
        }
    }

    private calculateFirstRoundTime(bot: Car): number {
        return (bot.userData.maxIndex * bot.userData.clock.getElapsedTime()) / bot.userData.pointIndex;
    }

    private calculateSubsequentRoundTime(bot: Car, botIndex: number): number {
        return (bot.userData.maxIndex * Number(this._game.botTimes[botIndex][0])) / bot.userData.pointIndex;
    }
}
