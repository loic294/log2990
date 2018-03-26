import { Injectable } from "@angular/core";
import { TrackBuilder } from "../trackBuilder";
import { Car } from "../car/car";
import { Vector3 } from "three";

enum Stage {
    ACCELERATION = 2,
    RELEASE = 4,
    BRAKING = 8
}

@Injectable()
export class AiService {

    private _pointIndex: number;

    public constructor(private _track: TrackBuilder, private _car: Car) {
        this._pointIndex = 0;
    }

    public update(): void {
        this.movement();
        this.steering();
    }

    private movement(): void {
        this.releaseBrake();
        if (this.distanceGreaterThanDistance(Stage.ACCELERATION)) {
            this.pressAccelerator();
        } else if (this.distanceGreaterThanDistance(Stage.RELEASE)) {
            this.releaseAccelerator();
        } else if (this.distanceGreaterThanDistance(Stage.BRAKING)) {
            this.pressBrake();
        } else {
            this.switchLines();
            this.movement();
        }
    }

    private distanceGreaterThanDistance(stage: Stage): boolean {
        return this.distanceCarToPoint().length() >= this.lengthOfDistancePointToPoint() / stage;
    }

    private switchLines(): void {
        this._pointIndex = this.nextPointIndex();
    }

    private distanceCarToPoint(): Vector3 {
        return (new Vector3().subVectors(this.nextPointPosition(), this._car.meshPosition));
    }

    private lengthOfDistancePointToPoint(): number {
        return (new Vector3().subVectors(this.nextPointPosition(), this.currentPointPosition())).length();
    }

    private steering(): void { // Finish This.
        if (this.isOnLine()) {
            this.releaseSteering();
        } else if (this.isToTheRightOfLine()) {
            this.steerLeft();
        } else {
            this.steerRight();
        }
    }

    private isOnLine(): boolean {
        return this.distanceCarToPoint().normalize() === this._car.direction.normalize();
    }

    private isToTheRightOfLine(): boolean {
        return this.distanceCarToPoint().normalize().dot(this._car.direction.normalize()) > 0;
    }

    private currentPointPosition(): Vector3 {
        return this._track.vertices[this._pointIndex].position;
    }

    private nextPointPosition(): Vector3 {
        return this._track.vertices[this.nextPointIndex()].position;
    }

    private nextPointIndex(): number {
        return (this._pointIndex >= this._track.vertices.length ? 0 : this._pointIndex + 1);
    }

    private releaseAccelerator(): void {
        this._car.isAcceleratorPressed = false;
    }

    private pressAccelerator(): void {
        this._car.isAcceleratorPressed = true;
    }

    private releaseBrake(): void {
        this._car.releaseBrakes();
    }

    private pressBrake(): void {
        this._car.brake();
    }

    private releaseSteering(): void {
        this._car.releaseSteering();
    }

    private steerLeft(): void {
        this._car.steerLeft();
    }

    private steerRight(): void {
        this._car.steerRight();
    }
}
