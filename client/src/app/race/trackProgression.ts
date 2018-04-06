import { Vector3, Clock } from "three";
import { Car } from "./car/car";
import { IGameInformation, TrackProgressionService } from "./trackProgressionService";

const WIDTH: number = 10;
const MAX_LAPS: number = 3;

export class TrackProgression {
    private _game: IGameInformation;

    public constructor(private _startingLine: Vector3, private _playerCar: Car,
                       private _trackProgressionService: TrackProgressionService) {
        this._playerCar.userData.isNewLap = false;
        this._playerCar.userData.lapsCompleted = 0;
        this._playerCar.userData.clock = new Clock();

        this._game = {gameTime: 0, lapTimes: new Array(), gameIsFinished: false, currentLap: 1};
        this._trackProgressionService.sendGameProgress(this._game);

        this._playerCar.userData.clock.start();
    }

    public checkRaceProgress(): void {

        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(this._startingLine, this._playerCar.meshPosition);
        const carDistance: number = carPosition.length();

        if (this._playerCar.userData.isNewLap && carDistance < WIDTH / 2) {
            this._playerCar.userData.lapsCompleted++;
            this._playerCar.userData.isNewLap = false;

            this._game.currentLap++;
            this._game.lapTimes.push(this._playerCar.userData.clock.getElapsedTime().toFixed(2));
        } else if (!this._playerCar.userData.isNewLap && carDistance > WIDTH) {
            this._playerCar.userData.isNewLap = true;
        }

        if (this._playerCar.userData.lapsCompleted >= MAX_LAPS) {
            this._game.gameIsFinished = true;
            this._trackProgressionService.sendGameProgress(this._game);
            this._playerCar.userData.clock.stop();
        } else {
            this._game.gameTime = this._playerCar.userData.clock.getElapsedTime().toFixed(2);
            this._trackProgressionService.sendGameProgress(this._game);
        }
    }

}
