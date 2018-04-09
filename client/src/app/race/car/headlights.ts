import { SpotLight, Vector3, Object3D } from "three";
enum LIGHT_POSITION {
    FRONT_LEFT,
    FRONT_RIGHT
}

const WHITE: number = 0xFFFFFF;
const INTENSITY: number = 2;
const DISTANCE: number = 200;
const ANGLE: number = 0.6;
const EXPONENT: number = 0.2;
const DECAY: number = 1;

const POSITION_X: number = 0.4;
const POSITION_Y: number = 0.5;
const POSITION_Z: number = -1.3;

const TARGET_Y: number = -1;
const TARGET_Z: number = -20;

export default class HeadlightsManager extends Object3D {
    private _headlights: Array<SpotLight>;
    private _isActive: boolean;

    public constructor() {
        super();
        this._isActive = false;
        this._headlights = new Array<SpotLight>();

        this._headlights.push(new SpotLight(WHITE, 0, DISTANCE, ANGLE, EXPONENT, DECAY));
        this._headlights.push(new SpotLight(WHITE, 0, DISTANCE, ANGLE, EXPONENT, DECAY));

        this._headlights[LIGHT_POSITION.FRONT_LEFT].position.copy(new Vector3(POSITION_X, POSITION_Y, POSITION_Z));
        this._headlights[LIGHT_POSITION.FRONT_LEFT].target.position.copy(new Vector3(POSITION_X, TARGET_Y, TARGET_Z));

        this._headlights[LIGHT_POSITION.FRONT_RIGHT].position.copy(new Vector3(-POSITION_X, POSITION_Y, POSITION_Z));
        this._headlights[LIGHT_POSITION.FRONT_RIGHT].target.position.copy(new Vector3(-POSITION_X, TARGET_Y, TARGET_Z));

        for (const light of this._headlights) {
            this.add(light);
            this.add(light.target);
        }
    }

    public toogleLight(): void {
        if (this._isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    public activate(): void {
        for (const light of this._headlights) {
            light.intensity = INTENSITY;
        }
        this._isActive = true;
    }

    public deactivate(): void {
        for (const light of this._headlights) {
            light.intensity = 0;
        }
        this._isActive = false;
    }

    public get lights(): Array<SpotLight> {
        return this._headlights;
    }

    public get isActive(): boolean {
        return this._isActive;
    }
}
