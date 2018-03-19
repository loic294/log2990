import AbsCamera, { CameraConstants } from "./AbsCamera";
import { PerspectiveCamera } from "three";
import { RenderService } from "../render-service/render.service";

const FIELD_OF_VIEW: number = 70;
const INITIAL_HEIGHT: number = 3;
const INTIAL_DISTANCE_FACTOR: number = 10;
const DISTANCE_VARIATION: number = 0.5;
const MAX_DISTANCE_FACTOR: number = 20;
const MIN_DISTANCE_FACTOR: number = 5;
const HEIGHT_VARIATION: number = INITIAL_HEIGHT / INTIAL_DISTANCE_FACTOR * DISTANCE_VARIATION;

export default class ThirdPersonCamera extends AbsCamera {

    private distanceFactor: number;

    public constructor(renderer: RenderService) {
        super(renderer);
        this._camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            renderer.getAspectRatio(),
            CameraConstants.NEAR_CLIPPING_PLANE,
            CameraConstants.FAR_CLIPPING_PLANE
        );
        this. distanceFactor = INTIAL_DISTANCE_FACTOR;
        this._camera.position.set(0, INITIAL_HEIGHT, 0);
    }

    public onResize(): void {
        const camera: PerspectiveCamera = this._camera as PerspectiveCamera;

        camera.aspect = this.renderer.getAspectRatio();
        camera.updateProjectionMatrix();
    }

    public follow(): void {
        this._camera.position.x = this.renderer.car.meshPosition.x - this.distanceFactor * this.renderer.car.direction.x;
        this._camera.position.z = this.renderer.car.meshPosition.z - this.distanceFactor * this.renderer.car.direction.z;
        this._camera.lookAt(this.renderer.car.meshPosition);
    }

    public zoom(isPositive: boolean): void {
        // Vérifier la nécessité de modifier la hauteur de la cam
        if (( this.distanceFactor > MIN_DISTANCE_FACTOR || !isPositive ) &&
            ( this.distanceFactor < MAX_DISTANCE_FACTOR || isPositive ) ) {
            this.distanceFactor += (isPositive ? -1 : 1) * DISTANCE_VARIATION;
            this._camera.position.y += (isPositive ? -1 : 1) * HEIGHT_VARIATION;
        }
    }

}
