import AbsCamera, { CameraConstants } from "./AbsCamera";
import { OrthographicCamera } from "three";
import { RenderService } from "../render-service/render.service";

const DISTANCE_VARIATION: number = 0.98;
const MAX_ZOOM_FACTOR: number = 2;
const MIN_ZOOM_FACTOR: number = 0.5;
const INITIAL_HEIGHT: number = 25;

export default class TopDownCamera extends AbsCamera {

    public constructor(renderer: RenderService) {
        super(renderer);

        this._camera = new OrthographicCamera(
            INITIAL_HEIGHT * renderer.getAspectRatio() / -2,
            INITIAL_HEIGHT * renderer.getAspectRatio() / 2,
            INITIAL_HEIGHT / 2,
            INITIAL_HEIGHT / -2,
            CameraConstants.NEAR_CLIPPING_PLANE,
            CameraConstants.FAR_CLIPPING_PLANE
        );
        this._camera.position.set(0, INITIAL_HEIGHT, 0);
        this._camera.lookAt(renderer.car.position);
    }

    public onResize(): void {
        const camera: OrthographicCamera = this._camera as OrthographicCamera;

        camera.left = INITIAL_HEIGHT * this.renderer.getAspectRatio() / -2;
        camera.right = INITIAL_HEIGHT * this.renderer.getAspectRatio() / 2;

        camera.updateProjectionMatrix();
    }

    public follow(): void {
        this._camera.position.x = this.renderer.car.meshPosition.x;
        this._camera.position.z = this.renderer.car.meshPosition.z;
    }

    public zoom(isPositive: boolean): void {
        const camera: OrthographicCamera = this._camera as OrthographicCamera;
        if ((camera.zoom > MIN_ZOOM_FACTOR || isPositive) &&
            (camera.zoom < MAX_ZOOM_FACTOR || !isPositive)) {

            camera.zoom *= (isPositive ? 1 / DISTANCE_VARIATION : DISTANCE_VARIATION);
            camera.updateProjectionMatrix();
        }

    }
}
