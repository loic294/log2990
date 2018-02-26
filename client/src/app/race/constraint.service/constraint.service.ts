import { Injectable } from "@angular/core";
import {
    Object3D, Line, Vector2
} from "three";

const HALF_CIRCLE: number = 180;
const TWO: number = 2;

const MOCK_LARGEUR_PISTE: number = 3;

@Injectable()
export class ConstraintService {

  public constructor() { }

  public converteToDegre(angle: number): number {
        if (angle < 0) { angle += TWO * Math.PI; }

        return angle * HALF_CIRCLE / Math.PI;
  }

  public getAngleOfTwoVectors(vectorA: Vector2, vectorB: Vector2): number {
    const angle: number = vectorA.angle() - vectorB.angle();

    return this.converteToDegre(angle);
  }

  public checkIfAngleIsValid(angle: number): boolean {
    const MIN_ANGLE: number = 45;

    return angle > MIN_ANGLE && angle < HALF_CIRCLE * TWO - MIN_ANGLE;
  }

  public checkDistance(distance: number): boolean {
    return distance <= MOCK_LARGEUR_PISTE * 2;
  }

  public intersects({ x: x1, y: y1 }: Vector2, { x: x2, y: y2 }: Vector2, { x: x3, y: y3 }: Vector2, { x: x4, y: y4 }: Vector2): boolean {

    let ua: number, ub: number;
    const det: number = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (det === 0) {
        return false;
    }
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / det;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / det;

    return (ua > 0 && ua < 1) && (ub > 0 && ub < 1);
  }

  public vectorFromLine(line: Line, odd: boolean): Vector2 {
    const x: number = line.userData.vertices[odd ? 0 : 1].x - line.userData.vertices[odd ? 1 : 0].x;
    const y: number = line.userData.vertices[odd ? 0 : 1].z - line.userData.vertices[odd ? 1 : 0].z;

    return new Vector2(x, y);
  }

  public lineToPoint(line: Line, index: number): Vector2 {
    return new Vector2(line.userData.vertices[index].x, line.userData.vertices[index].z);
  }

  public findIntersection(edges: Array<Line>): Array<number> {
    const invalid: Array<number> = [];

    edges.forEach((edge: Line, index: number) => {
        for (let j: number = index + 1; j < edges.length; j++) {
            const intersects: boolean = this.intersects(
                this.lineToPoint(edge, 0),
                this.lineToPoint(edge, 1),
                this.lineToPoint(edges[j], 0),
                this.lineToPoint(edges[j], 1)
            );

            if (intersects) {
                invalid.push(index);
                invalid.push(j);
            }
        }
    });

    return invalid;
  }

  public validate(vertices: Array<Object3D>, edges: Array<Line>): Array<number> {

    let invalid: Array<number>  = [];

    if (edges.length > 1) {
        for (let i: number = 0; i < edges.length - 1; i++) {
            const edge1: Vector2 = this.vectorFromLine(edges[i], true);
            const edge2: Vector2 = this.vectorFromLine(edges[i + 1], false);
            const angle: number = this.getAngleOfTwoVectors(edge1, edge2);

            if (!this.checkIfAngleIsValid(angle)) {
                invalid.push(i);
                invalid.push(i + 1);
            }

            if (this.checkDistance(edge1.length())) {
                invalid.push(i);
            }

            if (this.checkDistance(edge2.length())) {
                invalid.push(i + 1);
            }

            invalid = [...invalid, ...this.findIntersection(edges)];

        }
    }

    return invalid;
  }

}
