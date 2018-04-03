import { Vector3, Clock } from "three";
import { Car } from "./car/car";
import { TrackProgressionService } from "./trackProgressionService";

const WIDTH: number = 10;
const MAX_LAPS: number = 3;

export class TrackProgression {

    public constructor(private _startingLine: Vector3, private _playerCar: Car,
                       private _trackPtogressionService: TrackProgressionService) {
        this._playerCar.userData.isNewLap = false;
        this._playerCar.userData.lapsCompleted = 0;
        this._playerCar.userData.clock = new Clock();
        this._playerCar.userData.clock.start();
        this._trackPtogressionService.sendGameProgress(false);
    }

    public checkRaceProgress(): void {

        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(this._startingLine, this._playerCar.meshPosition);
        const carDistance: number = carPosition.length();

        if (this._playerCar.userData.isNewLap && carDistance < WIDTH / 2) {
            this._playerCar.userData.lapsCompleted++;
            this._playerCar.userData.isNewLap = false;
        } else if (!this._playerCar.userData.isNewLap && carDistance > WIDTH) {
            this._playerCar.userData.isNewLap = true;
        }

        if (this._playerCar.userData.lapsCompleted < MAX_LAPS) {
            this._trackPtogressionService.sendGameTime(this._playerCar.userData.clock.getElapsedTime());
        }

        if (this._playerCar.userData.lapsCompleted >= MAX_LAPS) {
            this._trackPtogressionService.sendGameProgress(true);
            this._playerCar.userData.clock.stop();
        }
    }

}
