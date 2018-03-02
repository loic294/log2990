import { Vector3, Camera } from "three";
import { RenderService } from "../render-service/render.service";

export namespace CameraConstants {
    export const FAR_CLIPPING_PLANE: number = 100000;
    export const NEAR_CLIPPING_PLANE: number = 1;
    export const FIELD_OF_VIEW: number = 70;

    export const INITIAL_CAMERA_POSITION_Y: number = 25;
}

export default abstract class AbsCamera {
    protected _camera: Camera;

    public constructor(protected renderer: RenderService) {  }

    public abstract follow(): void;

    public abstract onResize(): void;

    public initialize(carPosition: Vector3): void {
        this._camera.position.set(0, CameraConstants.INITIAL_CAMERA_POSITION_Y, 0);
        this._camera.lookAt(carPosition);
    }

}
