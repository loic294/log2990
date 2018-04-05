/* tslint:disable: no-magic-numbers */
import { SpotLight, Vector3 } from "three";

enum LIGHT_POSITION {
    FRONT_LEFT,
    FRONT_RIGHT
}

export default class Headlights {
    private _headlights: Array<SpotLight>;

    public constructor() {
        this._headlights = new Array<SpotLight>();
        this._headlights.push(new SpotLight("0xffffff", 1, 10, 0.5, 1, 1));
        this._headlights.push(new SpotLight("0xffffff", 1, 10, 0.5, 1, 1));
    }

    public update(carPosition: Vector3, carDirection: Vector3): void {
        // console.log(carPosition);
        this._headlights[LIGHT_POSITION.FRONT_LEFT].position.set(carPosition.x, 2, carPosition.z );
    }

    public get lights(): Array<SpotLight> {
        return this._headlights;
    }

}
