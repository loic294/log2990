import { Injectable } from "@angular/core";

interface VectorI {
    x: number;
    y: number;
}

const MOCK_LARGEUR_PISTE: number = 8;

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

  public distance(vertexA: VectorI, vertexB: VectorI): number {
    return Math.sqrt(Math.pow(vertexA.x - vertexB.x, 2) + Math.pow(vertexA.y - vertexB.y, 2));
  }

  public checkIfDistanceIsTwiceTheWidth(distance: number): boolean {
    return distance >= MOCK_LARGEUR_PISTE * 2;
  }

  public intersects(vertexA: VectorI, vertexB: VectorI, vertexC: VectorI, vertexD: VectorI): boolean {
    let det: number, gamma: number, lambda: number;
    det = (vertexB.x - vertexA.x) * (vertexD.y - vertexC.y) - (vertexD.x - vertexC.x) * (vertexB.y - vertexA.y);
    if (det === 0) {
      return false;
    } else {
      lambda = ((vertexD.y - vertexC.y) * (vertexD.x - vertexA.x) + (vertexC.x - vertexD.x) * (vertexD.y - vertexA.y)) / det;
      gamma = ((vertexA.y - vertexB.y) * (vertexD.x - vertexA.x) + (vertexB.x - vertexA.x) * (vertexD.y - vertexA.y)) / det;

      return (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1);
    }
  }

}
