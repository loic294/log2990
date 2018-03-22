import { Vector3 } from "three";

export default class Track {

    public constructor(private _vertices: Array<Vector3>) {

    }

    public get vertices(): Array<Vector3> {
        return this._vertices;
    }

    public set vertices(vertices: Array<Vector3>) {
        this._vertices = vertices;
    }
}
