import { Vector3, Clock } from "three";
import { Car } from "./car/car";
import { TrackProgressionService } from "./trackProgressionService";

const WIDTH: number = 10;
const MAX_LAPS: number = 3;

export class TrackProgression {
    private _lapsCompleted: number;
    private _isNewLap: boolean;
    private _clock: Clock;

    public constructor(private _startingLine: Vector3, private _playerCar: Car,
                       private _trackPtogressionService: TrackProgressionService) {
        this._isNewLap = false;
        this._lapsCompleted = 0;
        this._trackPtogressionService.sendGameProgress(false);
        this._clock = new Clock();
        this._clock.start();
    }

    public checkIfAtStartingLine(): void {

        const carPosition: Vector3 = new Vector3;
        carPosition.subVectors(this._startingLine, this._playerCar.meshPosition);
        const carDistance: number = carPosition.length();

        if (this._isNewLap && carDistance < WIDTH / 2) {
            this._lapsCompleted++;
            this._isNewLap = false;
        } else if (!this._isNewLap && carDistance > WIDTH) {
            this._isNewLap = true;
        }

        if (this._lapsCompleted < MAX_LAPS) {
            this._trackPtogressionService.sendGameTime(this._clock.getElapsedTime());
        }

        if (this._lapsCompleted >= MAX_LAPS) {
            this._trackPtogressionService.sendGameProgress(true);
            this._clock.stop();
        }
    }

}
