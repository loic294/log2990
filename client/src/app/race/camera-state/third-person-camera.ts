import AbsCamera, { CameraConstants } from "./ICamera";
import { Vector3, PerspectiveCamera } from "three";
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
    }

    public onResize(): void {
        const camera: PerspectiveCamera = this._camera as PerspectiveCamera;

        camera.updateProjectionMatrix();
    }

    public follow(carMeshPosition: Vector3): void {
    }
}
