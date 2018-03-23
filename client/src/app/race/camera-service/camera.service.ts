import { Injectable } from "@angular/core";
import AbsCamera from "../camera-state/AbsCamera";
import TopDownCamera from "../camera-state/top-down-camera";
import ThirdPersonCamera from "../camera-state/third-person-camera";
import { Camera } from "three";
import { Car } from "../car/car";

enum CAMERA_VIEW {
    TOP_DOWN = 0,
    THIRD_PERSON = 1
}

// Est-ce que je suis mieux de créé les cam au début?

@Injectable()
export class CameraService {

    private _cameraView: number;
    private _cameraState: AbsCamera;
    private _car: Car;
    private _aspectRatio: number;

    public initialize(car: Car, aspectRatio: number ): void {
        this._car = car;
        this._aspectRatio = aspectRatio;
        this._cameraState = new ThirdPersonCamera(this._aspectRatio, this._car);
        this._cameraView = CAMERA_VIEW.THIRD_PERSON;
    }

    public follow(): void {
        this._cameraState.follow();
    }

    public changeCamera(): void {
        if (this._cameraView === CAMERA_VIEW.THIRD_PERSON) {
            this._cameraState = new TopDownCamera(this._aspectRatio, this._car);
            this._cameraView = CAMERA_VIEW.TOP_DOWN;
        } else {
            this._cameraState = new ThirdPersonCamera(this._aspectRatio, this._car);
            this._cameraView = CAMERA_VIEW.THIRD_PERSON;
        }
    }

    public get camera(): Camera {
        return this._cameraState.camera;
    }

    public onResize(aspectRatio: number): void {
        this._aspectRatio = aspectRatio;
        this._cameraState.onResize(aspectRatio);
    }

    public zoom(isPositive: boolean): void {
        this._cameraState.zoom(isPositive);
    }
}
