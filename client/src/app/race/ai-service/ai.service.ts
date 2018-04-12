import { Injectable } from "@angular/core";
import { TrackBuilder } from "../trackBuilder";
import { Car } from "../car/car";
import { Vector3 } from "three";

enum Stage {
    ACCELERATION = 2,
    RELEASE = 16,
    BRAKING = 32
}

@Injectable()
export class AiService {

    private _pointIndex: number;
    private _currentCar: Car;

    public constructor(private _track: TrackBuilder, private _npcs: Array<Car>) {
        this._pointIndex = 0;
        for (const npc of this._npcs) {
            npc.userData.pointIndex = 0;
            npc.userData.maxIndex = this._track.vertices.length;
            npc.userData.allLapsCompleted = false;
        }
    }

    public update(timeSinceLastFrame: number): void {
        for (const car of this._npcs) {
            if (car.userData.allLapsCompleted) {
                car.brake();
            } else {
                this._currentCar = car;
                this.movement();
                this.steering();
                this._currentCar.update(timeSinceLastFrame);
            }
        }
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
        }
    }

    private distanceGreaterThanDistance(stage: Stage): boolean {
        return this.lengthOfDistanceCarToPoint() >= this.lengthOfDistancePointToPoint() / stage;
    }

    private switchLines(): void {
        this._pointIndex = this.nextPointIndex();
    }

    private lengthOfDistanceCarToPoint(): number {
        return Math.abs((this._currentCar.meshPosition.distanceTo(this.nextPointPosition())));
    }

    private distanceCarToPoint(): Vector3 {
        return (new Vector3().subVectors(this.nextPointPosition(), this._currentCar.meshPosition));
    }

    private lengthOfDistancePointToPoint(): number {
        return Math.abs((this.currentPointPosition().distanceTo(this.nextPointPosition())));
    }

    private steering(): void {
        if (this.isToTheLeftOfLine()) {
            this.steerRight();
        } else if (this.isToTheRightOfLine()) {
            this.steerLeft();
        } else {
            this.releaseSteering();
        }
    }
/*
    private isOnLine(): boolean {
        return this.distanceCarToPoint().normalize().equals(this._currentCar.direction.normalize());
    }
*/
    private isToTheRightOfLine(): boolean {
        return this.distanceCarToPoint().normalize().cross(this._currentCar.direction.normalize()).y < 0;
    }

    private isToTheLeftOfLine(): boolean {
        return this.distanceCarToPoint().normalize().cross(this._currentCar.direction.normalize()).y > 0;
    }

    private currentPointPosition(): Vector3 {
        return this._track.vertices[this._pointIndex].position;
    }

    private nextPointPosition(): Vector3 {
        return this._track.vertices[this.nextPointIndex()].position;
    }

    private nextPointIndex(): number {
        this._currentCar.userData.pointIndex = (this._pointIndex >= this._track.vertices.length - 1 ? 0 : this._pointIndex + 1);

        return (this._pointIndex >= this._track.vertices.length - 1 ? 0 : this._pointIndex + 1);
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
