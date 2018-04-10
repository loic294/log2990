import { Vector3, Mesh } from "three";

export default class TrackSegment {

    public constructor(private _initialPosition: Vector3, private _finalPosition: Vector3, private _track: Mesh) {

    }

    public get initialPosition(): Vector3 {
        return this._initialPosition;
    }

    public set initialPosition(initialPosition: Vector3) {
        this._initialPosition = initialPosition;
    }

    public get finalPosition(): Vector3 {
        return this._finalPosition;
    }

    public set finalPosition(finalPosition: Vector3) {
        this._finalPosition = finalPosition;
    }

    public get track(): Mesh {
        return this._track;
    }

    public set track(track: Mesh) {
        this._track = track;
    }

}
