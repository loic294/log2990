import { Camera } from "three";
import { RenderService } from "../render-service/render.service";

export namespace CameraConstants {
    export const FAR_CLIPPING_PLANE: number = 100000;
    export const NEAR_CLIPPING_PLANE: number = 1;
    export const FIELD_OF_VIEW: number = 70;
    export const THIRD_PERSON_HEIGHT: number = 4;
    export const DISTANCE_BEHIND_FACTOR: number = 10;
    export const INITIAL_CAMERA_POSITION_Y: number = 25;
}

export default abstract class AbsCamera {
    protected _camera: Camera;

    public constructor(protected renderer: RenderService) {  }

    public getCamera(): Camera {
        return this._camera;
    }

    public abstract follow(): void;

    public abstract onResize(): void;
}
