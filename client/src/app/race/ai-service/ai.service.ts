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
    private _currentCar: Car;

    public constructor(private _track: TrackBuilder, private _npcs: Array<Car>, private SCALE_FACTOR: number) {
        this._pointIndex = 0;
    }

    public update(timeSinceLastFrame: number): void {
        for (const car of this._npcs) {
            this._currentCar = car;
            this.movement();
            this.steering();
            console.log(this.distanceCarToPoint().length());
            console.log(this.lengthOfDistancePointToPoint());
            console.log(this._pointIndex);
            console.log(this.nextPointIndex());
            this._currentCar.update(timeSinceLastFrame);
        }
    }

    private movement(): void {
        this.releaseBrake();
        if (this.distanceGreaterThanDistance(Stage.ACCELERATION)) {
            this.pressAccelerator();
            console.log("ACCELERATING");
        } else if (this.distanceGreaterThanDistance(Stage.RELEASE)) {
            this.releaseAccelerator();
            console.log("RELEASE");
        } else if (this.distanceGreaterThanDistance(Stage.BRAKING)) {
            this.pressBrake();
            console.log("BRAKING");
        } else {
            this.switchLines();
            console.log("SWITCHING LINES");
        }
    }

    private distanceGreaterThanDistance(stage: Stage): boolean {
        return this.distanceCarToPoint().length() >= this.lengthOfDistancePointToPoint() / stage;
    }

    private switchLines(): void {
        this._pointIndex = this.nextPointIndex();
    }

    private distanceCarToPoint(): Vector3 {
        return (new Vector3().subVectors(this.nextPointPosition(), this._currentCar.meshPosition)).multiplyScalar(this.SCALE_FACTOR);
    }

    private lengthOfDistancePointToPoint(): number {
        return (new Vector3().subVectors(this.nextPointPosition(), this.currentPointPosition())).multiplyScalar(this.SCALE_FACTOR).length();
    }

    private steering(): void { // Finish This.
        if (this.isToTheLeftOfLine()) {
            this.steerRight();
            console.log("STEERING RIGHT");
        } else if (this.isToTheRightOfLine()) {
            this.steerLeft();
            console.log("STEERING LEFT");
        } else {
            this.releaseSteering();
            console.log("ON LINE");
        }
    }
/*
    private isOnLine(): boolean {
        return this.distanceCarToPoint().normalize().equals(this._currentCar.direction.normalize());
    }
*/
    private isToTheRightOfLine(): boolean {
        return this.distanceCarToPoint().normalize().dot(this._currentCar.direction.normalize()) < 0;
    }

    private isToTheLeftOfLine(): boolean {
        return this.distanceCarToPoint().normalize().dot(this._currentCar.direction.normalize()) > 0;
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
        this._currentCar.isAcceleratorPressed = false;
    }

    private pressAccelerator(): void {
        this._currentCar.isAcceleratorPressed = true;
    }

    private releaseBrake(): void {
        this._currentCar.releaseBrakes();
    }

    private pressBrake(): void {
        this._currentCar.brake();
    }

    private releaseSteering(): void {
        this._currentCar.releaseSteering();
    }

    private steerLeft(): void {
        this._currentCar.steerLeft();
    }

    private steerRight(): void {
        this._currentCar.steerRight();
    }
}
