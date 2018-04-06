/* tslint:disable: no-magic-numbers */
import { SpotLight, Vector3, Object3D } from "three";

enum LIGHT_POSITION {
    FRONT_LEFT,
    FRONT_RIGHT
}

export default class Headlights extends Object3D {
    private _headlights: Array<SpotLight>;

    public constructor(carPosition: Vector3) {
        super();
        this._headlights = new Array<SpotLight>();
        this._headlights.push(new SpotLight("0xffffff", 1, 10, 0.5, 1, 1));
        this._headlights.push(new SpotLight("0xffffff", 1, 10, 0.5, 1, 1));
        this._headlights[LIGHT_POSITION.FRONT_LEFT].position.copy(new Vector3(0, 3, 0));
        this._headlights[LIGHT_POSITION.FRONT_LEFT].target.position.copy(new Vector3(-10, 0, 0));
        this.add(this._headlights[0]);
        this.add(this._headlights[0].target);
    }

    public get lights(): Array<SpotLight> {
        return this._headlights;
    }

}
