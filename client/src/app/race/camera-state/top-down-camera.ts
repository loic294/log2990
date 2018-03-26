import AbsCamera, { CameraConstants } from "./AbsCamera";
import { OrthographicCamera } from "three";
import { Car } from "../car/car";

const DISTANCE_VARIATION: number = 0.98;
const MAX_ZOOM_FACTOR: number = 2;
const MIN_ZOOM_FACTOR: number = 0.5;
const INITIAL_HEIGHT: number = 50;

export default class TopDownCamera extends AbsCamera {

    public constructor(aspectRatio: number, car: Car) {
        super(aspectRatio, car);

        this._camera = new OrthographicCamera(
            INITIAL_HEIGHT * aspectRatio / -2,
            INITIAL_HEIGHT * aspectRatio / 2,
            INITIAL_HEIGHT / 2,
            INITIAL_HEIGHT / -2,
            CameraConstants.NEAR_CLIPPING_PLANE,
            CameraConstants.FAR_CLIPPING_PLANE
        );
        this._car = car;
        this._camera.position.set(car.meshPosition.x, INITIAL_HEIGHT, car.meshPosition.z);
        this._camera.lookAt(car.meshPosition);
    }

    public onResize(aspectRatio: number): void {
        const camera: OrthographicCamera = this._camera as OrthographicCamera;

        camera.left = INITIAL_HEIGHT * aspectRatio / -2;
        camera.right = INITIAL_HEIGHT * aspectRatio / 2;

        camera.updateProjectionMatrix();
    }

    public follow(): void {
        this._camera.position.x = this._car.meshPosition.x;
        this._camera.position.z = this._car.meshPosition.z;
    }

    private areLimitsExceeded(isZoomPositive: boolean, zoom: number): boolean {
        return isZoomPositive ? zoom > MIN_ZOOM_FACTOR : zoom < MAX_ZOOM_FACTOR;
    }

    public zoom(isPositive: boolean): void {
        const camera: OrthographicCamera = this._camera as OrthographicCamera;
        if (this.areLimitsExceeded(isPositive, camera.zoom)) {

            camera.zoom *= (isPositive ? 1 / DISTANCE_VARIATION : DISTANCE_VARIATION);
            camera.updateProjectionMatrix();
        }

    }
}
