import AbsCamera, { CameraConstants } from "./ICamera";
import { PerspectiveCamera } from "three";
import { RenderService } from "../render-service/render.service";

export default class ThirdPersonCamera extends AbsCamera {

    public constructor(renderer: RenderService) {
        super(renderer);
        this._camera = new PerspectiveCamera(
            CameraConstants.FIELD_OF_VIEW,
            renderer.getAspectRatio(),
            CameraConstants.NEAR_CLIPPING_PLANE,
            CameraConstants.FAR_CLIPPING_PLANE
        );
        this._camera.position.set(0, CameraConstants.THIRD_PERSON_HEIGHT, 0);

    }

    public onResize(): void {
        const camera: PerspectiveCamera = this._camera as PerspectiveCamera;

        camera.aspect = this.renderer.getAspectRatio();
        camera.updateProjectionMatrix();
    }

    public follow(): void {
        this._camera.position.x = this.renderer.car.meshPosition.x - CameraConstants.DISTANCE_BEHIND_FACTOR * this.renderer.car.direction.x;
        this._camera.position.z = this.renderer.car.meshPosition.z - CameraConstants.DISTANCE_BEHIND_FACTOR * this.renderer.car.direction.z;
        this._camera.lookAt(this.renderer.car.meshPosition);
    }
}
