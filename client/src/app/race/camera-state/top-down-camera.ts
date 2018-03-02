import AbsCamera , { CameraConstants } from "./ICamera";
import { Vector3, OrthographicCamera } from "three";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";

export default class TopDownCamera extends AbsCamera {

    public constructor(renderer: RenderService) {
        super(renderer);

        this._camera = new OrthographicCamera(
            CameraConstants.FIELD_OF_VIEW,
            renderer.getAspectRatio(),
            CameraConstants.NEAR_CLIPPING_PLANE,
            CameraConstants.FAR_CLIPPING_PLANE
        );
    }

    public onResize(): void {
        const camera: OrthographicCamera = this._camera as OrthographicCamera;

        camera.updateProjectionMatrix();
    }

    public follow(carMeshPosition: Vector3): void {
        this._camera.position.x = this.renderer.car.meshPosition.x;
        this._camera.position.z = this.renderer.car.meshPosition.z;
    }
}
