import { Vector3, Clock } from "three";
import { Car } from "./car/car";
import { IGameInformation, TrackProgressionService } from "./trackProgressionService";

const WIDTH: number = 10;
const MAX_LAPS: number = 3;

export class TrackProgression {
    private _game: IGameInformation;

    public constructor(private _startingLine: Vector3, private _playerCar: Car, private _botCars: Array<Car>,
                       private _trackProgressionService: TrackProgressionService) {

        this._game = {gameTime: 0, lapTimes: new Array(), gameIsFinished: false, currentLap: 1, botTimes: new Array()};

        let index: number = 0;
        while (index < this._botCars.length) {
            this._game.botTimes.push(new Array());
            index++;
        }
        this._trackProgressionService.sendGameProgress(this._game);

        this.startCar(this._playerCar);

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

    private updatePlayerInformation(): void {
        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(this._startingLine, this._playerCar.meshPosition);
        const carDistance: number = carPosition.length();

        if (this._playerCar.userData.isNewLap && carDistance < WIDTH / 2 && !this._game.gameIsFinished) {
            this._playerCar.userData.lapsCompleted++;
            this._playerCar.userData.isNewLap = false;

            this._game.currentLap++;
            this._game.lapTimes.push(this._playerCar.userData.clock.getElapsedTime().toFixed(2));
        } else if (!this._playerCar.userData.isNewLap && carDistance > WIDTH) {
            this._playerCar.userData.isNewLap = true;
        }

        if (this._playerCar.userData.lapsCompleted >= MAX_LAPS && !this._game.gameIsFinished) {
            this._game.gameIsFinished = true;
            this._playerCar.userData.clock.stop();
            this.estimateBotTimes();
        } else {
            this._game.gameTime = this._playerCar.userData.clock.getElapsedTime().toFixed(2);
        }
    }

    private updateBotInformation(bot: Car, botIndex: number): void {
        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(this._startingLine, bot.meshPosition);
        const carDistance: number = carPosition.length();

        if (bot.userData.isNewLap && carDistance < WIDTH / 2) {
            bot.userData.lapsCompleted++;
            bot.userData.isNewLap = false;

            this._game.botTimes[botIndex].push(bot.userData.clock.getElapsedTime().toFixed(2));
        } else if (!bot.userData.isNewLap && carDistance > WIDTH) {
            bot.userData.isNewLap = true;
        }

        if (bot.userData.lapsCompleted >= MAX_LAPS) {
            bot.userData.clock.stop();
        }
    }

    private estimateBotTimes(): void {
        let botIndex: number = 0;
        for (const bot of this._botCars) {
            if (bot.userData.lapsCompleted < MAX_LAPS) {
                this._game.botTimes[botIndex].push(bot.userData.clock.getElapsedTime().toFixed(2));
                botIndex++;
            }
        }
    }

}
