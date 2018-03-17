import AbsCamera , { CameraConstants } from "./AbsCamera";
import { OrthographicCamera } from "three";
import { RenderService } from "../render-service/render.service";

export default class TopDownCamera extends AbsCamera {

    public constructor(renderer: RenderService) {
        super(renderer);

        this._camera = new OrthographicCamera(
            CameraConstants.INITIAL_CAMERA_POSITION_Y * renderer.getAspectRatio() / -2,
            CameraConstants.INITIAL_CAMERA_POSITION_Y * renderer.getAspectRatio() / 2,
            CameraConstants.INITIAL_CAMERA_POSITION_Y / 2,
            CameraConstants.INITIAL_CAMERA_POSITION_Y / -2,
            CameraConstants.NEAR_CLIPPING_PLANE,
            CameraConstants.FAR_CLIPPING_PLANE
        );
        this._camera.position.set(0, CameraConstants.INITIAL_CAMERA_POSITION_Y, 0);
        this._camera.lookAt(renderer.car.position);
    }

    public onResize(): void {
        const camera: OrthographicCamera = this._camera as OrthographicCamera;

        camera.left = CameraConstants.INITIAL_CAMERA_POSITION_Y * this.renderer.getAspectRatio() / -2;
        camera.right = CameraConstants.INITIAL_CAMERA_POSITION_Y * this.renderer.getAspectRatio() / 2;

        camera.updateProjectionMatrix();
    }

    public follow(): void {
        this._camera.position.x = this.renderer.car.meshPosition.x;
        this._camera.position.z = this.renderer.car.meshPosition.z;
    }
}
