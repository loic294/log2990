import AbsCamera, { CameraConstants } from "./AbsCamera";
import { PerspectiveCamera } from "three";
import { Car } from "../car/car";

const FIELD_OF_VIEW: number = 70;
const INITIAL_HEIGHT: number = 3;
const INTIAL_DISTANCE_FACTOR: number = 10;
const DISTANCE_VARIATION: number = 0.5;
const MAX_DISTANCE_FACTOR: number = 20;
const MIN_DISTANCE_FACTOR: number = 5;
const HEIGHT_VARIATION: number = INITIAL_HEIGHT / INTIAL_DISTANCE_FACTOR * DISTANCE_VARIATION;

export default class ThirdPersonCamera extends AbsCamera {

    private distanceFactor: number;

    public constructor(aspectRatio: number, car: Car) {
        super(aspectRatio, car);
        this._camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            aspectRatio,
            CameraConstants.NEAR_CLIPPING_PLANE,
            CameraConstants.FAR_CLIPPING_PLANE
        );
        this._car = car;
        this. distanceFactor = INTIAL_DISTANCE_FACTOR;
        this._camera.position.set(0, INITIAL_HEIGHT, 0);
    }

    public onResize(aspectRatio: number): void {
        const camera: PerspectiveCamera = this._camera as PerspectiveCamera;

        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
    }

    public follow(): void {
        this._camera.position.x = this._car.meshPosition.x - this.distanceFactor * this._car.direction.x;
        this._camera.position.z = this._car.meshPosition.z - this.distanceFactor * this._car.direction.z;
        this._camera.lookAt(this._car.meshPosition);
    }

    private areLimitsExceeded(isZoomPositive: boolean): boolean {
        return isZoomPositive ? this.distanceFactor > MIN_DISTANCE_FACTOR : this.distanceFactor < MAX_DISTANCE_FACTOR;
    }

    public zoom(isPositive: boolean): void {
        if (this.areLimitsExceeded(isPositive)) {
            this.distanceFactor += (isPositive ? -1 : 1) * DISTANCE_VARIATION;
            this._camera.position.y += (isPositive ? -1 : 1) * HEIGHT_VARIATION;
        }
    }

}
