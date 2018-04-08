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

        this._game = {gameTime: 0, lapTime: 0, lapTimes: new Array(), gameIsFinished: false, currentLap: 0};
        this._trackProgressionService.sendGameProgress(this._game);
        this.startClocks();

    }

    private startClocks(): void {
        this._playerCar.userData.clock = new Clock();
        this._playerCar.userData.clock2 = new Clock();
        this._playerCar.userData.clock.start();
        this._playerCar.userData.clock2.start();
    }

    private completedLap(): void {
        this._playerCar.userData.lapsCompleted++;
        this._playerCar.userData.isNewLap = false;

        this._game.currentLap++;

        this._game.lapTimes.push(this._playerCar.userData.clock2.getElapsedTime().toFixed(2));
        this._playerCar.userData.clock2.stop();
    }

    private completedRace(): void {
        this._game.gameIsFinished = true;
        this._trackProgressionService.sendGameProgress(this._game);
        this._playerCar.userData.clock.stop();
    }

    public checkRaceProgress(): void {

        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(this._startingLine, this._playerCar.meshPosition);
        const carDistance: number = carPosition.length();
        const lastLap: boolean = this._playerCar.userData.lapsCompleted >= MAX_LAPS;

        if (this._playerCar.userData.isNewLap && carDistance < WIDTH / 2 && !lastLap) {
          this.completedLap();
        } else if (!this._playerCar.userData.isNewLap && carDistance > WIDTH) {
            this._playerCar.userData.isNewLap = true;
        }

        if (lastLap) {
            this.completedRace();
        } else {
            this._game.gameTime = this._playerCar.userData.clock.getElapsedTime().toFixed(2);
            this._game.lapTime = this._playerCar.userData.clock2.getElapsedTime().toFixed(2);
            this._trackProgressionService.sendGameProgress(this._game);
        }
    }

}
