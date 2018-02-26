import { Injectable } from "@angular/core";
import {
    Object3D, Line
} from "three";

interface VectorI {
    x: number;
    y: number;
}

const HALF_CIRCLE: number = 180;
const TWO: number = 2;

const MOCK_LARGEUR_PISTE: number = 2;

@Injectable()
export class ConstraintService {

  public constructor() { }

  public converteToDegre(angle: number): number {
        if (angle < 0) { angle += TWO * Math.PI; }

        return angle * HALF_CIRCLE / Math.PI;
  }

  public getAngleOfTwoVectors(vectorA: VectorI, vectorB: VectorI): number {
    const angle: number = Math.atan2(vectorB.y, vectorB.x) - Math.atan2(vectorA.y,  vectorA.x);

    return this.converteToDegre(angle);
  }

  public checkIfAngleIsValid(angle: number): boolean {
    const MIN_ANGLE: number = 45;

    return angle > HALF_CIRCLE - MIN_ANGLE && angle < HALF_CIRCLE + MIN_ANGLE;
  }

  public distance(vertex: VectorI): number {
    return Math.sqrt(Math.pow(vertex.x, 2) + Math.pow(vertex.y, 2));
  }

  public checkIfDistanceIsTwiceTheWidth(distance: number): boolean {
    console.log("DISTANCE", distance);
    return distance <= MOCK_LARGEUR_PISTE * 2;
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

  public vectorFromLine(line: Line, odd: boolean): VectorI {
    const x: number = line.userData.vertices[odd ? 0 : 1].x - line.userData.vertices[odd ? 1 : 0].x;
    const y: number = line.userData.vertices[odd ? 0 : 1].z - line.userData.vertices[odd ? 1 : 0].z;

    return {
        x: x,
        y: y
    };
  }

  public validate(vertices: Array<Object3D>, edges: Array<Line>): Array<number> {

    const invalid: Array<number>  = [];

    if (edges.length > 1) {

        for (let i: number = 0; i < edges.length - 1; i++) {
            const line1: Line = edges[i];
            const line2: Line = edges[i + 1];

            const edge1: VectorI = this.vectorFromLine(line1, true);
            const edge2: VectorI = this.vectorFromLine(line2, false);
            const angle: number = this.getAngleOfTwoVectors(edge1, edge2);
            // console.log('IS VALID', angle, edge1, edge2, this.checkIfAngleIsValid(angle));

            if (!this.checkIfAngleIsValid(angle)) {
                invalid.push(i);
                invalid.push(i + 1);
            }

            if (this.checkIfDistanceIsTwiceTheWidth(this.distance(edge1))) {
                invalid.push(i);
            }
            if (this.checkIfDistanceIsTwiceTheWidth(this.distance(edge2))) {
                invalid.push(i + 1);
            }

        }
    }

    return invalid;
  }

}
