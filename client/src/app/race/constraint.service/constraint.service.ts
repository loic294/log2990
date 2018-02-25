import { Injectable } from "@angular/core";

interface VectorI {
    x: number;
    y: number;
}

@Injectable()
export class ConstraintService {

  public constructor() { }

  public converteToDegre(angle: number): number {
        const HALF_CIRCLE: number = 180;

        return Math.abs(angle) * HALF_CIRCLE / Math.PI;
  }

  public getAngleOfTwoVectors(vectorA: VectorI, vectorB: VectorI): number {
    const angle: number = Math.atan2(vectorA.y, vectorA.x) - Math.atan2(vectorB.y,  vectorB.x);

    return this.converteToDegre(angle);
  }

  public checkIfAngleIsValid(angle: number): boolean {
    const MIN_ANGLE: number = 45;

    return angle >= MIN_ANGLE;
  }

}
