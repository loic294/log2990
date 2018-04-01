import { Vector3 } from "three";
import { Car } from "./car/car";

const WIDTH: number = 10;
const MAX_LAPS: number = 3;

export class TrackProgression {
    private _lapsCompleted: number;
    private _isNewLap: boolean;
    private _raceIsCompleted: boolean;

    public constructor(private _startingLine: Vector3, private _playerCar: Car) {
        this._isNewLap = false;
        this._lapsCompleted = 0;
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

        this._raceIsCompleted = (this._lapsCompleted >= MAX_LAPS);
    }

    public get raceIsCompleted(): boolean {
        return this._raceIsCompleted;
    }

}
