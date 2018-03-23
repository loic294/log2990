import { Camera } from "three";
import { Car } from "../car/car";

export namespace CameraConstants {
    export const FAR_CLIPPING_PLANE: number = 100000;
    export const NEAR_CLIPPING_PLANE: number = 1;
}

export default abstract class AbsCamera {
    protected _camera: Camera;
    protected _car: Car;

    public constructor(aspectRatio: number, car: Car) {  }

    public get camera(): Camera {
        return this._camera;
    }

    public abstract follow(): void;

    public abstract onResize(aspectRatio: number): void;

    public abstract zoom(isPositive: boolean): void;
}
